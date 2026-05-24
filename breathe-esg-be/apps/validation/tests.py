from django.test import SimpleTestCase

from apps.normalization.sap import normalize_sap
from apps.normalization.utility import normalize_utility
from apps.validation.rules import apply_validation
from apps.ingestion.models import SourceType


class NormalizationTests(SimpleTestCase):
    def test_sap_gallons_to_liters(self):
        raw = {"Material": "Diesel", "Menge": "100", "Einheit": "gal", "Werk": "PLT100", "Buchungsdatum": "2026-01-01"}
        out = normalize_sap(raw)
        self.assertEqual(out["normalized_unit"], "L")
        self.assertAlmostEqual(float(out["normalized_value"]), 378.541, places=2)

    def test_sap_unknown_unit_fails(self):
        raw = {"Material": "X", "Menge": "1", "Einheit": "STONE", "Werk": "PLT100", "Buchungsdatum": "2026-01-01"}
        out = normalize_sap(raw)
        meta = out.pop("_meta", {})
        status, issues = apply_validation(SourceType.SAP, raw, {**out, "_meta": meta})
        self.assertEqual(status, "failed")

    def test_utility_negative_fails(self):
        raw = {"meter_id": "X", "consumption": "-10", "unit": "kWh", "billing_start": "2026-01-01", "billing_end": "2026-01-31"}
        out = normalize_utility(raw)
        status, _ = apply_validation(SourceType.UTILITY, raw, {**out, "_meta": out.get("_meta", {})})
        self.assertEqual(status, "failed")
