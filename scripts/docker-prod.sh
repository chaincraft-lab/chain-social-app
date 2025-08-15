#!/bin/bash

# Production environment startup script
echo "🚀 Starting production environment..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Start production services
echo "▶️  Starting production services..."
docker compose up --build -d

echo "🎉 Production environment is running!"
echo ""
echo "📍 Services available at:"
echo "   🌐 Frontend:        http://localhost:8080"
echo "   🔧 Admin Dashboard: http://localhost:3000"
echo "   🚀 Backend API:     http://localhost:8020"
echo "   🗄️  Database:       localhost:5001"
echo ""
echo "📊 Check status with: docker compose ps"
echo "📋 View logs with: docker compose logs -f [service_name]"