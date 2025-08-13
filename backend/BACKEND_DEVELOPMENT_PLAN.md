# Backend Geliştirme Planı

## 📋 Proje Analizi

### Mevcut Durum
- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT + Passport (mevcut)
- **Modüller:** Auth, Users (temel yapı mevcut)

### Veritabanı Şeması
Kapsamlı şema mevcuttur:
- `User` - Kullanıcı yönetimi (rol tabanlı)
- `Article` - Makale/haber sistemi
- `Category` - Kategori yönetimi
- `Tag` - Etiket sistemi
- `Comment` - Yorum sistemi (nested comments)
- `Like` - Beğeni sistemi
- `Bookmark` - Kaydetme sistemi
- `Advertisement` - Reklam yönetimi
- `GalleryItem` - Medya galerisi

## 🎯 Hedef Modüler Mimari

```
src/
├── common/           # Ortak servisler ve utilities
│   ├── prisma/       # Prisma service
│   ├── dto/          # Ortak DTO'lar
│   ├── guards/       # Authentication guard'ları
│   ├── decorators/   # Custom decorator'lar
│   ├── filters/      # Exception filter'ları
│   ├── interceptors/ # Response interceptor'ları
│   └── validators/   # Custom validator'lar
├── auth/            # ✅ Mevcut - Geliştirilecek
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── users/           # ✅ Mevcut - Geliştirilecek
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── dto/
│   └── interfaces/
├── articles/        # 🆕 Makale CRUD sistemi
│   ├── articles.controller.ts
│   ├── articles.service.ts
│   ├── articles.module.ts
│   ├── dto/
│   └── interfaces/
├── categories/      # 🆕 Kategori yönetimi
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── categories.module.ts
│   ├── dto/
│   └── interfaces/
├── tags/           # 🆕 Etiket sistemi
│   ├── tags.controller.ts
│   ├── tags.service.ts
│   ├── tags.module.ts
│   ├── dto/
│   └── interfaces/
├── comments/        # 🆕 Yorum sistemi
│   ├── comments.controller.ts
│   ├── comments.service.ts
│   ├── comments.module.ts
│   ├── dto/
│   └── interfaces/
├── likes/           # 🆕 Beğeni sistemi
│   ├── likes.controller.ts
│   ├── likes.service.ts
│   ├── likes.module.ts
│   ├── dto/
│   └── interfaces/
├── bookmarks/       # 🆕 Kaydetme sistemi
│   ├── bookmarks.controller.ts
│   ├── bookmarks.service.ts
│   ├── bookmarks.module.ts
│   ├── dto/
│   └── interfaces/
├── gallery/         # 🆕 Medya yönetimi
│   ├── gallery.controller.ts
│   ├── gallery.service.ts
│   ├── gallery.module.ts
│   ├── dto/
│   └── interfaces/
├── advertisements/  # 🆕 Reklam yönetimi
│   ├── advertisements.controller.ts
│   ├── advertisements.service.ts
│   ├── advertisements.module.ts
│   ├── dto/
│   └── interfaces/
└── upload/          # 🆕 Dosya upload
    ├── upload.controller.ts
    ├── upload.service.ts
    ├── upload.module.ts
    ├── dto/
    └── interfaces/
```

## 🌐 API Endpoint Planı

### Base URL: `/api/v1`

#### Authentication Endpoints
```
POST   /auth/register          # Kullanıcı kayıt
POST   /auth/login             # Giriş yapma
POST   /auth/refresh           # Token yenileme
POST   /auth/logout            # Çıkış yapma
POST   /auth/forgot-password   # Şifre sıfırlama talebi
POST   /auth/reset-password    # Şifre sıfırlama
```

#### User Management Endpoints
```
GET    /users/profile          # Kendi profili görme (auth required)
PUT    /users/profile          # Profil güncelleme (auth required)
GET    /users/:id              # Kullanıcı profili görme
PUT    /users/:id              # Kullanıcı güncelleme (admin only)
DELETE /users/:id              # Kullanıcı silme (admin only)
GET    /users                  # Kullanıcı listesi (admin only)
```

#### Articles Endpoints
```
GET    /articles               # Makale listesi (pagination, filter, search)
GET    /articles/:slug         # Tek makale görme
POST   /articles               # Makale oluşturma (auth required)
PUT    /articles/:id           # Makale güncelleme (auth required)
DELETE /articles/:id           # Makale silme (auth required)
GET    /articles/user/:userId  # Kullanıcının makaleleri
POST   /articles/:id/publish   # Makale yayınlama (editor/admin)
POST   /articles/:id/unpublish # Makale yayından kaldırma
```

#### Categories Endpoints
```
GET    /categories             # Kategori listesi
GET    /categories/:slug       # Tek kategori
GET    /categories/:slug/articles # Kategorideki makaleler
POST   /categories             # Kategori oluşturma (admin only)
PUT    /categories/:id         # Kategori güncelleme (admin only)
DELETE /categories/:id         # Kategori silme (admin only)
```

