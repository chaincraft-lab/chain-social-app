#!/bin/bash

# Development environment startup script
echo "🚀 Starting development environment..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker compose.dev.yml down

# Start development services
echo "▶️  Starting development services..."
docker compose -f docker compose.dev.yml up --build

echo "🎉 Development environment is running!"
echo ""
echo "📍 Services available at:"
echo "   🌐 Frontend:        http://localhost:8080"
echo "   🔧 Admin Dashboard: http://localhost:3000"
echo "   🚀 Backend API:     http://localhost:8020"
echo "   🗄️  Database:       localhost:5001"