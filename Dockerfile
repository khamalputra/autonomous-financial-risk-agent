# Dockerfile for Railway Deployment
# Deterministic build environment that bypasses Nixpacks configuration issues
FROM python:3.11-slim

# Install system dependencies (libgomp1 is required by LightGBM for OpenMP)
RUN apt-get update && apt-get install -y \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY . .

# Expose default port
EXPOSE 8000

# Start the FastAPI application on the port provided by Railway
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
