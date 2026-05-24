"""Run normalization + validation for all raw rows in a datasource."""

from __future__ import annotations

from decimal import Decimal

from django.db import transaction

from apps.ingestion.models import DataSource, RawRecord, SourceType
from apps.normalization.base import EMISSION_FACTORS
from apps.records.models import NormalizedEmissionRecord, RecordStatus
from apps.validation.rules import apply_validation

from . import sap, travel, utility


NORMALIZERS = {
    SourceType.SAP: sap.normalize_sap,
    SourceType.UTILITY: utility.normalize_utility,
    SourceType.TRAVEL: travel.normalize_travel,
}


def _emission_factor(category: str, unit: str) -> Decimal | None:
    unit_l = (unit or "").lower()
    for (u, cat), factor in EMISSION_FACTORS.items():
        if u.lower() == unit_l and cat in category.lower():
            return factor
    if unit_l == "kwh":
        return Decimal("0.338")
    if unit_l == "km":
        return Decimal("0.243")
    if unit_l == "l":
        return Decimal("2.68")
    return None


def _apply_emissions(data: dict) -> dict:
    unit = data.get("normalized_unit") or ""
    val = data.get("normalized_value")
    if val is None:
        return data
    factor = _emission_factor(data.get("category", ""), unit)
    data["emission_factor"] = factor
    if factor is not None:
        data["calculated_emissions"] = (val * factor).quantize(Decimal("0.01"))
    return data


def process_datasource(datasource: DataSource) -> dict:
    normalizer = NORMALIZERS.get(datasource.source_type)
    if not normalizer:
        return {"normalized": 0, "failed": 0, "flagged": 0, "pending": 0}

    raw_rows = list(
        RawRecord.objects.filter(datasource=datasource, processing_status="parsed").order_by("row_number")
    )
    records_to_create: list[NormalizedEmissionRecord] = []
    failed = flagged = pending = 0

    for raw in raw_rows:
        try:
            norm_data = normalizer(raw.raw_payload)
            norm_data = _apply_emissions(norm_data)
            meta = norm_data.pop("_meta", {})
            norm_data["extra_normalized"] = {
                **(norm_data.get("extra_normalized") or {}),
            }
            status, issues = apply_validation(datasource.source_type, raw.raw_payload, {**norm_data, "_meta": meta})

            if status == RecordStatus.FAILED:
                failed += 1
            elif status == RecordStatus.FLAGGED:
                flagged += 1
            else:
                pending += 1

            records_to_create.append(
                NormalizedEmissionRecord(
                    organization=datasource.organization,
                    raw_record=raw,
                    datasource=datasource,
                    category=norm_data.get("category", ""),
                    scope=norm_data.get("scope"),
                    activity_date=norm_data.get("activity_date"),
                    activity_label=norm_data.get("activity_label", ""),
                    activity_value=norm_data.get("activity_value"),
                    activity_unit=norm_data.get("activity_unit", ""),
                    normalized_value=norm_data.get("normalized_value"),
                    normalized_unit=norm_data.get("normalized_unit", ""),
                    emission_factor=norm_data.get("emission_factor"),
                    calculated_emissions=norm_data.get("calculated_emissions"),
                    facility=norm_data.get("facility", ""),
                    vendor=norm_data.get("vendor", ""),
                    employee=norm_data.get("employee", ""),
                    extra_normalized=norm_data.get("extra_normalized", {}),
                    validation_issues=issues,
                    status=status,
                )
            )
        except Exception as exc:
            failed += 1
            records_to_create.append(
                NormalizedEmissionRecord(
                    organization=datasource.organization,
                    raw_record=raw,
                    datasource=datasource,
                    activity_label="Normalization error",
                    status=RecordStatus.FAILED,
                    validation_issues=[
                        {"code": "normalize_error", "severity": "hard", "message": str(exc)}
                    ],
                )
            )

    with transaction.atomic():
        NormalizedEmissionRecord.objects.filter(datasource=datasource).delete()
        NormalizedEmissionRecord.objects.bulk_create(records_to_create, batch_size=500)
        datasource.failed_count = failed
        datasource.flagged_count = flagged
        datasource.save(update_fields=["failed_count", "flagged_count"])

    return {
        "normalized": len(records_to_create),
        "failed": failed,
        "flagged": flagged,
        "pending": pending,
    }
