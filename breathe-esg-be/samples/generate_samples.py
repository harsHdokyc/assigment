"""One-off script to regenerate sample CSV fixtures. Run: python samples/generate_samples.py"""

from pathlib import Path

SAMPLES = Path(__file__).parent


def write_sap():
    rows = [
        "Material,Menge,Einheit,Werk,Buchungsdatum",
        "Diesel B7,14820,L,PLT100,22.05.2026",
        "Natural Gas,88420,m3,DE_FAC_01,2026-05-15",
        "Heating Oil,4200,gal,PLT100,05/20/2026",
        "LPG,890,kg,DE_FAC_01,18.04.2026",
        "Diesel B7,3200,L,INVALID_X,2026-04-01",
        "Unknown Fuel,500,STONE,PLT100,2026-03-10",
        "Petrol 95,2100,liters,PLT100,01.02.2026",
        "Natural Gas,12000,M3,DE_FAC_01,2026-02-28",
        "Diesel B7,950,L,PLT100,15.01.2026",
    ]
    for i in range(10, 51):
        rows.append(f"Diesel B7,{1000 + i * 37},L,PLT100,2026-01-{(i % 28) + 1:02d}")
    (SAMPLES / "sap_fuel.csv").write_text("\n".join(rows) + "\n", encoding="utf-8")


def write_utility():
    rows = [
        "meter_id,billing_start,billing_end,consumption,unit,tariff,total_cost",
        "DE-FRA-441,2026-04-01,2026-04-30,482104,kWh,GRN-2-Comm,42120.50",
        "IE-DUB-12,2026-04-01,2026-04-30,22408,kWh,STD-1,2890.00",
        "DE-MUC-88,2026-04-01,2026-04-30,1.82,MWh,PEAK-3,890.00",
        "SG-SIN-9,2026-04-01,2026-04-30,-150,kWh,STD-1,-45.00",
        "US-NYC-22,2026-04-01,2026-04-30,985000,kWh,COMM-1,98200.00",
        "UK-LON-5,2026-03-01,2026-03-31,45200,kWh,GRN-1,4100.00",
        "DE-FRA-441,2026-03-01,2026-03-31,341200,kWh,GRN-2-Comm,29800.00",
    ]
    for i in range(8, 51):
        meter = f"DE-FRA-{400 + i}"
        kwh = 18000 + (i * 421) % 50000
        rows.append(f"{meter},2026-02-01,2026-02-28,{kwh},kWh,GRN-2-Comm,{kwh * 0.09:.2f}")
    (SAMPLES / "utility_electricity.csv").write_text("\n".join(rows) + "\n", encoding="utf-8")


def write_travel():
    rows = [
        "employee_id,trip_type,origin_airport,destination_airport,hotel_nights,transport_mode,distance_km",
        "emp_22841,flight,LHR,SFO,0,air,8714",
        "emp_11023,rail,PAR,BRU,0,rail,312",
        "emp_33402,flight,LHR,,0,air,8714",
        "emp_22841,hotel,,,3,hotel,0",
        "emp_99201,taxi,,,0,taxi,45",
        "emp_44102,flight,JFK,LAX,0,air,45000",
        "emp_55210,flight,CDG,FRA,0,air,450",
        "emp_66123,flight,SIN,HKG,0,air,2580",
    ]
    modes = [("flight", "LHR", "AMS"), ("flight", "FRA", "MUC"), ("rail", "PAR", "LYN"), ("hotel", "", "")]
    for i in range(8, 50):
        emp = f"emp_{10000 + i}"
        mode, orig, dest = modes[i % len(modes)]
        if mode == "hotel":
            rows.append(f"{emp},hotel,,,{2 + i % 5},hotel,0")
        else:
            dist = 200 + (i * 173) % 3000
            rows.append(f"{emp},{mode},{orig},{dest},0,{mode},{dist}")
    (SAMPLES / "travel.csv").write_text("\n".join(rows) + "\n", encoding="utf-8")


if __name__ == "__main__":
    write_sap()
    write_utility()
    write_travel()
    print("Wrote sap_fuel.csv, utility_electricity.csv, travel.csv")
