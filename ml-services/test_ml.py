"""
Test Suite for ml-api (FastAPI ML Service)
"""
import sys
import os

# Add ml-api root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.providers.soil_moisture_provider import get_soil_moisture
from app.providers.terrain_provider import get_slope_angle
from app.providers.historical_incident_provider import get_historical_incident_count
from app.services.risk_scoring import calculate_risk
from app.schemas.prediction import PredictionRequest
from app.routers.predict import predict_landslide_risk
from app.routers.health import health_check

def run_tests():
    print("--- Starting ml-api Test Suite ---")
    passed = 0
    failed = 0

    # 1. Health check
    try:
        print("[Test 1] Health check...")
        health = health_check()
        assert health.status == "ok"
        assert health.model_version == "v0.1-weighted-scoring"
        print("[PASS] Health check returned status ok and correct model version")
        passed += 1
    except Exception as e:
        print(f"[FAIL] Health check failed: {e}")
        failed += 1

    # 2. Soil Moisture Provider
    try:
        print("[Test 2] Soil moisture provider...")
        sm1 = get_soil_moisture(25.5682, 91.8933)
        sm2 = get_soil_moisture(25.5682, 91.8933)
        assert isinstance(sm1, float)
        assert 0.0 <= sm1 <= 100.0
        assert sm1 == sm2, "Provider must return stable value for same lat/lon"
        print(f"[PASS] Soil moisture provider returns stable float: {sm1}%")
        passed += 1
    except Exception as e:
        print(f"[FAIL] Soil moisture provider failed: {e}")
        failed += 1

    # 3. Terrain Provider
    try:
        print("[Test 3] Terrain provider...")
        slope1 = get_slope_angle(25.5682, 91.8933)
        slope2 = get_slope_angle(25.5682, 91.8933)
        assert isinstance(slope1, float)
        assert 0.0 <= slope1 <= 90.0
        assert slope1 == slope2, "Provider must return stable slope for same lat/lon"
        print(f"[PASS] Terrain provider returns stable float: {slope1} deg")
        passed += 1
    except Exception as e:
        print(f"[FAIL] Terrain provider failed: {e}")
        failed += 1

    # 4. Historical Incident Provider
    try:
        print("[Test 4] Historical incident provider...")
        h1 = get_historical_incident_count("loc-shillong-01")
        h2 = get_historical_incident_count("loc-shillong-01")
        assert isinstance(h1, int)
        assert h1 >= 0
        assert h1 == h2, "Provider must return stable count for same location_id"
        print(f"[PASS] Historical incident provider returns stable int: {h1}")
        passed += 1
    except Exception as e:
        print(f"[FAIL] Historical incident provider failed: {e}")
        failed += 1

    # 5. Risk Scoring Engine Tests
    try:
        print("[Test 5] Risk scoring engine (Low risk scenario)...")
        risk, conf, factors = calculate_risk(
            rainfall_mm=5.0,
            soil_moisture=32.0,
            slope_angle=14.0,
            historical_incidents=0
        )
        assert risk == "Low"
        assert 0.0 <= conf <= 1.0
        assert len(factors) > 0
        print(f"[PASS] Low scenario verified: Risk={risk}, Confidence={conf}, Factors={factors}")
        passed += 1

        print("[Test 6] Risk scoring engine (Critical risk scenario)...")
        crit_risk, crit_conf, crit_factors = calculate_risk(
            rainfall_mm=180.0,
            soil_moisture=88.0,
            slope_angle=52.0,
            historical_incidents=6
        )
        assert crit_risk == "Critical"
        assert 0.0 <= crit_conf <= 1.0
        assert any("rainfall" in f.lower() or "downpour" in f.lower() for f in crit_factors)
        print(f"[PASS] Critical scenario verified: Risk={crit_risk}, Confidence={crit_conf}, Factors={crit_factors}")
        passed += 1
    except Exception as e:
        print(f"[FAIL] Risk scoring engine test failed: {e}")
        failed += 1

    # 6. Predict Router
    try:
        print("[Test 7] Predict router with input echoing...")
        req = PredictionRequest(
            location_id="test-loc-42",
            lat=25.6747,
            lon=94.1103,
            rainfall_mm=112.5
        )
        res = predict_landslide_risk(req)
        assert res.risk_level in ["Low", "Medium", "High", "Critical"]
        assert res.inputs_used.location_id == "test-loc-42"
        assert res.inputs_used.lat == 25.6747
        assert res.inputs_used.lon == 94.1103
        assert res.inputs_used.rainfall_mm == 112.5
        assert isinstance(res.inputs_used.soil_moisture, float)
        assert isinstance(res.inputs_used.slope_angle, float)
        assert isinstance(res.inputs_used.historical_incidents, int)
        print(f"[PASS] Predict router returned {res.risk_level} with raw inputs echoed back")
        passed += 1
    except Exception as e:
        print(f"[FAIL] Predict router test failed: {e}")
        failed += 1

    print(f"\n--- ml-api Test Summary: {passed} passed, {failed} failed ---")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
