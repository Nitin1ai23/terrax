from fastapi import APIRouter

router = APIRouter(prefix="/visualization", tags=["visualization"])


@router.get("/tiles/{dataset_id}")
def tiles(dataset_id: str) -> dict:
    """Return a tile template URL for a processed raster dataset."""
    return {"dataset_id": dataset_id, "tile_url": f"/tiles/{dataset_id}/{{z}}/{{x}}/{{y}}.png"}
