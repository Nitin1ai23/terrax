import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/reports", tags=["reports"])

_REPORTS: dict[str, dict] = {}


class ReportRequest(BaseModel):
    title: str
    author: str = ""
    crs: str = ""
    sections: list[str] = []


@router.post("/generate")
def generate(req: ReportRequest) -> dict:
    report_id = str(uuid.uuid4())
    _REPORTS[report_id] = req.model_dump()
    return {"report_id": report_id, "sections": req.sections}


@router.get("/{report_id}/preview")
def preview(report_id: str) -> dict:
    report = _REPORTS.get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/{report_id}/export")
def export(report_id: str, format: str = "docx") -> dict:
    if report_id not in _REPORTS:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"report_id": report_id, "format": format, "url": f"/files/report-{report_id}.{format}"}
