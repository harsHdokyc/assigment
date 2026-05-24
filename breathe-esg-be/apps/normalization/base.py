"""Shared normalization helpers."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Any


def get_field(payload: dict, *aliases: str) -> Any:
    lower_map = {str(k).lower().strip(): v for k, v in payload.items()}
    for alias in aliases:
        val = lower_map.get(alias.lower())
        if val is not None and str(val).strip() != "":
            return val
    return None


def to_decimal(value: Any) -> Decimal | None:
    if value is None or str(value).strip() == "":
        return None
    try:
        cleaned = str(value).replace(",", "").strip()
        return Decimal(cleaned)
    except (InvalidOperation, ValueError):
        return None


def parse_date(value: Any) -> date | None:
    if not value:
        return None
    text = str(value).strip()
    for fmt in ("%d.%m.%Y", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y"):
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    return None


def normalize_unit(unit: str | None) -> str:
    if not unit:
        return ""
    u = str(unit).strip().lower()
    aliases = {
        "l": "L",
        "liter": "L",
        "liters": "L",
        "litre": "L",
        "litres": "L",
        "gal": "gal",
        "gallon": "gal",
        "gallons": "gal",
        "kg": "kg",
        "kilogram": "kg",
        "kilograms": "kg",
        "m3": "m3",
        "cubic meter": "m3",
        "kwh": "kWh",
        "mwh": "MWh",
        "tonne": "tonnes",
        "ton": "tonnes",
        "tons": "tonnes",
    }
    return aliases.get(u, unit.strip())


def convert_to_standard(quantity: Decimal, unit: str) -> tuple[Decimal, str]:
    """Return canonical quantity + unit for storage."""
    u = normalize_unit(unit)
    if u == "gal":
        return quantity * Decimal("3.78541"), "L"
    if u == "MWh":
        return quantity * Decimal("1000"), "kWh"
    if u in ("tonnes", "t"):
        return quantity * Decimal("1000"), "kg"
    return quantity, u


# Simple emission factors (kg CO2e per unit) — documented in DECISIONS.md
EMISSION_FACTORS = {
    ("L", "diesel"): Decimal("2.68"),
    ("L", "fuel"): Decimal("2.68"),
    ("m3", "gas"): Decimal("1.91"),
    ("kg", "fuel"): Decimal("2.0"),
    ("kWh", "electricity"): Decimal("0.338"),
    ("km", "air"): Decimal("0.243"),
    ("km", "rail"): Decimal("0.035"),
}
