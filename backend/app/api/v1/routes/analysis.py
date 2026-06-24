"""Analysis endpoints.

Ordinary kriging runs synchronously here for demonstrable results. The other
methods return an accepted job; wire them to Celery tasks for production.
"""
import uuid

from fastapi import APIRouter, HTTPException

from app.schemas import JobAccepted, KrigingRequest
from app.services.geostatistics import kriging

router = APIRouter(prefix="/analysis", tags=["analysis"])

# In-memory job store stand-in for a database + Celery result backend.
_JOBS: dict[str, dict] = {}


@router.post("/kriging/ordinary")
def ordinary_kriging(req: KrigingRequest) -> dict:
    try:
        result = kriging.ordinary_kriging(
            req.x,
            req.y,
            req.z,
            model=req.model,
            nugget=req.nugget,
            sill=req.sill,
            rng=req.range,
            resolution=req.resolution,
        )
        result["diagnostics"] = kriging.cross_validate(req.x, req.y, req.z)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    job_id = str(uuid.uuid4())
    _JOBS[job_id] = {"status": "ready", "method": "ordinary_kriging", "result": result}
    return {"job_id": job_id, **result}


def _queued(method: str) -> JobAccepted:
    job_id = str(uuid.uuid4())
    _JOBS[job_id] = {"status": "processing", "method": method, "result": None}
    return JobAccepted(job_id=job_id, status="processing")


@router.post("/kriging/indicator", response_model=JobAccepted)
def indicator_kriging() -> JobAccepted:
    return _queued("indicator_kriging")


@router.post("/kriging/categorical", response_model=JobAccepted)
def categorical_kriging() -> JobAccepted:
    return _queued("categorical_kriging")


@router.post("/cokriging", response_model=JobAccepted)
def cokriging() -> JobAccepted:
    return _queued("cokriging")


@router.post("/gwr", response_model=JobAccepted)
def gwr() -> JobAccepted:
    return _queued("gwr")


@router.post("/compositional", response_model=JobAccepted)
def compositional() -> JobAccepted:
    return _queued("compositional")


@router.post("/spacetime", response_model=JobAccepted)
def spacetime() -> JobAccepted:
    return _queued("spacetime")


@router.get("/{job_id}/status")
def status(job_id: str) -> dict:
    job = _JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job_id, "status": job["status"], "method": job["method"]}


@router.get("/{job_id}/results")
def results(job_id: str) -> dict:
    job = _JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["result"] is None:
        raise HTTPException(status_code=409, detail="Job not finished")
    return job["result"]


@router.get("/{job_id}/export")
def export(job_id: str, format: str = "geotiff") -> dict:
    if job_id not in _JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job_id, "format": format, "url": f"/files/{job_id}.{format}"}
