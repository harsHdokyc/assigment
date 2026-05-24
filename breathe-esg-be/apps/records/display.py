"""Human-readable record references for UI (stable per raw CSV row)."""

from apps.ingestion.models import SourceType

_SOURCE_PREFIX = {
    SourceType.SAP: "SAP",
    SourceType.UTILITY: "Utility",
    SourceType.TRAVEL: "Travel",
}


def record_display_ref(record) -> str:
    """e.g. Utility-0042 — tied to source type + raw row number."""
    source_type = getattr(record.datasource, "source_type", None) or ""
    prefix = _SOURCE_PREFIX.get(source_type, "Record")
    row_num = 0
    if getattr(record, "raw_record_id", None) and getattr(record, "raw_record", None):
        row_num = record.raw_record.row_number or 0
    return f"{prefix}-{row_num:04d}"
