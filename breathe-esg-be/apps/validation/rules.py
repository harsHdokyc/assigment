"""Rule-based validation — hard failures vs soft flags."""

from __future__ import annotations

from decimal import Decimal

from apps.ingestion.models import SourceType
from apps.normalization.sap import KNOWN_PLANTS, SUPPORTED_UNITS
from apps.normalization.base import normalize_unit
from apps.records.models import RecordStatus

USAGE_SPIKE_KWH = Decimal("500000")
MAX_REALISTIC_FLIGHT_KM = Decimal("20000")


def _issue(code: str, severity: str, message: str) -> dict:
    return {"code": code, "severity": severity, "message": message}


def apply_validation(source_type: str, raw: dict, normalized: dict) -> tuple[str, list]:
    issues: list[dict] = []
    hard = False

    if source_type == SourceType.SAP:
        unit = normalize_unit(normalized.get("_meta", {}).get("raw_unit") or normalized.get("activity_unit"))
        if unit and unit not in SUPPORTED_UNITS:
            issues.append(_issue("unknown_unit", "hard", f"Unsupported unit: {unit}"))
            hard = True
        plant = normalized.get("_meta", {}).get("plant", "")
        if plant and plant not in KNOWN_PLANTS:
            issues.append(_issue("unknown_plant", "soft", f"Unknown plant code: {plant}"))
        if normalized.get("activity_value") is None:
            issues.append(_issue("missing_quantity", "hard", "Missing required quantity"))
            hard = True

    elif source_type == SourceType.UTILITY:
        val = normalized.get("normalized_value")
        if val is not None and val < 0:
            issues.append(_issue("negative_consumption", "hard", "Negative consumption"))
            hard = True
        if val is not None and val > USAGE_SPIKE_KWH:
            issues.append(_issue("usage_spike", "soft", "Unusually high electricity usage"))
        if val is None:
            issues.append(_issue("missing_consumption", "hard", "Missing consumption value"))
            hard = True

    elif source_type == SourceType.TRAVEL:
        meta = normalized.get("_meta", {})
        mode = meta.get("mode", "")
        if "flight" in mode or mode == "air" or meta.get("origin"):
            if not meta.get("dest") and "hotel" not in mode:
                issues.append(_issue("missing_airport", "hard", "Missing destination airport code"))
                hard = True
        dist = normalized.get("normalized_value")
        if dist is not None and dist > MAX_REALISTIC_FLIGHT_KM and "air" in str(normalized.get("category", "")).lower():
            issues.append(_issue("unrealistic_distance", "soft", "Unrealistic travel distance"))
        if dist is None and "hotel" not in str(normalized.get("category", "")):
            if not meta.get("origin"):
                issues.append(_issue("missing_route", "hard", "Missing travel route data"))
                hard = True

    if not normalized.get("emission_factor"):
        issues.append(_issue("missing_emission_factor", "soft", "Using default emission factor"))

    if hard:
        status = RecordStatus.FAILED
    elif any(i["severity"] == "soft" for i in issues):
        status = RecordStatus.FLAGGED
    else:
        status = RecordStatus.PENDING

    return status, issues
