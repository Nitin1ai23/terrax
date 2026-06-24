"""Groq integration for setup guidance, diagnostics, and report writing.

All functions degrade gracefully when GROQ_API_KEY is unset so the rest
of the platform runs without an AI key during local development.
"""
from __future__ import annotations

from app.core.config import settings

SYSTEM_PROMPT = """You are TERRAX AI, a geospatial analysis expert embedded in a \
professional GIS platform. Your users are civil engineers, drone operators, GIS \
analysts, and project managers. You help them:
1. Choose the right geostatistical model for their data and goal
2. Configure analysis parameters correctly (variogram ranges, GWR bandwidth, etc.)
3. Interpret outputs in plain English
4. Troubleshoot processing errors
5. Generate professional interpretations for reports

Always be specific. Name actual parameters, not abstract concepts. When suggesting a \
method, explain in one sentence why it fits the user's situation. When interpreting a \
result, state what it means practically for the user's project. Avoid hedging; if you \
are uncertain, say so and offer the two most likely explanations."""


def _client():
    """Return a Groq client, or None if no key is configured."""
    if not settings.groq_api_key:
        return None
    try:
        from groq import Groq

        return Groq(api_key=settings.groq_api_key)
    except Exception:
        return None


def _complete(client, user_prompt: str, *, max_tokens: int = 1024) -> str:
    """Run a single system+user chat completion and return the text."""
    resp = client.chat.completions.create(
        model=settings.groq_model,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    return resp.choices[0].message.content or ""


def _fallback(kind: str) -> str:
    return (
        f"AI {kind} is unavailable — no GROQ_API_KEY is configured. "
        "Set one in your .env to enable guided setup, diagnostics, and report writing. "
        "You can continue configuring the analysis manually in the meantime."
    )


def chat(message: str, context: dict, history: list[dict]) -> str:
    client = _client()
    if client is None:
        return _fallback("chat")

    ctx_line = (
        f"[Context — page: {context.get('page')}, "
        f"dataset: {context.get('datasetId')}, "
        f"last analysis: {context.get('lastAnalysis')}]"
    )
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *[{"role": m["role"], "content": m["content"]} for m in history],
        {"role": "user", "content": f"{ctx_line}\n\n{message}"},
    ]
    resp = client.chat.completions.create(
        model=settings.groq_model,
        max_tokens=1024,
        messages=messages,
    )
    return resp.choices[0].message.content or ""


def setup_wizard(dataset_summary: dict, goal: str) -> dict:
    client = _client()
    if client is None:
        return {
            "recommended_method": "ordinary_kriging",
            "parameters": {"model": "spherical", "nugget": 0, "sill": None, "range": None},
            "warnings": [_fallback("setup")],
            "steps": ["Pick variable", "Auto-fit variogram", "Set grid resolution", "Run"],
        }

    prompt = (
        f"A user wants to: {goal}\n"
        f"Dataset summary: {dataset_summary}\n\n"
        "Recommend a geostatistical method and starting parameters. Return concise JSON with "
        "keys: recommended_method, parameters, warnings (list), steps (list of 4)."
    )
    return {"raw": _complete(client, prompt)}


def interpret_results(results: dict) -> str:
    client = _client()
    if client is None:
        return _fallback("interpretation")
    prompt = (
        "Write a plain-English interpretation for a professional report of these analysis "
        f"results: {results}. Cover variogram fit quality, what the surface means practically, "
        "and any anomalies to flag."
    )
    return _complete(client, prompt)


def explain_error(error_message: str, file_type: str) -> str:
    client = _client()
    if client is None:
        return _fallback("error help")
    prompt = (
        f"A {file_type} upload failed with this error: {error_message}. "
        "Explain what went wrong and how to fix it, in two or three sentences."
    )
    return _complete(client, prompt, max_tokens=512)
