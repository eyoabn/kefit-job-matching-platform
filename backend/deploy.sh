#!/bin/bash
set -e

echo "Stopping existing containers..."
docker-compose down

echo "Building and starting new containers..."
docker-compose up -d --build

echo "Waiting for backend to be healthy..."
for i in $(seq 1 30); do
  if curl -s http://localhost:8000/health > /dev/null; then
    echo "Backend is healthy"
    break
  fi
  echo "Waiting for backend... ($i/30)"
  sleep 2
done

echo "Checking backend logs..."
docker-compose logs backend | tail -20

echo "Deployment complete. Frontend available at http://localhost"