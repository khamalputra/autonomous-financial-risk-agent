from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class RiskAnalysisRequest(BaseModel):
    ticker: str = Field(default="AAPL", description="Asset ticker symbol (AAPL, MSFT, BTC-USD, ETH-USD)")
    portfolio_value: float = Field(default=1000000.0, ge=100.0, description="Total portfolio value in USD")
    confidence_level: float = Field(default=0.95, ge=0.80, le=0.99, description="Confidence level for VaR calculation (e.g. 0.95)")

class TimeSeriesData(BaseModel):
    dates: List[str]
    returns: List[float]
    predicted_volatility: List[float]
    var_limits: List[float]
    breaches: List[bool]

class NewsSentimentItem(BaseModel):
    ticker: str
    title: str
    pub_date: str
    compound: float
    pos: float
    neg: float
    neu: float

class RiskAnalysisResponse(BaseModel):
    ticker: str
    portfolio_value: float
    confidence_level: float
    predicted_volatility_annualized: float
    predicted_volatility_daily: float
    daily_var_pct: float
    daily_var_usd: float
    daily_es_pct: float
    daily_es_usd: float
    evt_cap_threshold: float
    total_observations: int
    var_violations: int
    observed_violation_rate: float
    kupiec_pof_stat: float
    kupiec_p_value: float
    basel_zone: str
    time_series: TimeSeriesData
    recent_news: List[NewsSentimentItem]
