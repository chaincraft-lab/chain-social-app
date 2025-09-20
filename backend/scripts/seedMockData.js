const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Savunma sanayi ile ilgili başlıklar
const defenseNewsHeadlines = [
  'Türk Savunma Sanayisi Yeni Teknolojilerle Güçleniyor',
  'Milli İHA Projeleri Dünya Standartlarında',
  'Savunma Sanayii Başkanlığı Yeni Yatırımları Açıkladı',
  'TUSAŞ\'tan Yerli Uçak Motoru Atılımı',
  'Aselsan\'dan Elektronik Harp Sistemlerinde Büyük Başarı',
  'Roketsan\'ın Yeni Füze Sistemleri Test Edildi',
  'Baykar\'ın İHA Teknolojileri Uluslararası Arenada',
  'Havelsan\'dan Siber Güvenlik Alanında Yenilik',
  'STM\'den Denizcilik Teknolojilerinde Atılım',
  'TAI Yeni Nesil Savaş Uçağı Geliştiriyor',
  'Milli Radar Sistemleri Projesi Başlatıldı',
  'Yerli Tank Modernizasyonu Tamamlandı',
  'Savunma Sanayinde Yerlilik Oranı Yükseliyor',
  'Askeri Haberleşme Sistemlerinde Teknolojik Gelişme',
  'Deniz Kuvvetleri İçin Yeni Fırkateyn Projesi',
  'Hava Savunma Sistemlerinde Milli Çözümler',
  'Sınır Güvenliği Teknolojilerinde İnovasyonlar',
  'Elektronik Harp Kabiliyetlerinde Gelişmeler',
  'Muhabere Uydu Projesi\'nde Son Durum',
  'Savunma Sanayii İhracatında Rekor Artış',
  'Askeri Simülatör Teknolojilerinde Yerli Üretim',
  'Taktik Füze Sistemlerinde Yerlilik Hedefi',
  'Silahlı İnsansız Araçlar Geliştiriliyor',
  'Savunma Sanayinde Yapay Zeka Uygulamaları',
  'Milli Güvenlik Ekosistemi Güçleniyor',
];

// Savunma sanayi ile ilgili içerik örnekleri
const defenseNewsContents = [
  'Türk savunma sanayisi, yerli ve milli imkanlarla üretilen yenilikçi teknolojilerle dünya çapında rekabet gücünü artırmaya devam ediyor. Son geliştirilen sistemler, NATO standartlarında kalite ve güvenilirlik sunuyor.',
  'İnsansız hava araçları teknolojisinde Türkiye\'nin dünya liderleri arasına girdiği bir dönemde, yeni projeler savunma kabiliyetlerini daha da güçlendiriyor.',
  'Savunma Sanayii Başkanlığı tarafından açıklanan yeni yatırım programı, kritik teknolojilerde yerlilik oranını artırmayı hedefliyor.',
  'Havacılık sektöründe önemli atılımlar gerçekleştiren TUSAŞ, yerli motor teknolojisi ile uluslararası pazarda söz sahibi olmaya hazırlanıyor.',
  'Elektronik harp sistemlerinde yakalanan başarı, modern savaş alanlarında Türk Silahlı Kuvvetleri\'nin teknolojik üstünlüğünü pekiştiriyor.',
  'Roketsan\'ın geliştirdiği yeni nesil füze sistemleri, hassas vuruş kabiliyeti ve uzun menzil özellikleriyle dikkat çekiyor.',
  'Baykar\'ın ürettiği İHA sistemleri, çeşitli operasyonel görevlerde elde ettiği başarılarla dünya genelinde tanınıyor.',
  'Siber güvenlik alanında Havelsan\'ın geliştirdiği çözümler, kritik altyapıları korumada önemli rol oynuyor.',
  'Denizcilik teknolojilerinde STM\'nin öncülük ettiği projeler, Türk Deniz Kuvvetleri\'nin operasyonel kapasitesini artırıyor.',
  'TAI\'nin yeni nesil savaş uçağı projesi, gelişmiş aviyonik sistemleri ve stealth teknolojisi ile gelecek nesil hava gücünü şekillendirecek.',
];

