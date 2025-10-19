# ChainSocial

Modern blockchain social media platform with NestJS backend, Vue.js frontend and Next.js admin dashboard.

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

## Project Structure

```
chain-social-app/
├── backend/           # NestJS REST API
├── frontend/          # Vue.js ChainSocial Platform  
├── admin-dashboard/   # Next.js Admin Panel
├── scripts/           # Docker helper scripts
└── docker-compose.yml # Docker configuration
```

## Quick Start

### 🚀 One-Command Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd chain-social-app

# Start all services with automatic setup
docker compose up --build -d

# Wait for all services to be ready (2-3 minutes)
# Check logs if needed:
docker compose logs -f backend
```

**What happens automatically:**
- ✅ PostgreSQL database setup
- ✅ Database migrations applied
- ✅ 10 blockchain protocols seeded
- ✅ 5 sample users created  
- ✅ 10 ChainSocial posts added
- ✅ All services started

### Development Environment

```bash
# Start development mode with hot reload
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
| **Frontend** | http://localhost:8080 | Vue.js ChainSocial platform |
| **Admin Dashboard** | http://localhost:3000 | Next.js admin panel |
| **Backend API** | http://localhost:8020 | NestJS REST API |
| **Database** | localhost:5001 | PostgreSQL database |
| **API Docs** | http://localhost:8020/api | Swagger documentation |

### 🔑 Default Login Credentials

**Admin Panel Access:**
- Email: `admin@blockchainews.com`
- Password: `admin123`

**Sample Authors:**
- Admin Blockchain: `admin@blockchainews.com` / `password123`
- Test Account: `test@blockchainews.com` / `password123`

### 🧹 Reset/Clean Setup

To reset everything and re-run seeding:
```bash
# Stop containers
docker compose down

# Remove volumes (this will reset database and seeding flags)
docker volume rm chain-social-app_postgres_data
docker volume rm chain-social-app_backend_seed_flag

# Start fresh
docker compose up --build -d
```

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
DATABASE_URL="postgresql://postgres:chainsocialpass@localhost:5432/chainsocialdb"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
```

### Admin Dashboard (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8020
NEXT_PUBLIC_API_VERSION=v1
```

---

**Developer**: chaincraft-lab  
**Version**: 1.0.0