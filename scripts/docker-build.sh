#!/bin/bash

# Build script for all services
echo "🏗️  Building all Docker services..."

# Build backend
echo "📦 Building backend..."
docker build -t haber-sitesi-backend ./backend

# Build frontend
echo "📦 Building frontend..."
docker build -t haber-sitesi-frontend ./frontend

# Build admin dashboard
echo "📦 Building admin dashboard..."
docker build -t haber-sitesi-admin ./admin-dashboard

echo "✅ All services built successfully!"

# Optional: Build with docker compose
echo "🚀 Building with docker compose..."
docker compose build

echo "🎉 Build process completed!"