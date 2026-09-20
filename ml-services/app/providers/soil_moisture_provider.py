"""
============================================================================
DATA PROVIDER MODULE: Soil Moisture
============================================================================
REPLACE BODY ONLY — must keep returning a 0-100 float.

When swapping in real satellite or in-situ sensor data (e.g., NASA SMAP,
Sentinel-1 SAR, ISRO MOSDAC, or local IoT piezometer arrays), do not alter
the function signature or return type.

Signature:
    get_soil_moisture(lat: float, lon: float) -> float (0.0 to 100.0)
============================================================================
"""

import math

def get_soil_moisture(lat: float, lon: float) -> float:
    """
    Computes/fetches volumetric soil moisture saturation percentage (0.0 - 100.0).
    Stub: Returns a deterministic, stable value seeded by lat and lon.
    """
    # Deterministic sinusoidal hash based on geographic coordinates
    seed = (abs(lat) * 31.73) + (abs(lon) * 17.29)
    hash_val = abs(math.sin(seed) * 10000.0)
    normalized = hash_val - math.floor(hash_val)

    # Scale to plausible saturation range (30% to 92%)
    moisture = 30.0 + (normalized * 62.0)
    return round(moisture, 2)