// Görsel URL\'leri (Unsplash\'den savunma/teknoloji temalı)
const imageUrls = [
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800',
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800',
  'https://images.unsplash.com/photo-1569395872688-174d5ca3e82e?w=800',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
];

// Kullanıcı isimleri
const userNames = [
  'Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hasan', 'Hüseyin', 'İbrahim', 'Yusuf', 'Ömer', 'Fatma',
  'Ayşe', 'Hatice', 'Zeynep', 'Elif', 'Emine', 'Meryem', 'Sultan', 'Hanife', 'Rukiye', 'Cemile',
  'Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hasan', 'Hüseyin', 'İbrahim', 'Yusuf', 'Ömer', 'Burak',
  'Emre', 'Serkan', 'Caner', 'Onur', 'Furkan', 'Gökhan', 'Kerem', 'Murat', 'Deniz', 'Tolga',
];

const userSurnames = [
  'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Şen', 'Özkan', 'Arslan', 'Doğan', 'Aslan',
  'Koç', 'Kara', 'Korkmaz', 'Aydın', 'Özdemir', 'Bulut', 'Güneş', 'Erdoğan', 'Çakır', 'Yıldız',
  'Öztürk', 'Polat', 'Turan', 'Aktaş', 'Karaca', 'Mutlu', 'Demirtaş', 'Özer', 'Başaran', 'Kurt',
];

