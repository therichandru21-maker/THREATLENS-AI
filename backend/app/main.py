from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine

from app.models import (
    User,
    Incident,
    Analysis,
    AgentRun,
)

from app.routes.auth import (
    router as auth_router,
)

from app.routes.incident import (
    router as incident_router,
)

from app.routes.analysis import (
    router as analysis_router,
)

from app.routes.analytics import (
    router as analytics_router,
)


# =========================
# DATABASE INITIALIZATION
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# FASTAPI APPLICATION
# =========================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "CyberSentinel AI - "
        "AI-powered cybersecurity "
        "incident response platform."
    ),
)


# =========================
# CORS
# =========================

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if settings.FRONTEND_URL:
    frontend_url = settings.FRONTEND_URL.rstrip("/")

    if frontend_url not in allowed_origins:
        allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ROUTES
# =========================

app.include_router(auth_router)
app.include_router(incident_router)
app.include_router(analysis_router)
app.include_router(analytics_router)


# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
    }


# =========================
# HEALTH CHECK
# =========================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
    }