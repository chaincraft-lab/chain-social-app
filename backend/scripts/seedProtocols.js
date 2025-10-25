const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Protocol-specific categories for Arbitrum ecosystem
const categoriesData = [
  {
    name: 'DeFi',
    slug: 'defi',
    description: 'Merkezi olmayan finans protokolleri ve uygulamaları. Lending, DEX, yield farming.',
    color: '#10B981',
    icon: 'material-symbols:account-balance',
    isActive: true
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'Blockchain oyunları, NFT oyunları ve GameFi projeleri.',
    color: '#8B5CF6',
    icon: 'material-symbols:sports-esports',
    isActive: true
  },
  {
    name: 'NFT',
    slug: 'nft',
    description: 'Non-Fungible Token projeleri, marketplace\'ler ve koleksiyonlar.',
    color: '#F59E0B',
    icon: 'material-symbols:image',
    isActive: true
  },
  {
    name: 'Infrastructure',
    slug: 'infrastructure',
    description: 'Altyapı projeleri, bridge\'ler, developer araçları ve node servisleri.',
    color: '#6B7280',
    icon: 'material-symbols:settings',
    isActive: true
  },
  {
    name: 'Grants',
    slug: 'grants',
    description: 'Hibe programları, funding fırsatları ve ekosistem destekleri.',
    color: '#EF4444',
    icon: 'material-symbols:card-giftcard',
    isActive: true
  },
  {
    name: 'Finans',
    slug: 'finans',
    description: 'Geleneksel finans haberleri, piyasa analizleri ve ekonomik gelişmeler.',
    color: '#3B82F6',
    icon: 'material-symbols:trending-up',
    isActive: true
  }
];

const sampleArticles = [
  {
    title: 'Arbitrum Nova Gaming Ekosistemi Büyüyor',
    slug: 'arbitrum-nova-gaming-ekosistemi',
    excerpt: 'Arbitrum Nova\'da oyun projeleri hızla artıyor. NFT ve GameFi alanında yeni gelişmeler.',
    content: 'Arbitrum Nova ağında gaming projeleri momentum kazanıyor. Düşük maliyetli işlemler sayesinde oyun geliştiricileri platforma yöneliyor...',
    status: 'PUBLISHED',
    contentType: 'NEWS',
    isFeatured: true,
    isBreaking: false,
    views: 1250,
    likes: 89,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    authorId: 1
  },
  {
    title: 'Arbitrum DeFi TVL 2 Milyar Doları Aştı',
    slug: 'arbitrum-defi-tvl-rekor',
    excerpt: 'Arbitrum üzerindeki DeFi protokollerinde kilitli değer rekor seviyeye ulaştı.',
    content: 'Arbitrum ekosistemindeki DeFi protokollerinde toplam kilitli değer (TVL) 2 milyar doları geçti...',
    status: 'PUBLISHED',
    contentType: 'ANNOUNCEMENT',
    isFeatured: false,
    isBreaking: true,
    views: 892,
    likes: 67,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    authorId: 1
  },
  {
    title: 'Arbitrum Foundation Yeni Hibe Programı Duyurdu',
    slug: 'arbitrum-hibe-programi',
    excerpt: 'Arbitrum Foundation, ekosistem gelişimi için 50 milyon dolarlık hibe programı başlattı.',
    content: 'Arbitrum Foundation, ekosistemde yenilikçi projeleri desteklemek için kapsamlı bir hibe programı duyurdu...',
    status: 'PUBLISHED',
    contentType: 'UPDATE',
    isFeatured: true,
    isBreaking: false,
    views: 2140,
    likes: 156,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    authorId: 1
  }
];

async function seedCategories() {
  try {
    console.log('🌱 Kategori verileri ekleniyor...');

    // Önce mevcut kategorileri kontrol et
    const existingCategories = await prisma.category.findMany();
    console.log(`📊 Mevcut kategori sayısı: ${existingCategories.length}`);

    // Kategorileri ekle
    for (const categoryData of categoriesData) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      });

      if (existingCategory) {
        console.log(`⚠️  ${categoryData.name} zaten mevcut, güncelleniyor...`);
        await prisma.category.update({
          where: { slug: categoryData.slug },
          data: categoryData
        });
      } else {
        console.log(`✅ ${categoryData.name} ekleniyor...`);
        await prisma.category.create({
          data: categoryData
        });
      }
    }

    console.log('🎉 Kategori verileri başarıyla eklendi!');
    
    // İstatistikler
    const totalCategories = await prisma.category.count();
    
    console.log(`📈 Toplam kategori sayısı: ${totalCategories}`);

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Script çalıştırma
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('✨ Seed işlemi tamamlandı!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed işlemi başarısız:', error);
      process.exit(1);
    });
}

module.exports = { seedCategories };