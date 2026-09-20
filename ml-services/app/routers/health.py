from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.config import MODEL_VERSION

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    """
    Returns system health status and current model version.
    """
    return HealthResponse(
        status="ok",
        model_version=MODEL_VERSION
    )
