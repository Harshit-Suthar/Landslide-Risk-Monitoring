"""
Landslide Risk Scoring Engine

Explainable multi-criteria evaluation model combining hydrological,
geotechnical, and historical susceptibility indicators into a normalized
composite hazard score (0 - 100).
"""

from typing import Tuple, List, Literal

# ============================================================================
# MODEL WEIGHT CONFIGURATION (Total = 1.00 / 100%)
# ============================================================================
# 1. RAINFALL (35%): Primary trigger mechanism for pore-water pressure spikes.
WEIGHT_RAINFALL = 0.35

# 2. SOIL MOISTURE (25%): Pre-existing saturation level weakening shear strength.
WEIGHT_SOIL_MOISTURE = 0.25

# 3. SLOPE ANGLE (25%): Gravitational shear stress factor (>35° is high hazard).
WEIGHT_SLOPE_ANGLE = 0.25

# 4. HISTORICAL INCIDENTS (15%): Recurrent instability history in geological formation.
WEIGHT_HISTORICAL = 0.15
# ============================================================================

def normalize_rainfall(rainfall_mm: float) -> Tuple[float, str | None]:
    """
    Normalizes 24h precipitation to 0-100 scale based on IMD rainfall classifications:
    - 0 to 15.5 mm: Very light (0-20 score)
    - 15.6 to 64.4 mm: Moderate (20-50 score)
    - 64.5 to 115.5 mm: Heavy (50-80 score)
    - > 115.6 mm: Very heavy to Extremely Heavy (80-100 score)
    """
    if rainfall_mm <= 0:
        return 0.0, None
    elif rainfall_mm < 30.0:
        score = (rainfall_mm / 30.0) * 25.0
        return score, None
    elif rainfall_mm < 70.0:
        score = 25.0 + ((rainfall_mm - 30.0) / 40.0) * 25.0
        return score, f"Moderate continuous precipitation ({rainfall_mm:.1f} mm/24h)"
    elif rainfall_mm < 130.0:
        score = 50.0 + ((rainfall_mm - 70.0) / 60.0) * 30.0
        return score, f"Heavy rainfall accumulation exceeding safety threshold ({rainfall_mm:.1f} mm/24h)"
    else:
        score = min(100.0, 80.0 + ((rainfall_mm - 130.0) / 70.0) * 20.0)
        return score, f"Extreme downpour triggering acute slope liquefaction risk ({rainfall_mm:.1f} mm/24h)"

def normalize_soil_moisture(soil_moisture: float) -> Tuple[float, str | None]:
    """
    Soil moisture is already 0 - 100% volumetric water content.
    Saturation above 65% starts significantly reducing effective soil friction.
    """
    clamped = max(0.0, min(100.0, soil_moisture))
    factor = None
    if clamped >= 80.0:
        factor = f"Severe soil saturation near full liquid limit ({clamped:.1f}%)"
    elif clamped >= 65.0:
        factor = f"Elevated pore-water pressure from high soil moisture ({clamped:.1f}%)"
    return clamped, factor

def normalize_slope(slope_deg: float) -> Tuple[float, str | None]:
    """
    Normalizes slope angle (0 - 90 degrees):
    - < 15°: Gentle / Stable (0 - 20 score)
    - 15° - 30°: Moderate (20 - 50 score)
    - 30° - 45°: Steep / Critical threshold for debris flows (50 - 85 score)
    - > 45°: Escarpment / High rockfall and slide hazard (85 - 100 score)
    """
    clamped = max(0.0, min(90.0, slope_deg))
    if clamped < 15.0:
        score = (clamped / 15.0) * 20.0
        return score, None
    elif clamped < 30.0:
        score = 20.0 + ((clamped - 15.0) / 15.0) * 30.0
        return score, None
    elif clamped < 45.0:
        score = 50.0 + ((clamped - 30.0) / 15.0) * 35.0
        return score, f"Steep terrain gradient ({clamped:.1f}°) promotes rapid gravitational displacement"
    else:
        score = min(100.0, 85.0 + ((clamped - 45.0) / 45.0) * 15.0)
        return score, f"Critical escarpment angle ({clamped:.1f}°) with acute structural failure risk"

def normalize_historical(incidents: int) -> Tuple[float, str | None]:
    """
    Normalizes historical incident count (0 - 10+):
    - 0 incidents: 0 score
    - 1 - 2 incidents: 20 - 40 score
    - 3 - 5 incidents: 40 - 75 score
    - > 5 incidents: 75 - 100 score
    """
    count = max(0, incidents)
    if count == 0:
        return 0.0, None
    elif count <= 2:
        return count * 20.0, None
    elif count <= 5:
        score = 40.0 + ((count - 2) / 3.0) * 35.0
        return score, f"Known landslide zone with {count} previously recorded events"
    else:
        score = min(100.0, 75.0 + ((count - 5) / 5.0) * 25.0)
        return score, f"Chronic slope failure history ({count} past incidents recorded)"

def calculate_risk(
    rainfall_mm: float,
    soil_moisture: float,
    slope_angle: float,
    historical_incidents: int
) -> Tuple[Literal["Low", "Medium", "High", "Critical"], float, List[str]]:
    """
    Computes composite hazard score and generates explainable output.
    Returns: (risk_level, confidence, contributing_factors)
    """
    rain_score, rain_factor = normalize_rainfall(rainfall_mm)
    moist_score, moist_factor = normalize_soil_moisture(soil_moisture)
    slope_score, slope_factor = normalize_slope(slope_angle)
    hist_score, hist_factor = normalize_historical(historical_incidents)

    # Weighted sum formula
    composite_score = (
        (rain_score * WEIGHT_RAINFALL) +
        (moist_score * WEIGHT_SOIL_MOISTURE) +
        (slope_score * WEIGHT_SLOPE_ANGLE) +
        (hist_score * WEIGHT_HISTORICAL)
    )

    # Determine risk level tier
    if composite_score >= 75.0:
        risk_level: Literal["Low", "Medium", "High", "Critical"] = "Critical"
    elif composite_score >= 50.0:
        risk_level = "High"
    elif composite_score >= 25.0:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # Assemble contributing factors
    contributing_factors: List[str] = []
    for factor in [rain_factor, moist_factor, slope_factor, hist_factor]:
        if factor:
            contributing_factors.append(factor)

    if not contributing_factors:
        contributing_factors.append("All geotechnical and hydrological indicators remain within baseline safety limits.")

    # Calculate confidence: higher when factors are consistent or pronounced
    base_confidence = 0.82
    variance_penalty = abs(rain_score - moist_score) * 0.001
    bonus = 0.05 if len(contributing_factors) >= 2 else 0.0
    confidence = round(max(0.70, min(0.96, base_confidence - variance_penalty + bonus)), 2)

    return risk_level, confidence, contributing_factors
