"""
============================================================================
DATA PROVIDER MODULE: Terrain / Topography
============================================================================
REPLACE BODY ONLY — must keep returning a float in degrees (0-90).

When swapping in real Digital Elevation Model (DEM) data (e.g., Copernicus 30m,
SRTM 1 Arc-Second, ALOS AW3D30, or Cartosat-1 DEM), do not alter the
function signature or return type.

Signature:
    get_slope_angle(lat: float, lon: float) -> float (0.0 to 90.0)
============================================================================
"""

import math

def get_slope_angle(lat: float, lon: float) -> float:
    """
    Computes/fetches the terrain slope inclination angle in degrees (0.0 - 90.0).
    Stub: Returns a deterministic, stable value seeded by lat and lon.
    """
    # Deterministic cosine-based hash distinct from soil moisture
    seed = (abs(lat) * 47.19) + (abs(lon) * 59.83)
    hash_val = abs(math.cos(seed) * 10000.0)
    normalized = hash_val - math.floor(hash_val)

    # Typical mountainous slopes in North Eastern Region range from 12° to 65°
    slope = 12.0 + (normalized * 53.0)
    return round(slope, 2)
