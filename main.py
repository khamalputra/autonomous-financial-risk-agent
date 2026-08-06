import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.api.v1.endpoints.risk import router as risk_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Market Risk Intelligence & Volatility Agent REST API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(risk_router, prefix=settings.API_V1_STR)

# Static files setup
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/health")
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@app.get("/manifest.json")
async def serve_manifest():
    """Serves the Web App Manifest for PWA installation."""
    manifest_path = os.path.join(static_dir, "manifest.json")
    return FileResponse(manifest_path, media_type="application/manifest+json")

@app.get("/sw.js")
async def serve_service_worker():
    """Serves the Service Worker script with root scope."""
    sw_path = os.path.join(static_dir, "sw.js")
    return FileResponse(sw_path, media_type="application/javascript", headers={"Cache-Control": "no-cache"})

@app.get("/")
async def serve_index():
    """Serves the main web dashboard Single Page Application."""
    index_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Welcome to Autonomous Market Risk Intelligence API. Dashboard index.html loading..."}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
