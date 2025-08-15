#!/bin/sh

set -e

echo "📡 Waiting for database to be ready..."

until pg_isready -h postgres_db -p 5432 -U postgres -t 60; do
  echo "⏳ Database is not ready yet. Waiting..."
  sleep 2
done

echo "✅ Database is ready. Running Prisma migrations..."

npx prisma migrate deploy || {
  echo "❌ Prisma migration failed!"
  exit 1
}

echo "🚀 Starting NestJS application..."
npm run start:dev
