FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off

WORKDIR /app

# Install system deps required for psycopg2 and alembic
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy source code
COPY src/ /app/src/
COPY alembic.ini /app/alembic.ini

# Ensure alembic is available
RUN pip install alembic

# Create .env from template if missing (development convenience)
RUN if [ ! -f /app/.env ]; then cp /app/.env.example /app/.env; fi

# Run database migrations on container start
RUN alembic upgrade head

# Expose port
EXPOSE 8000

# Use gunicorn with uvicorn workers for ASGI
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "--worker-class", "uvicorn.workers.UvicornWorker", "src.main:app"]