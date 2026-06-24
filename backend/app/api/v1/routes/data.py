import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas import Dataset

router = APIRouter(prefix="/data", tags=["data"])

_JOBS: dict[str, dict] = {}
_DATASETS: list[Dataset] = [
    Dataset(id="d1", name="ridgeline_dsm.tif", kind="elevation", status="ready"),
    Dataset(id="d2", name="ridgeline_ortho.tif", kind="orthophoto", status="ready"),
    Dataset(id="d3", name="samples_copper.csv", kind="csv", status="ready"),
]

_KIND_BY_EXT = {
    ".tif": "elevation",
    ".tiff": "elevation",
    ".las": "lidar",
    ".laz": "lidar",
    ".jpg": "orthophoto",
    ".png": "orthophoto",
    ".csv": "csv",
    ".shp": "vector",
    ".geojson": "vector",
    ".zip": "vector",
}


@router.post("/upload")
async def upload(file: UploadFile = File(...)) -> dict:
    name = file.filename or "upload"
    ext = "." + name.rsplit(".", 1)[-1].lower() if "." in name else ""
    kind = _KIND_BY_EXT.get(ext)
    if kind is None:
        raise HTTPException(status_code=422, detail=f"Unsupported file type: {ext or 'unknown'}")
    job_id = str(uuid.uuid4())
    _JOBS[job_id] = {"status": "validating", "filename": name, "kind": kind}
    # A real pipeline dispatches a Celery task here; we mark it ready immediately.
    _JOBS[job_id]["status"] = "ready"
    return {"job_id": job_id, "filename": name, "kind": kind, "status": "ready"}


@router.get("/jobs/{job_id}/status")
def job_status(job_id: str) -> dict:
    job = _JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job_id, **job}


@router.get("/datasets", response_model=list[Dataset])
def list_datasets() -> list[Dataset]:
    return _DATASETS


@router.delete("/datasets/{dataset_id}", status_code=204)
def delete_dataset(dataset_id: str) -> None:
    global _DATASETS
    if not any(d.id == dataset_id for d in _DATASETS):
        raise HTTPException(status_code=404, detail="Dataset not found")
    _DATASETS = [d for d in _DATASETS if d.id != dataset_id]
