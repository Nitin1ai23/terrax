from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import (
    ai,
    analysis,
    auth,
    data,
    reports,
    visualization,
    volume,
)
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="AI-powered GIS platform — geostatistics, volumes, and reporting.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for module in (data, analysis, visualization, volume, reports, ai, auth):
    app.include_router(module.router, prefix=settings.api_prefix)


@app.get("/health", tags=["meta"])
def health() -> dict:
    return {"status": "ok", "service": settings.app_name, "ai_enabled": bool(settings.groq_api_key)}
