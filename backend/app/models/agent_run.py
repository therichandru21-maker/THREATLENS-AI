from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    incident_id: Mapped[int] = mapped_column(
        ForeignKey(
            "incidents.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="completed",
        nullable=False,
    )

    steps: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    rag_sources: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    result: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )