import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_get_tickers():
    response = client.get("/api/v1/market/tickers")
    assert response.status_code == 200
    data = response.json()
    assert "supported_tickers" in data
    assert "AAPL" in data["supported_tickers"]

def test_get_metadata():
    response = client.get("/api/v1/risk/metadata")
    assert response.status_code == 200
    data = response.json()
    assert "evt_cap_threshold" in data

def test_analyze_risk_endpoint():
    payload = {
        "ticker": "AAPL",
        "portfolio_value": 1000000.0,
        "confidence_level": 0.95
    }
    response = client.post("/api/v1/risk/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["ticker"] == "AAPL"
    assert "predicted_volatility_annualized" in data
    assert "daily_var_usd" in data
    assert "daily_es_usd" in data
    assert "kupiec_p_value" in data
    assert data["basel_zone"] in ["GREEN", "YELLOW", "RED"]

def test_export_pdf_endpoint():
    payload = {
        "ticker": "AAPL",
        "portfolio_value": 1000000.0,
        "confidence_level": 0.95
    }
    response = client.post("/api/v1/risk/export-pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert len(response.content) > 1000
