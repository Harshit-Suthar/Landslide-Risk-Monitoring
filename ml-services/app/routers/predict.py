from fastapi import APIRouter, HTTPException
from app.schemas.prediction import PredictionRequest, PredictionResponse, InputsUsed
from app.providers.soil_moisture_provider import get_soil_moisture
from app.providers.terrain_provider import get_slope_angle
from app.providers.historical_incident_provider import get_historical_incident_count
from app.services.risk_scoring import calculate_risk

router = APIRouter(tags=["Prediction"])

@router.post("/predict", response_model=PredictionResponse)
def predict_landslide_risk(req: PredictionRequest):
    """
    Predicts landslide hazard tier for a location.
    
    Accepts:
        location_id: string
        lat: float
        lon: float
        rainfall_mm: float (from node-api weather provider)
        
    Queries the swap-layer data providers for:
        - soil moisture (%)
        - slope angle (degrees)
        - historical incidents count
        
    Returns:
        PredictionResponse with risk level, confidence, factors, and echo of inputs_used.
    """
    try:
        # Query swap layer data providers for external metrics
        soil_moisture = get_soil_moisture(req.lat, req.lon)
        slope_angle = get_slope_angle(req.lat, req.lon)
        historical_incidents = get_historical_incident_count(req.location_id)

        # Execute explainable weighted-scoring model
        risk_level, confidence, factors = calculate_risk(
            rainfall_mm=req.rainfall_mm,
            soil_moisture=soil_moisture,
            slope_angle=slope_angle,
            historical_incidents=historical_incidents
        )

        inputs_used = InputsUsed(
            location_id=req.location_id,
            lat=req.lat,
            lon=req.lon,
            rainfall_mm=req.rainfall_mm,
            soil_moisture=soil_moisture,
            slope_angle=slope_angle,
            historical_incidents=historical_incidents
        )

        return PredictionResponse(
            risk_level=risk_level,
            confidence=confidence,
            contributing_factors=factors,
            inputs_used=inputs_used
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Inference error during landslide risk calculation: {str(exc)}"
        )
