from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class AnalysisResponse(BaseModel):
    id: int
    incident_id: int
    user_id: int
    threat_type: str | None
    severity: str
    confidence: float | None
    indicators: list[Any] | None
    impact: str | None
    ai_analysis: str | None
    response_plan: str | None
    rag_sources: list[str] | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )