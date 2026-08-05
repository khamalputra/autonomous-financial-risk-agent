import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Market Risk Intelligence & Volatility Agent"
    VERSION: str = "1.2.0"
    API_V1_STR: str = "/api/v1"
    
    # Base paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    MODEL_DIR: str = os.path.join(BASE_DIR, "models")
    
    # Model artifact filenames
    MODEL_PKL_PATH: str = os.path.join(MODEL_DIR, "volatility_lightgbm_v1.2.pkl")
    MODEL_META_PATH: str = os.path.join(MODEL_DIR, "model_metadata_v1.2.json")
    
    # Default Risk Engine Settings
    DEFAULT_EVT_CAP: float = 0.6926
    SUPPORTED_TICKERS: List[str] = ["AAPL", "MSFT", "BTC-USD", "ETH-USD"]
    DEFAULT_CONFIDENCE: float = 0.95
    
    # CORS Origins
    CORS_ORIGINS: List[str] = ["*"]
    
    class Config:
        case_sensitive = True

settings = Settings()
