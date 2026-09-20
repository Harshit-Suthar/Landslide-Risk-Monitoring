"""
Providers Package (Swap Layer for external data integrations)
"""
from app.providers.soil_moisture_provider import get_soil_moisture
from app.providers.terrain_provider import get_slope_angle
from app.providers.historical_incident_provider import get_historical_incident_count

__all__ = ["get_soil_moisture", "get_slope_angle", "get_historical_incident_count"]
