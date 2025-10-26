#!/bin/bash

echo "🏗️ BUILD: Running seed scripts during Docker build..."

# Mock environment variables for build-time seeding
export NODE_ENV=development
export DATABASE_URL="postgresql://builduser:buildpass@localhost:5432/builddb"

# Bu script build aşamasında çalışır, bu yüzden database bağlantısı olmayabilir
# Seed dosyalarını sadece validate ediyoruz
echo "📦 Validating seed scripts..."

# Protocol seed script'ini validate et
if node -c scripts/seedCategories.js; then
  echo "✅ seedCategories.js validated successfully"
else
  echo "❌ seedCategories.js validation failed"
  exit 1
fi

# Blockchain data seed script'ini validate et
if node -c scripts/seedUsersData.js; then
  echo "✅ seedUsersData.js validated successfully"
else
  echo "❌ seedUsersData.js validation failed"
  exit 1
fi

echo "🎉 BUILD: All seed scripts validated successfully!"