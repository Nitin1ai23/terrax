from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-driven configuration. See .env.example for all keys."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "TERRAX API"
    api_prefix: str = "/api/v1"
    environment: str = "development"

    # CORS
    frontend_origin: str = "http://localhost:3000"

    # Database
    database_url: str = "postgresql+asyncpg://terrax:terrax@localhost:5432/terrax"

    # Background jobs
    redis_url: str = "redis://localhost:6379/0"

    # Auth
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    # AI (Groq)
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
