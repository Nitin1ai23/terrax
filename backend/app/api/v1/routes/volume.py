import uuid

from fastapi import APIRouter, HTTPException

from app.schemas import VolumeRequest
from app.services.volume import earthworks

router = APIRouter(prefix="/volume", tags=["volume"])

_JOBS: dict[str, dict] = {}


@router.post("/calculate")
def calculate(req: VolumeRequest) -> dict:
    try:
        result = earthworks.cut_fill(req.surface, req.base, req.cell_size, req.method)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    job_id = str(uuid.uuid4())
    _JOBS[job_id] = result
    return {"job_id": job_id, **result}


@router.get("/{job_id}/results")
def results(job_id: str) -> dict:
    job = _JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/{job_id}/export")
def export(job_id: str, format: str = "pdf") -> dict:
    if job_id not in _JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job_id, "format": format, "url": f"/files/volume-{job_id}.{format}"}
