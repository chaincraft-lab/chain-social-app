# News Site Admin Dashboard

Admin dashboard for news management built with Next.js and Material-UI.

## Features

- Article management
- Category management
- User management
- Comment moderation
- Dashboard with statistics

## Technologies

- Next.js 12.1.6
- Material-UI 5.8.2
- TypeScript 4.7.3

## Quick Start

### With Docker (Recommended)

```bash
# From project root
docker compose up admin-dashboard
```

### Manual Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8020
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_APP_NAME=News Site Admin
```

## Available Scripts

```bash
npm run dev    # Development server
npm run build  # Production build
npm start      # Production start
```

---

**Port**: 3000  
**Developer**: ozknsmz
