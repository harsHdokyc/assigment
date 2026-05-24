from .base import convert_to_standard, get_field, parse_date, to_decimal

METER_FACILITY = {
    "DE-FRA-441": "Frankfurt DC",
    "IE-DUB-12": "Dublin HQ",
    "DE-MUC-88": "Munich Plant",
    "SG-SIN-9": "Singapore DC",
    "US-NYC-22": "New York Office",
    "UK-LON-5": "London Office",
}


def normalize_utility(raw: dict) -> dict:
    meter = get_field(raw, "meter_id", "meter") or ""
    consumption = to_decimal(get_field(raw, "consumption", "reading_kwh", "kwh"))
    unit = get_field(raw, "unit", "uom") or "kWh"
    start = parse_date(get_field(raw, "billing_start", "period_start"))
    end = parse_date(get_field(raw, "billing_end", "period_end"))
    tariff = get_field(raw, "tariff") or ""

    norm_qty, norm_unit = (None, "")
    if consumption is not None:
        norm_qty, norm_unit = convert_to_standard(consumption, str(unit))

    facility = METER_FACILITY.get(str(meter), str(meter))
    label = f"Grid electricity — {facility}"

    return {
        "scope": 2,
        "category": "purchased_electricity",
        "activity_date": end or start,
        "activity_label": label,
        "activity_value": consumption,
        "activity_unit": str(unit),
        "normalized_value": norm_qty,
        "normalized_unit": norm_unit,
        "facility": facility,
        "extra_normalized": {
            "meter_id": meter,
            "tariff": tariff,
            "period_start": start.isoformat() if start else None,
            "period_end": end.isoformat() if end else None,
        },
        "_meta": {"meter": str(meter)},
    }
