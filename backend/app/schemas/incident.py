from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class IncidentCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5)
    source: str = Field(default="manual", max_length=100)


class IncidentUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200,
    )

    description: str | None = Field(
        default=None,
        min_length=5,
    )

    source: str | None = Field(
        default=None,
        max_length=100,
    )

    threat_type: str | None = None
    severity: str | None = None
    status: str | None = None
    indicators: list[Any] | None = None
    impact: str | None = None
    confidence: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )
    ai_analysis: str | None = None
    response_plan: str | None = None


class IncidentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    source: str
    threat_type: str | None
    severity: str
    status: str
    indicators: list[Any] | None
    impact: str | None
    confidence: float | None
    ai_analysis: str | None
    response_plan: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )