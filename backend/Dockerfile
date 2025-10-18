FROM node:20-bullseye

# Sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    libpq-dev \
    postgresql-client \
    curl \
    bash \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Package files kopyala ve dependencies yükle
COPY package*.json ./
RUN npm install

# Prisma generate için gerekli
COPY prisma ./prisma/
RUN npx prisma generate

# Scripts klasörünü kopyala (seed işlemleri için)
COPY scripts ./scripts/

# Tüm kod dosyalarını kopyala
COPY . .

# Build seed script'ini kopyala ve çalıştır
COPY build-seed.sh ./
RUN chmod +x build-seed.sh && ./build-seed.sh

# Build flag oluştur (build aşamasında seed validate edildiğini belirtmek için)
RUN touch /usr/src/app/.build_seeded

# Entrypoint script'ini kopyala ve executable yap
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000

# Healthcheck ekle
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Entrypoint script'i çalıştır
CMD ["/bin/bash", "./entrypoint.sh"]