#### Tags Endpoints
```
GET    /tags                   # Etiket listesi
GET    /tags/:slug             # Tek etiket
GET    /tags/:slug/articles    # Etiketteki makaleler
POST   /tags                   # Etiket oluşturma (auth required)
PUT    /tags/:id               # Etiket güncelleme (admin only)
DELETE /tags/:id               # Etiket silme (admin only)
```

#### Comments Endpoints
```
GET    /comments/article/:articleId # Makale yorumları
POST   /comments/article/:articleId # Yorum ekleme (auth required)
PUT    /comments/:id           # Yorum güncelleme (auth required)
DELETE /comments/:id           # Yorum silme (auth required)
POST   /comments/:id/reply     # Yanıt ekleme (auth required)
POST   /comments/:id/approve   # Yorum onaylama (moderator/admin)
POST   /comments/:id/reject    # Yorum reddetme (moderator/admin)
```

#### Likes Endpoints
```
POST   /likes/article/:articleId    # Makale beğenme (auth required)
DELETE /likes/article/:articleId    # Beğeniyi kaldırma (auth required)
GET    /likes/user/:userId          # Kullanıcının beğendikleri
```

#### Bookmarks Endpoints
```
GET    /bookmarks              # Kayıtlı makaleler (auth required)
POST   /bookmarks/article/:articleId # Makale kaydetme (auth required)
DELETE /bookmarks/article/:articleId # Kayıttan çıkarma (auth required)
```

#### Gallery Endpoints
```
GET    /gallery                # Galeri öğeleri
GET    /gallery/:id            # Tek galeri öğesi
POST   /gallery                # Galeri öğesi ekleme (auth required)
PUT    /gallery/:id            # Galeri öğesi güncelleme (auth required)
DELETE /gallery/:id            # Galeri öğesi silme (auth required)
GET    /gallery/article/:articleId # Makale galeri öğeleri
```

#### Advertisements Endpoints
```
GET    /advertisements         # Reklam listesi
GET    /advertisements/position/:position # Pozisyona göre reklamlar
POST   /advertisements         # Reklam ekleme (admin only)
PUT    /advertisements/:id     # Reklam güncelleme (admin only)
DELETE /advertisements/:id     # Reklam silme (admin only)
POST   /advertisements/:id/view # Reklam görüntülenme sayısı artırma
POST   /advertisements/:id/click # Reklam tıklama sayısı artırma
```

#### Upload Endpoints
```
POST   /upload/image           # Resim yükleme (auth required)
POST   /upload/document        # Belge yükleme (auth required)
DELETE /upload/:filename       # Dosya silme (auth required)
```

## 🚀 Geliştirme Sırası

### Faz 1: Temel Altyapı
1. **Common Services Setup**
   - Prisma service kurulumu
   - Response interceptors
   - Exception filters
   - Validation pipes

### Faz 2: Kategori Sistemi
2. **Categories Module**
   - CRUD operasyonları
   - Slug based routing
   - Validation

### Faz 3: Ana İçerik Sistemi
3. **Articles Module**
   - Tam CRUD operasyonları
   - Arama ve filtreleme
   - Pagination
   - Status yönetimi (draft/published)

### Faz 4: Etkileşim Sistemleri
4. **Comments Module**
   - Nested comments
   - Moderation sistemi
5. **Likes Module**
   - Beğeni/beğenmeme
6. **Bookmarks Module**
   - Kaydetme sistemi

### Faz 5: Medya ve Yardımcı Sistemler
7. **Upload Module**
   - Resim upload
   - File validation
8. **Gallery Module**
   - Medya yönetimi
9. **Tags Module**
   - Etiket sistemi
10. **Advertisements Module**
    - Reklam yönetimi

### Faz 6: Optimizasyon ve Dokümantasyon
11. **API Documentation** (Swagger)
12. **Performance Optimization**
13. **Security Enhancements**
14. **Testing** (Unit & E2E)

## 📝 Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- DTOs for all endpoints
- Proper error handling
- Input validation
- Authentication guards

### Database Best Practices
- Prisma migrations
- Proper indexing
- Soft deletes where needed
- Audit trails
- Connection pooling

### Security Measures
- JWT authentication
- Role-based access control
- Input sanitization
- Rate limiting
- CORS configuration
- Security headers

## ✅ Definition of Done

Her modül için:
- [ ] Controller, Service, Module created
- [ ] DTOs defined with validation
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Swagger documentation added
- [ ] Error handling implemented
- [ ] Authentication/authorization configured
- [ ] Database migrations created (if needed)
- [ ] Code reviewed and approved

## 📊 Success Metrics

- All endpoints return proper HTTP status codes
- Response times under 200ms for simple queries
- 100% test coverage for core business logic
- Complete API documentation
- No security vulnerabilities
- Clean, maintainable code structure