# News Site Project

Modern news website with NestJS backend, Vue.js frontend and Next.js admin dashboard.

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

## Project Structure

```
news-site/
├── backend/           # NestJS REST API
├── frontend/          # Vue.js News Site  
├── admin-dashboard/   # Next.js Admin Panel
├── scripts/           # Docker helper scripts
└── docker-compose.yml # Docker configuration
```

## Quick Start

### Development Environment

```bash
# Start all services
docker compose -f docker-compose.dev.yml up --build

# Or use helper script
./scripts/docker-dev.sh
```

### Production Environment

```bash
# Start production services
docker compose up --build -d

# Or use helper script
./scripts/docker-prod.sh
```

## Services & Ports

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:8080 | Vue.js news website |
| **Admin Dashboard** | http://localhost:3000 | Next.js admin panel |
| **Backend API** | http://localhost:8020 | NestJS REST API |
| **Database** | localhost:5001 | PostgreSQL database |
| **API Docs** | http://localhost:8020/api | Swagger documentation |

## Technologies

- **Backend**: NestJS + PostgreSQL + Prisma
- **Frontend**: Vue.js 3 + Vuetify
- **Admin**: Next.js 12 + Material-UI
- **Database**: PostgreSQL
- **Auth**: JWT
- **Container**: Docker

## Docker Commands

```bash
# Start development environment
docker compose -f docker-compose.dev.yml up --build

# Start production environment  
docker compose up --build -d

# View logs
docker compose logs -f [service_name]

# Check status
docker compose ps

# Stop all services
docker compose down
```

## Manual Development

### Backend
```bash
cd backend
npm install
npm run start:dev
# Runs on http://localhost:8020
```

### Frontend
```bash
cd frontend  
npm install
npm run dev
# Runs on http://localhost:8080
```

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev  
# Runs on http://localhost:3000
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:habersitesipass@localhost:5432/habersitesidb"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
```

### Admin Dashboard (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8020
NEXT_PUBLIC_API_VERSION=v1
```

---

**Developer**: ozknsmz  
**Version**: 1.0.0