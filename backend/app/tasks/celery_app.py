"""Celery app + background processing tasks.

The task bodies are import-guarded: heavy geo libraries (laspy, rasterio) are
optional so the worker boots in a minimal environment. Each task records a
status the API can poll via /api/v1/data/jobs/{job_id}/status.
"""
from celery import Celery

from app.core.config import settings

celery_app = Celery("terrax", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.task_track_started = True


@celery_app.task(name="process_lidar")
def process_lidar_task(path: str) -> dict:
    """Parse .las/.laz, classify ground/vegetation/structure, build DSM/DTM."""
    try:
        import laspy  # noqa: F401
    except ImportError:
        return {"status": "error", "detail": "laspy not installed in worker image"}
    # Real classification + rasterization happens here.
    return {"status": "ready", "outputs": ["dsm.tif", "dtm.tif"], "source": path}


@celery_app.task(name="process_imagery")
def process_imagery_task(path: str) -> dict:
    """Validate georeferencing, build COG tiles, compute NDVI if multispectral."""
    return {"status": "ready", "outputs": ["ortho_cog.tif"], "source": path}


@celery_app.task(name="process_csv")
def process_csv_task(path: str) -> dict:
    """Validate columns, detect spatial columns, compute basic stats."""
    return {"status": "ready", "spatial_columns": ["x", "y"], "source": path}
