#!/bin/bash

set -e

echo "🚀 Starting Backend Setup..."

echo "📡 Waiting for database to be ready..."
until pg_isready -h postgres_db -p 5432 -U postgres -t 60; do
  echo "⏳ Database is not ready yet. Waiting..."
  sleep 3
done

echo "✅ Database is ready!"

echo "🔄 Regenerating Prisma client..."
npx prisma generate

echo "📋 Checking database status..."
# Database durumunu kontrol et ve uygun aksiyonu al
if npx prisma db pull >/dev/null 2>&1; then
  echo "✅ Database schema exists"
  # Tüm migration'ları applied olarak işaretle
  if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
    echo "🔄 Marking all migrations as applied..."
    for migration in prisma/migrations/*/; do
      migration_name=$(basename "$migration")
      echo "Marking $migration_name as applied..."
      npx prisma migrate resolve --applied "$migration_name" || echo "⚠️ Failed to mark $migration_name, continuing..."
    done
  fi
else
  echo "🔧 Setting up database for the first time..."
  npx prisma db push
fi

# Database boş mu kontrol et, eğer boş ise seed scriptlerini çalıştır
echo "📊 Checking if database needs seeding..."

# Users tablosunda veri var mı kontrol et
USER_COUNT=$(psql "${DATABASE_URL}" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "0")

if [ "$USER_COUNT" = "0" ] || [ "$USER_COUNT" = "" ]; then
  echo "🌱 Database is empty, running seed scripts..."
  
  echo "🏗️ Seeding protocols..."
  npm run seed:protocols || echo "⚠️ Protocol seeding failed"
  
  echo "📰 Seeding blockchain data..."
  npm run seed:blockchain-data || echo "⚠️ Blockchain data seeding failed"
  
  echo "✅ Seeding completed!"
else
  echo "⏭️ Database already has data ($USER_COUNT users), skipping seeding..."
fi

# Skip dist cleanup to avoid EBUSY errors
echo "🎉 Setup completed! Starting NestJS application..."

# Start the application directly without cleaning dist
exec npm run start:dev
