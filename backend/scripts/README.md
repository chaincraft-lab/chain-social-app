# Database Seeding Scripts

This directory contains scripts to populate the database with initial data for the ArbitrumSocial application.

## Available Scripts

### 1. `seedCategories.js`
Seeds the database with categories (DeFi, Gaming, NFT, Infrastructure, Grants, Finance).

```bash
npm run seed:categories
```

### 2. `seedUsersData.js`
Creates initial users with different roles (Admin, Authors, Editors).

```bash
npm run seed:mock-data
```

### 3. `batchImportArticles.js`
Imports real articles from external websites listed in `article-urls.txt`.

```bash
npm run import:articles-data
```

### 4. Complete Setup
Runs all seeding scripts in the correct order:

```bash
npm run seed:all
```

## Setup Process

1. **Start the database**: Make sure PostgreSQL is running
2. **Run migrations**: `npx prisma migrate deploy`
3. **Seed all data**: `npm run seed:all`

## Article Import Configuration

Edit `article-urls.txt` to add URLs of articles you want to import:

```
https://blog.arbitrum.foundation/example-article-1/
https://vitalik.ca/general/example-article-2/
https://ethereum.org/en/blog/example-article-3/
```

The batch import script will:
- Extract title, content, excerpt, and images from each URL
- Assign articles to random categories
- Use system users as authors
- Create unique slugs for each article

## User Accounts Created

The seeding process creates these test accounts:

| Name | Email | Role | Password |
|------|-------|------|----------|
| Alex Thompson | alex@arbitrumsocial.app | AUTHOR | password123 |
| Sarah Chen | sarah@arbitrumsocial.app | AUTHOR | password123 |
| Michael Rodriguez | michael@arbitrumsocial.app | EDITOR | password123 |
| Emma Johnson | emma@arbitrumsocial.app | AUTHOR | password123 |
| David Kim | admin@arbitrumsocial.app | ADMIN | admin123 |

## Categories Created

- **DeFi**: Decentralized finance protocols and applications
- **Gaming**: Blockchain games, NFT games and GameFi projects  
- **NFT**: Non-Fungible Token projects, marketplaces and collections
- **Infrastructure**: Infrastructure projects, bridges, developer tools
- **Grants**: Grant programs, funding opportunities and ecosystem support
- **Finance**: Traditional finance news, market analysis and economic developments

## Notes

- Articles are no longer created in seed scripts - they're imported from real websites
- All data is in English for international appeal
- Users have realistic blockchain/crypto backgrounds
- The system automatically handles duplicate slugs and categories