import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

PORT: int = int(os.getenv("PORT", "8000"))
NODE_API_URL: str = os.getenv("NODE_API_URL", "http://localhost:5000")

raw_origins = os.getenv("ALLOWED_ORIGINS", f"{NODE_API_URL},http://127.0.0.1:5000")
ALLOWED_ORIGINS: List[str] = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

MODEL_VERSION: str = "v0.1-weighted-scoring"
