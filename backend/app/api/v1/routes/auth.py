"""Minimal auth + project endpoints.

JWT issuance is intentionally simple here — wire to the users table and a real
password hash before any non-local deployment.
"""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException
from jose import jwt
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter(tags=["auth"])

_PROJECTS = [
    {"id": "p1", "name": "Ridgeline Quarry — June", "status": "ready"},
    {"id": "p2", "name": "Maple St Subdivision", "status": "processing"},
]


class Credentials(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


def _issue_token(sub: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({"sub": sub, "exp": expire}, settings.jwt_secret, algorithm=settings.jwt_algorithm)


@router.post("/auth/login", response_model=Token)
def login(creds: Credentials) -> Token:
    if not creds.email or not creds.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    return Token(access_token=_issue_token(creds.email))


@router.post("/auth/register", response_model=Token, status_code=201)
def register(creds: Credentials) -> Token:
    return Token(access_token=_issue_token(creds.email))


@router.get("/users/me")
def me() -> dict:
    return {"id": "u1", "name": "Dana Okafor", "email": "dana@northridge.example"}


class ProjectCreate(BaseModel):
    name: str


@router.get("/projects")
def list_projects() -> list[dict]:
    return _PROJECTS


@router.post("/projects", status_code=201)
def create_project(body: ProjectCreate) -> dict:
    project = {"id": f"p{len(_PROJECTS) + 1}", "name": body.name, "status": "ready"}
    _PROJECTS.append(project)
    return project
