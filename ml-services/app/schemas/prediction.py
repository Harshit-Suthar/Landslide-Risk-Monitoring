from typing import List, Literal
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    location_id: str = Field(..., description="Unique identifier of the landslide monitoring location")
    lat: float = Field(..., ge=-90.0, le=90.0, description="Latitude coordinate")
    lon: float = Field(..., ge=-180.0, le=180.0, description="Longitude coordinate")
    rainfall_mm: float = Field(..., ge=0.0, description="Rainfall precipitation in millimeters (provided by weather provider)")

class InputsUsed(BaseModel):
    location_id: str
    lat: float
    lon: float
    rainfall_mm: float
    soil_moisture: float
    slope_angle: float
    historical_incidents: int

class PredictionResponse(BaseModel):
    risk_level: Literal["Low", "Medium", "High", "Critical"] = Field(
        ..., description="Computed landslide hazard severity tier"
    )
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence score of the risk determination"
    )
    contributing_factors: List[str] = Field(
        ..., description="Human-readable breakdown of factors driving the assessment"
    )
    inputs_used: InputsUsed = Field(
        ..., description="Echo of raw input values used in computation for verification"
    )
