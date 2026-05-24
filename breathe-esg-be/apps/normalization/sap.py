from decimal import Decimal

from .base import convert_to_standard, get_field, parse_date, to_decimal

KNOWN_PLANTS = {"PLT100", "DE_FAC_01", "MUC-PLT", "FLT-EUW"}
SUPPORTED_UNITS = {"L", "gal", "kg", "m3", "tonnes"}


def normalize_sap(raw: dict) -> dict:
    material = get_field(raw, "Material", "material", "fuel_type") or "Fuel"
    qty = to_decimal(get_field(raw, "Menge", "quantity", "qty"))
    unit = get_field(raw, "Einheit", "unit", "uom") or ""
    plant = get_field(raw, "Werk", "facility_code", "plant", "werk") or ""
    activity_date = parse_date(get_field(raw, "Buchungsdatum", "Datum", "date", "activity_date"))

    norm_qty, norm_unit = (None, "")
    if qty is not None and unit:
        norm_qty, norm_unit = convert_to_standard(qty, str(unit))

    label = f"{material} — {plant}" if plant else str(material)
    extra = {
        "fuel_type": material,
        "quantity": float(qty) if qty is not None else None,
        "unit": str(unit),
        "facility_code": plant,
    }

    return {
        "scope": 1,
        "category": "fuel_combustion",
        "activity_date": activity_date,
        "activity_label": label,
        "activity_value": qty,
        "activity_unit": str(unit),
        "normalized_value": norm_qty,
        "normalized_unit": norm_unit,
        "facility": str(plant),
        "extra_normalized": extra,
        "_meta": {"raw_unit": str(unit), "plant": str(plant)},
    }