// Random seçim fonksiyonu
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Random sayı üretme fonksiyonu
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Slug oluşturma fonksiyonu
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Tarih aralığında random tarih
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🚀 Mock data oluşturuluyor...');

  try {
    // Mevcut verileri temizle (opsiyonel)
    console.log('📦 Mevcut veriler temizleniyor...');
    await prisma.articleTag.deleteMany();
    await prisma.like.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();

    // 200 kullanıcı oluştur
    console.log('👥 200 kullanıcı oluşturuluyor...');
    const users = [];
    const hashedPassword = await bcrypt.hash('password123', 10);

    for (let i = 1; i <= 200; i++) {
      const name = getRandomItem(userNames);
      const surname = getRandomItem(userSurnames);
      const username = `${name.toLowerCase()}${surname.toLowerCase()}${i}`;
      const email = `${username}@example.com`;
      
      const user = await prisma.user.create({
        data: {
          name,
          surname,
          username,
          email,
          password: hashedPassword,
          avatar: i <= 20 ? `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i}.jpg` : null,
          bio: i <= 50 ? `${name} ${surname} - Savunma sanayi uzmanı ve teknoloji takipçisi` : null,
          role: i <= 5 ? 'ADMIN' : i <= 15 ? 'AUTHOR' : i <= 25 ? 'EDITOR' : 'USER',
          lastLogin: getRandomDate(new Date(2024, 0, 1), new Date()),
          createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
        },
      });
      users.push(user);
    }

    // Kategoriler (mevcut ID\'ler: 36,37,39,40,41,42,43)
    const categoryIds = [36, 37, 39, 40, 41, 42, 43];
    
    // Etiketler (mevcut ID\'ler: 5,6,8,9,10,11,12,13)
    const tagIds = [5, 6, 8, 9, 10, 11, 12, 13];

    // 100 makale oluştur
    console.log('📰 100 makale oluşturuluyor...');
    const articles = [];
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date();

    for (let i = 1; i <= 100; i++) {
      const title = getRandomItem(defenseNewsHeadlines) + ` - ${i}`;
      const content = getRandomItem(defenseNewsContents) + ' ' + getRandomItem(defenseNewsContents);
      const excerpt = content.substring(0, 150) + '...';
      const slug = createSlug(title);
      
      // Random yazar seç (sadece AUTHOR, EDITOR veya ADMIN olanlardan)
      const authorUsers = users.filter(u => ['AUTHOR', 'EDITOR', 'ADMIN'].includes(u.role));
      const author = getRandomItem(authorUsers);
      
      const publishedAt = getRandomDate(startDate, endDate);
      
      const article = await prisma.article.create({
        data: {
          title,
          slug: `${slug}-${i}`,
          excerpt,
          content: content + '\\n\\n' + getRandomItem(defenseNewsContents) + '\\n\\n' + getRandomItem(defenseNewsContents),
          image: getRandomItem(imageUrls),
          status: 'PUBLISHED',
          isFeatured: Math.random() > 0.8, // %20 öne çıkan
          isBreaking: Math.random() > 0.9, // %10 son dakika
          views: getRandomNumber(100, 5000),
          likes: getRandomNumber(5, 200),
          publishedAt,
          createdAt: publishedAt,
          authorId: author.id,
          categoryId: getRandomItem(categoryIds),
        },
      });
      articles.push(article);
    }

    // Makale-etiket ilişkileri oluştur
    console.log('🏷️ Makale-etiket ilişkileri oluşturuluyor...');
    for (const article of articles) {
      // Her makale için 1-4 arası random etiket
      const numTags = getRandomNumber(1, 4);
      const selectedTagIds = [];
      
      for (let i = 0; i < numTags; i++) {
        const tagId = getRandomItem(tagIds);
        if (!selectedTagIds.includes(tagId)) {
          selectedTagIds.push(tagId);
          await prisma.articleTag.create({
            data: {
              articleId: article.id,
              tagId: tagId,
            },
          });
        }
      }
    }

    // Beğeniler oluştur
    console.log('❤️ Beğeniler oluşturuluyor...');
    for (const article of articles) {
      const numLikes = getRandomNumber(5, Math.min(article.likes, 150));
      const likedUsers = [];
      
      for (let i = 0; i < numLikes; i++) {
        const user = getRandomItem(users);
        if (!likedUsers.includes(user.id)) {
          likedUsers.push(user.id);
          await prisma.like.create({
            data: {
              userId: user.id,
              articleId: article.id,
              createdAt: getRandomDate(article.publishedAt, new Date()),
            },
          });
        }
      }
    }

    // Bookmark\'lar oluştur
    console.log('🔖 Bookmark\'lar oluşturuluyor...');
    for (const article of articles) {
      const numBookmarks = getRandomNumber(2, 50);
      const bookmarkedUsers = [];
      
      for (let i = 0; i < numBookmarks; i++) {
        const user = getRandomItem(users);
        if (!bookmarkedUsers.includes(user.id)) {
          bookmarkedUsers.push(user.id);
          await prisma.bookmark.create({
            data: {
              userId: user.id,
              articleId: article.id,
              createdAt: getRandomDate(article.publishedAt, new Date()),
            },
          });
        }
      }
    }

    // Yorumlar oluştur
    console.log('💬 Yorumlar oluşturuluyor...');
    const commentTexts = [
      'Çok bilgilendirici bir makale. Teşekkürler.',
      'Savunma sanayiimizde gerçekten büyük ilerlemeler var.',
      'Bu gelişmeler ülkemiz için çok önemli.',
      'Milli teknoloji projeleri takdire şayan.',
      'Yerli ve milli imkanlarla üretim harika.',
      'Detaylı analiz için teşekkürler.',
      'Bu konuda daha fazla bilgi alabilir miyiz?',
      'Türk mühendislerinin başarısı gururlandırıcı.',
      'İnovasyona dayalı bu projeler umut verici.',
      'Savunma teknolojilerinde özgüven artıyor.',
    ];

    for (const article of articles) {
      const numComments = getRandomNumber(2, 15);
      
      for (let i = 0; i < numComments; i++) {
        const user = getRandomItem(users);
        await prisma.comment.create({
          data: {
            content: getRandomItem(commentTexts),
            status: Math.random() > 0.1 ? 'APPROVED' : 'PENDING', // %90 onaylı
            userId: user.id,
            articleId: article.id,
            createdAt: getRandomDate(article.publishedAt, new Date()),
          },
        });
      }
    }

    console.log('✅ Mock data başarıyla oluşturuldu!');
    console.log('📊 Oluşturulan veriler:');
    console.log(`   👥 ${users.length} kullanıcı`);
    console.log(`   📰 ${articles.length} makale`);
    console.log('   🏷️ Makale-etiket ilişkileri');
    console.log('   ❤️ Beğeniler');
    console.log('   🔖 Bookmark\'lar');
    console.log('   💬 Yorumlar');

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });