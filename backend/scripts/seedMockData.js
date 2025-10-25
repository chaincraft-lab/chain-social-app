const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Blockchain ile ilgili başlıklar
const blockchainNewsHeadlines = [
  'Bitcoin Yeni Rekor Seviyelere Ulaştı',
  'Ethereum 2.0 Stake Edilen Miktar Artıyor',
  'DeFi Protokolleri TVL\'de Büyük Artış Yaşıyor',
  'Layer 2 Çözümleri Ethereum Ağını Rahatlatıyor',
  'NFT Pazarında Yeni Trendler Ortaya Çıkıyor',
  'Merkez Bankası Dijital Para Birimleri Yaygınlaşıyor',
  'Blockchain Teknolojisi Tedarik Zincirini Dönüştürüyor',
  'Web3 Projeleri Venture Capital İlgisini Çekiyor',
  'Kripto Para Düzenlemeleri Netlik Kazanıyor',
  'Metaverse Projeleri Blockchain Altyapısı Kuruyor',
  'Staking Rewards Kripto Yatırımcıları Cezbediyor',
  'Lightning Network Bitcoin Ödemelerini Hızlandırıyor',
  'Polygon zkEVM Mainnet Beta Yayınlandı',
  'Chainlink Oracle Ağı Yeni Entegrasyonlar Kazanıyor',
  'Uniswap V4 Hooks Sistemi Geliştiriliyor',
  'Arbitrum One TVL Milyarlarca Doları Aştı',
  'Solana Mobile Web3 Telefon Başarısı',
  'Avalanche Subnet Teknolojisi Yaygınlaşıyor',
  'Optimism Bedrock Güncellemesi Canlıya Alındı',
  'Aave V3 Multi-Chain Ekspansyonu Devam Ediyor',
  'Compound III Risk Yönetimi Yenilikleri',
  'PancakeSwap V3 BSC\'de Concentrated Liquidity',
  'Cosmos IBC Protokolü Cross-Chain İletişimi Güçlendiriyor',
  'Polkadot Parachain Açık Artırmaları Devam Ediyor',
  'Near Protocol Sharding Teknolojisi İlerliyor',
  'Cardano Smart Contract Ekosistemi Büyüyor',
  'Algorand Pure Proof-of-Stake Konsensüsü',
  'Tezos On-Chain Governance Sistemi',
  'Blockchain Gaming P2E Modeli Popülerleşiyor',
  'Decentralized Identity Çözümleri Gelişiyor',
  'Zero-Knowledge Proof Teknolojisi Yaygınlaşıyor',
  'Cross-Chain Bridge Güvenlik Standartları',
  'DAO Governance Token\'ları Değer Kazanıyor',
];

// Blockchain ile ilgili içerik örnekleri
const blockchainNewsContents = [
  'Blockchain teknolojisi, merkezi olmayan yapısı ve şeffaflığı ile geleneksel finansal sistemleri dönüştürmeye devam ediyor. Smart contract\'lar, güvenilir aracılara olan ihtiyacı ortadan kaldırarak otomatik işlemler sağlıyor.',
  'DeFi protokolleri, geleneksel bankacılık hizmetlerini blockchain üzerinde sunarak finansal erişimi demokratikleştiriyor. Yield farming ve liquidity mining yeni gelir modelleri yaratıyor.',
  'Layer 2 çözümleri, Ethereum\'un ölçeklenebilirlik sorunlarını çözüme kavuşturuyor. Optimistic rollup\'lar ve ZK-rollup\'lar, işlem maliyetlerini dramatik olarak düşürüyor.',
  'NFT\'ler, dijital sanat ve koleksiyonculuk alanında devrim yaratırken, utility NFT\'ler gerçek dünya faydaları sunmaya başlıyor. Gaming ve metaverse entegrasyonları hız kazanıyor.',
  'Staking mekanizmaları, kripto para sahiplerinin pasif gelir elde etmesini sağlarken, ağın güvenliğine katkıda bulunuyor. Liquid staking protokolleri likidite sorununu çözüyor.',
  'Cross-chain bridge\'ler, farklı blockchain ağları arasında asset transferini mümkün kılıyor. Interoperability protokolleri, multi-chain ekosistemin temelini oluşturuyor.',
  'DAO\'lar, merkezi olmayan yönetişim modeliyle topluluk odaklı karar alma süreçlerini hayata geçiriyor. Governance token\'lar, kullanıcılara söz hakkı veriyor.',
  'Zero-knowledge proof teknolojisi, gizlilik korunarak doğrulama işlemlerini gerçekleştiriyor. zk-SNARK\'lar ve zk-STARK\'lar, blockchain\'de gizlilik katmanı sağlıyor.',
  'Web3 altyapısı, kullanıcı merkezli internet deneyimi yaratıyor. Decentralized storage, computing ve identity çözümleri ekosistemi tamamlıyor.',
  'Institutional adoption, kurumsal yatırımcıların kripto paralara olan ilgisini artırıyor. Bitcoin ETF\'ler ve corporate treasury allocations trend oluşturuyor.',
];

// Görsel URL\'leri (Unsplash\'den blockchain/kripto temalı)
const imageUrls = [
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800', // Bitcoin coins
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800', // Ethereum concept
  'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800', // Crypto trading
  'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800', // Digital finance
  'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800', // Blockchain network
  'https://images.unsplash.com/photo-1644088379091-d574269d422f?w=800', // NFT concept
  'https://images.unsplash.com/photo-1638913971332-334f6443c7de?w=800', // DeFi concept
  'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800', // Web3 concept
  'https://images.unsplash.com/photo-1640826925778-4513ba4da049?w=800', // Cryptocurrency
  'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800', // Digital assets
];

// Blockchain odaklı kullanıcı verileri
const usersData = [
  {
    name: 'Test Account',
    email: 'test@blockchainews.com',
    password: 'password123',
    avatar: '/avatars/1.jpg',
    bio: 'Blockchain teknolojileri uzmanı ve DeFi araştırmacısı. 5+ yıllık deneyim.',
    role: 'AUTHOR',
    isActive: true
  },
  {
    name: 'Ali Crypto',
    email: 'ali@blockchainews.com',
    password: 'password123',
    avatar: '/avatars/2.jpg',
    bio: 'Kripto para analisti ve Layer 2 protokolleri üzerine uzman.',
    role: 'AUTHOR',
    isActive: true
  },
  {
    name: 'Mehmet DeFi',
    email: 'mehmet@blockchainews.com',
    password: 'password123',
    avatar: '/avatars/3.jpg',
    bio: 'DeFi protokolleri geliştiricisi ve yield farming stratejisti.',
    role: 'EDITOR',
    isActive: true
  },
  {
    name: 'Ayşe Web3',
    email: 'ayse@blockchainews.com',
    password: 'password123',
    avatar: '/avatars/4.jpg',
    bio: 'Web3 teknolojileri ve NFT uzmanı. Blockchain haberciliği 3+ yıl.',
    role: 'AUTHOR',
    isActive: true
  },
  {
    name: 'Admin Blockchain',
    email: 'admin@blockchainews.com',
    password: 'admin123',
    avatar: '/avatars/5.jpg',
    bio: 'Site yöneticisi ve blockchain ekosistemi editörü.',
    role: 'ADMIN',
    isActive: true
  }
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

    // Özel blockchain kullanıcılarını oluştur
    console.log('👥 Özel blockchain kullanıcıları oluşturuluyor...');
    const users = [];
    
    for (const userData of usersData) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  ${userData.name} zaten mevcut, atlanıyor...`);
        users.push(existingUser);
        continue;
      }

      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      console.log(`✅ ${userData.name} kullanıcısı ekleniyor...`);
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          avatar: userData.avatar,
          bio: userData.bio,
          role: userData.role,
          isActive: userData.isActive,
          createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
          lastLogin: getRandomDate(new Date(2024, 0, 1), new Date()),
        }
      });
      users.push(user);
    }


    // Kategoriler (mevcut ID\'ler: 1-10)
    const categoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // Etiketler (varsayılan - boş çünkü hiç tag yok)
    const tagIds = [];

    // 10 makale oluştur
    console.log('📰 10 makale oluşturuluyor...');
    const articles = [];
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date();

    for (let i = 1; i <= 10; i++) {
      const title = getRandomItem(blockchainNewsHeadlines) + ` - ${i}`;
      const content = getRandomItem(blockchainNewsContents) + ' ' + getRandomItem(blockchainNewsContents);
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
          content: content + '\\n\\n' + getRandomItem(blockchainNewsContents) + '\\n\\n' + getRandomItem(blockchainNewsContents),
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

    // Makale-etiket ilişkileri oluştur (tag'ler yok, atlanıyor)
    if (tagIds.length > 0) {
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
    } else {
      console.log('🏷️ Tag yok, makale-etiket ilişkileri atlanıyor...');
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
      'Blockchain teknolojisinde gerçekten büyük ilerlemeler var.',
      'Bu gelişmeler kripto ekosistemi için çok önemli.',
      'DeFi protokolleri takdire şayan.',
      'Web3 teknolojileri harika bir gelecek vaat ediyor.',
      'Detaylı analiz için teşekkürler.',
      'Bu konuda daha fazla bilgi alabilir miyiz?',
      'Blockchain geliştiricilerinin başarısı gururlandırıcı.',
      'İnovasyona dayalı bu projeler umut verici.',
      'Kripto para teknolojilerinde özgüven artıyor.',
      'Layer 2 çözümleri game changer olacak.',
      'NFT alanındaki gelişmeler çok heyecan verici.',
      'Staking rewards konusunda daha fazla bilgi istiyorum.',
      'DAO governance modeli çok demokratik.',
      'Cross-chain bridge\'ler güvenlik açısından nasıl?',
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
    console.log(`   👥 ${users.length} kullanıcı (5 özel blockchain kullanıcısı)`);
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