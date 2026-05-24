# Sample data sources

Fabricated CSV fixtures for local development and demo. They mimic real enterprise export quirks without using proprietary SAP/Concur files.

## Files (`samples/`)

| File | Source type | Rows | Edge cases baked in |
|------|-------------|------|---------------------|
| `sap_fuel.csv` | `sap` | 50 | German headers (`Menge`, `Einheit`, `Werk`); dates `DD.MM.YYYY`, `YYYY-MM-DD`, `MM/DD/YYYY`; units L, gal, kg, m3, liters; unknown unit `STONE`; plant `INVALID_X` |
| `utility_electricity.csv` | `utility` | 50 | kWh and MWh; negative consumption row (`SG-SIN-9`); usage spike (`US-NYC-22` ~985k kWh); non-calendar billing periods |
| `travel.csv` | `travel` | 50 | Flights, rail, hotel, taxi; missing destination (`emp_33402`); unrealistic distance (`emp_44102`, 45000 km); hotel rows with no airports |

Regenerate: `python samples/generate_samples.py`

## Upload API

```http
POST /api/uploads/
Content-Type: multipart/form-data

file: <csv>
source_type: sap | utility | travel
organization_id: <uuid from seed_demo>
```

Each data row becomes one `RawRecord` with `raw_payload` = original column values (unchanged keys and strings).
