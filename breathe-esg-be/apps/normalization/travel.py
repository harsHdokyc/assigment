from decimal import Decimal

from .base import get_field, to_decimal

# Rough great-circle style estimates (km) for demo when distance missing
AIRPORT_DISTANCE = {
    ("LHR", "SFO"): 8610,
    ("LHR", "AMS"): 371,
    ("CDG", "FRA"): 450,
    ("JFK", "LAX"): 3970,
    ("SIN", "HKG"): 2580,
    ("PAR", "BRU"): 312,
    ("PAR", "LYN"): 465,
    ("FRA", "MUC"): 304,
}


def _estimate_distance(origin: str, dest: str, stated: Decimal | None) -> Decimal | None:
    if stated is not None and stated > 0:
        return stated
    if origin and dest:
        key = (origin.upper(), dest.upper())
        rev = (dest.upper(), origin.upper())
        if key in AIRPORT_DISTANCE:
            return Decimal(AIRPORT_DISTANCE[key])
        if rev in AIRPORT_DISTANCE:
            return Decimal(AIRPORT_DISTANCE[rev])
    return stated


def normalize_travel(raw: dict) -> dict:
    employee = get_field(raw, "employee_id", "traveler") or ""
    trip_type = get_field(raw, "trip_type", "type") or ""
    origin = (get_field(raw, "origin_airport", "from") or "").upper()
    dest = (get_field(raw, "destination_airport", "to") or "").upper()
    mode = get_field(raw, "transport_mode", "mode") or trip_type or ""
    nights = get_field(raw, "hotel_nights", "nights") or 0
    distance = to_decimal(get_field(raw, "distance_km", "distance"))

    mode_l = str(mode).lower()
    if "hotel" in mode_l or str(trip_type).lower() == "hotel":
        label = f"Hotel stay — {employee}"
        category = "hotel"
        norm_unit = "nights"
        norm_val = to_decimal(nights) or Decimal("0")
    elif "rail" in mode_l:
        dist = _estimate_distance(origin, dest, distance) or distance
        label = f"Rail — {origin} → {dest}" if origin and dest else f"Rail — {employee}"
        category = "rail"
        norm_val, norm_unit = dist, "km"
    elif "taxi" in mode_l:
        label = f"Taxi — {employee}"
        category = "taxi"
        norm_val = distance or Decimal("0")
        norm_unit = "km"
    else:
        dist = _estimate_distance(origin, dest, distance)
        route = f"{origin}-{dest}" if origin and dest else origin or "unknown"
        label = f"Air travel — {route}"
        category = "air_travel"
        norm_val, norm_unit = dist, "km"

    return {
        "scope": 3,
        "category": category,
        "activity_label": label,
        "activity_value": distance,
        "activity_unit": "km",
        "normalized_value": norm_val,
        "normalized_unit": norm_unit if norm_val is not None else "",
        "employee": str(employee),
        "extra_normalized": {
            "origin": origin,
            "destination": dest,
            "transport_mode": mode_l,
            "hotel_nights": nights,
        },
        "_meta": {"origin": origin, "dest": dest, "mode": mode_l},
    }
