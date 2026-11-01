from pathlib import Path
from typing import List, Union
import json
import logging
from pydantic import Field, field_validator, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

# Base directories
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE_PATH = BACKEND_DIR / ".env"

LEAKED_SECRET_KEYS = {
    "[REDACTED_SECRET]",
    "your-cryptographically-secure-jwt-signing-secret-placeholder-min-32-chars",
    "secret",
    "changeme",
    "admin"
}

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(str(ENV_FILE_PATH), ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "Student Placement Management System (SPMS)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = Field("development", validation_alias=AliasChoices("ENVIRONMENT", "ENV"))

    # Database (MongoDB Atlas) - Loaded strictly from environment; no hardcoded credentials
    MONGODB_URL: str = Field(
        ...,
        validation_alias=AliasChoices("MONGODB_URL", "MONGODB_URI"),
        description="MongoDB connection string loaded strictly from environment"
    )
    DATABASE_NAME: str = Field(
        "spms_db",
        validation_alias=AliasChoices("DATABASE_NAME", "MONGODB_DATABASE")
    )

    # Security & JWT Signing Secret - Loaded strictly from environment; no hardcoded credentials
    SECRET_KEY: str = Field(
        ...,
        min_length=32,
        description="Cryptographically secure JWT signing secret loaded strictly from environment"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        60 * 24,
        validation_alias=AliasChoices("ACCESS_TOKEN_EXPIRE_MINUTES", "TOKEN_EXPIRE_MINUTES")
    )

    # Explicit CORS Allowed Origins - Wildcard origins strictly forbidden
    BACKEND_CORS_ORIGINS: Union[List[str], str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ],
        validation_alias=AliasChoices("BACKEND_CORS_ORIGINS", "CORS_ORIGINS")
    )

    # Demo / Development Seeding
    ENABLE_DEMO_SEEDING: bool = True
    DEMO_ADMIN_PASSWORD: str = "Admin@123"
    DEMO_STUDENT_PASSWORD: str = "Student@123"
    DEMO_RECRUITER_PASSWORD: str = "Recruiter@123"

    # Uploads directory
    UPLOAD_DIR: str = str(BACKEND_DIR / "uploads")

    @field_validator("MONGODB_URL", mode="before")
    @classmethod
    def validate_mongodb_url(cls, v: str) -> str:
        if not v or not isinstance(v, str) or not v.strip():
            raise ValueError("MONGODB_URL is mandatory and cannot be empty. Please configure it in backend/.env.")
        v = v.strip()
        if not (v.startswith("mongodb://") or v.startswith("mongodb+srv://")):
            raise ValueError("MONGODB_URL must start with 'mongodb://' or 'mongodb+srv://'.")
        if "<db_password>" in v or "<password>" in v or "<username>" in v:
            raise ValueError("MONGODB_URL contains unconfigured placeholder tokens.")
        if "[REDACTED_SECRET]" in v:
            raise ValueError("CRITICAL SECURITY ERROR: Compromised database credential detected in MONGODB_URL.")
        return v

    @field_validator("SECRET_KEY", mode="before")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if not v or not isinstance(v, str) or not v.strip():
            raise ValueError("SECRET_KEY is mandatory and cannot be empty. Please configure it in backend/.env.")
        v = v.strip()
        if v in LEAKED_SECRET_KEYS:
            raise ValueError("CRITICAL SECURITY ERROR: The provided SECRET_KEY is a compromised key or placeholder.")
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long for cryptographic security.")
        return v

    @field_validator("BACKEND_CORS_ORIGINS", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        origins: List[str] = []
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    origins = json.loads(v)
                except Exception:
                    origins = [x.strip() for x in v.strip("[]").split(",") if x.strip()]
            else:
                origins = [x.strip() for x in v.split(",") if x.strip()]
        elif isinstance(v, list):
            origins = [str(x).strip() for x in v if str(x).strip()]
        else:
            origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

        # CRITICAL CORS SECURITY: Never permit wildcard origins
        sanitized = []
        for origin in origins:
            origin_clean = origin.rstrip("/")
            if origin_clean == "*":
                logger.warning("Wildcard CORS origin '*' was specified but has been removed for security compliance.")
                continue
            if origin_clean and origin_clean not in sanitized:
                sanitized.append(origin_clean)

        if not sanitized:
            # Fallback to approved development origins
            sanitized = ["http://localhost:5173", "http://127.0.0.1:5173"]

        return sanitized

    @field_validator("ENABLE_DEMO_SEEDING", mode="after")
    @classmethod
    def enforce_production_seeding_restrictions(cls, v: bool, info) -> bool:
        env = info.data.get("ENVIRONMENT", "development")
        if env and str(env).lower() == "production":
            return False
        return v

try:
    settings = Settings()
except Exception as e:
    logger.critical(f"FATAL: Application configuration validation failed: {e}")
    raise
