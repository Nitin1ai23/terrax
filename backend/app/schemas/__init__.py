from __future__ import annotations

from pydantic import BaseModel


# --- AI ---
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    context: dict = {}
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str


class SetupWizardRequest(BaseModel):
    dataset_summary: dict = {}
    goal: str


class InterpretRequest(BaseModel):
    results: dict


class FixErrorRequest(BaseModel):
    error_message: str
    file_type: str = "unknown"


class TextResponse(BaseModel):
    text: str


# --- Analysis ---
class KrigingRequest(BaseModel):
    x: list[float]
    y: list[float]
    z: list[float]
    model: str = "spherical"
    nugget: float = 0.0
    sill: float | None = None
    range: float | None = None
    resolution: int = 50


class JobAccepted(BaseModel):
    job_id: str
    status: str


# --- Volume ---
class VolumeRequest(BaseModel):
    surface: list[list[float]]
    base: list[list[float]]
    cell_size: float = 1.0
    method: str = "grid"


# --- Data ---
class Dataset(BaseModel):
    id: str
    name: str
    kind: str
    status: str
