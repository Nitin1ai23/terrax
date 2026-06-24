from fastapi import APIRouter

from app.schemas import (
    ChatRequest,
    ChatResponse,
    FixErrorRequest,
    InterpretRequest,
    SetupWizardRequest,
    TextResponse,
)
from app.services import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    reply = ai_service.chat(
        req.message,
        req.context,
        [m.model_dump() for m in req.history],
    )
    return ChatResponse(reply=reply)


@router.post("/setup-wizard")
def setup_wizard(req: SetupWizardRequest) -> dict:
    return ai_service.setup_wizard(req.dataset_summary, req.goal)


@router.post("/interpret-results", response_model=TextResponse)
def interpret(req: InterpretRequest) -> TextResponse:
    return TextResponse(text=ai_service.interpret_results(req.results))


@router.post("/fix-error", response_model=TextResponse)
def fix_error(req: FixErrorRequest) -> TextResponse:
    return TextResponse(text=ai_service.explain_error(req.error_message, req.file_type))
