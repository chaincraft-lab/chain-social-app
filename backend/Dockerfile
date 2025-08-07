FROM node:20-bullseye

# Sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    libpq-dev \
    curl \
    bash \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

RUN npx prisma migrate dev --name init

EXPOSE 3000

CMD ["/bin/bash", "./entrypoint.sh"]
