"""
============================================================================
DATA PROVIDER MODULE: Historical Incident Registry
============================================================================
REPLACE BODY ONLY — must keep returning an int.

When swapping in real historical landslide disaster inventories (e.g., GSI
Bhukosh National Landslide Susceptibility database, NDMA records, or State
Disaster Management Authority event logs), do not alter the function
signature or return type.

Signature:
    get_historical_incident_count(location_id: str) -> int
============================================================================
"""

import hashlib

def get_historical_incident_count(location_id: str) -> int:
    """
    Retrieves the count of historical landslide/slope-failure events recorded
    within the catchment zone of this location.
    Stub: Derives a plausible, stable integer from the location_id hash.
    """
    if not location_id:
        return 0

    # Stable MD5 hash converted to integer
    digest = hashlib.md5(location_id.encode("utf-8")).hexdigest()
    int_seed = int(digest[:6], 16)

    # Produce a plausible historical count between 0 and 9
    return int_seed % 10
