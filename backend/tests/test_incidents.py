from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_incident_routes_exist():
    paths = set(app.openapi()["paths"].keys())

    assert "/incidents/" in paths
    assert "/incidents/{incident_id}" in paths
    assert "/incidents/{incident_id}/analyze" in paths
    assert "/incidents/{incident_id}/agent-run" in paths


def test_incidents_requires_authentication():
    response = client.get("/incidents/")

    assert response.status_code in [401, 403]