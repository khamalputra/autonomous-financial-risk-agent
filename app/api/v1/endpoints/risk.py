from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any

from app.api.v1.schemas.risk import RiskAnalysisRequest, RiskAnalysisResponse
from app.services.risk_engine import risk_service
from app.core.config import settings

router = APIRouter()

@router.post("/risk/analyze", response_model=RiskAnalysisResponse)
async def analyze_risk(request: RiskAnalysisRequest):
    """Runs real-time quantitative market risk analysis for a specified asset."""
    try:
        result = risk_service.analyze_risk(
            ticker=request.ticker,
            portfolio_value=request.portfolio_value,
            confidence_level=request.confidence_level
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk engine processing error: {str(e)}")

@router.get("/risk/metadata")
async def get_metadata():
    """Returns serialized model version, metadata metrics, and EVT threshold."""
    if risk_service.metadata:
        return risk_service.metadata
    return {
        "model_name": "LightGBM_RealData_Volatility_Regressor",
        "version": "1.2",
        "evt_cap_threshold": risk_service.evt_cap_threshold,
        "features": risk_service.feature_cols
    }

@router.get("/market/tickers")
async def get_tickers():
    """Returns list of supported portfolio asset tickers."""
    return {"supported_tickers": settings.SUPPORTED_TICKERS}
