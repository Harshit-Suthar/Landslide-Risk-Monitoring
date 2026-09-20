from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS, MODEL_VERSION
from app.routers.health import router as health_router
from app.routers.predict import router as predict_router

app = FastAPI(
    title="NER Landslide Early Warning - ML Service",
    description="Hazard inference engine for landslide risk monitoring across the North Eastern Region",
    version=MODEL_VERSION
)

# CORS restricted strictly to node-api origins (never direct browser access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Mount endpoints
app.include_router(health_router)
app.include_router(predict_router)

@app.get("/")
def root():
    return {
        "service": "NER Landslide Early Warning - ML Service",
        "status": "online",
        "version": MODEL_VERSION,
        "docs": "/docs",
        "health": "/health",
        "predict": "/predict (POST)"
    }

if __name__ == "__main__":
    import uvicorn
    from app.config import PORT
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
