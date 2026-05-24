"""CSV ingestion: parse uploads into immutable RawRecord rows."""

from __future__ import annotations

import json
from io import BytesIO

import pandas as pd
from django.conf import settings
from django.db import transaction

from apps.normalization.pipeline import process_datasource

from .models import DataSource, ProcessingStatus, RawRecord


class UploadParseError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


def _cell_value(val):
    if pd.isna(val):
        return None
    if isinstance(val, float) and val == int(val):
        return int(val)
    if isinstance(val, (int, float, bool)):
        return val
    return str(val).strip()


def _row_to_payload(row: pd.Series) -> dict:
    return {str(k): _cell_value(v) for k, v in row.items()}


def _is_empty_row(payload: dict) -> bool:
    return not any(v is not None and str(v).strip() != "" for v in payload.values())


def parse_csv_to_raw_records(datasource: DataSource, file_bytes: bytes) -> dict:
    """
    Parse CSV bytes and bulk-insert RawRecord rows.
    Returns summary counts for the API response.
    """
    datasource.processing_status = ProcessingStatus.PROCESSING
    datasource.save(update_fields=["processing_status"])

    try:
        df = pd.read_csv(BytesIO(file_bytes), dtype=str, keep_default_na=True)
    except Exception as exc:
        datasource.processing_status = ProcessingStatus.FAILED
        datasource.save(update_fields=["processing_status"])
        raise UploadParseError(f"Could not read CSV: {exc}") from exc

    if df.empty:
        datasource.processing_status = ProcessingStatus.FAILED
        datasource.total_rows = 0
        datasource.save(update_fields=["processing_status", "total_rows"])
        raise UploadParseError("CSV file has no data rows.")

    # Normalize column names (strip whitespace only — preserve original casing in payload keys)
    df.columns = [str(c).strip() for c in df.columns]

    data_row_count = len(df)
    if data_row_count > settings.MAX_UPLOAD_ROWS:
        datasource.processing_status = ProcessingStatus.FAILED
        datasource.save(update_fields=["processing_status"])
        raise UploadParseError(
            f"Too many rows ({data_row_count}). Maximum is {settings.MAX_UPLOAD_ROWS}."
        )

    raw_records: list[RawRecord] = []
    failed_parse_count = 0
    row_number = 0

    for idx, row in df.iterrows():
        row_number += 1
        try:
            payload = _row_to_payload(row)
            if _is_empty_row(payload):
                continue

            # JSON-serializable check
            json.dumps(payload)

            raw_records.append(
                RawRecord(
                    datasource=datasource,
                    row_number=row_number,
                    raw_payload=payload,
                    processing_status="parsed",
                )
            )
        except (TypeError, ValueError) as exc:
            failed_parse_count += 1
            raw_records.append(
                RawRecord(
                    datasource=datasource,
                    row_number=row_number,
                    raw_payload={"_parse_error": str(exc), "_raw_index": int(idx)},
                    processing_status="failed",
                    error_message=str(exc),
                )
            )

    with transaction.atomic():
        RawRecord.objects.bulk_create(raw_records, batch_size=500)
        datasource.total_rows = len(raw_records)
        datasource.save(update_fields=["total_rows"])

    pipeline_stats = process_datasource(datasource)

    datasource.failed_count = pipeline_stats["failed"] + failed_parse_count
    datasource.flagged_count = pipeline_stats["flagged"]
    datasource.processing_status = ProcessingStatus.COMPLETED
    datasource.save(update_fields=["failed_count", "flagged_count", "processing_status"])

    return {
        "datasource_id": str(datasource.id),
        "source_type": datasource.source_type,
        "filename": datasource.filename,
        "total_rows": datasource.total_rows,
        "failed_parse_count": failed_parse_count,
        "failed_count": pipeline_stats["failed"],
        "flagged_count": pipeline_stats["flagged"],
        "pending_count": pipeline_stats["pending"],
        "processing_status": datasource.processing_status,
    }
