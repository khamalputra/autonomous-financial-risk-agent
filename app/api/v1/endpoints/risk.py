from fastapi import APIRouter, HTTPException, Query, Response
from typing import List, Dict, Any
from datetime import datetime

from app.api.v1.schemas.risk import RiskAnalysisRequest, RiskAnalysisResponse
from app.services.risk_engine import risk_service
from app.services.pdf_generator import PDFReportGenerator
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

@router.post("/risk/export-pdf")
async def export_risk_pdf(request: RiskAnalysisRequest):
    """Generates and downloads a formal Basel III Market Risk Audit PDF Report."""
    try:
        risk_data = risk_service.analyze_risk(
            ticker=request.ticker,
            portfolio_value=request.portfolio_value,
            confidence_level=request.confidence_level
        )
        pdf_bytes = PDFReportGenerator.generate_risk_report(risk_data)
        
        reports_dir = os.path.join(settings.BASE_DIR, "reports")
        os.makedirs(reports_dir, exist_ok=True)
        filename = f"Risk_Intelligence_Report_{request.ticker}_{datetime.now().strftime('%Y-%m-%d')}.pdf"
        filepath = os.path.join(reports_dir, filename)
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation error: {str(e)}")

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
