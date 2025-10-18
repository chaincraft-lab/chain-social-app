const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const protocolsData = [
  {
    name: 'Arbitrum',
    slug: 'arbitrum',
    description: 'Ethereum üzerinde çalışan Layer 2 çözümü. Hızlı ve düşük maliyetli işlemler sunar.',
    color: '#28A0F0',
    icon: 'cryptocurrency:arb',
    website: 'https://arbitrum.io',
    tokenSymbol: 'ARB',
    blockchain: 'Ethereum',
    isActive: true
  },
  {
    name: 'Optimism',
    slug: 'optimism',
    description: 'Ethereum için optimistik rollup teknolojisi kullanan Layer 2 çözümü.',
    color: '#FF0420',
    icon: 'cryptocurrency:op',
    website: 'https://optimism.io',
    tokenSymbol: 'OP',
    blockchain: 'Ethereum',
    isActive: true
  },
  {
    name: 'Polygon',
    slug: 'polygon',
    description: 'Ethereum uyumlu blockchain ağı ve framework. Hızlı ve ölçeklenebilir dApps için.',
    color: '#8247E5',
    icon: 'cryptocurrency:matic',
    website: 'https://polygon.technology',
    tokenSymbol: 'MATIC',
    blockchain: 'Ethereum',
    isActive: true
  },
  {
    name: 'Avalanche',
    slug: 'avalanche',
    description: 'Yüksek performanslı, ölçeklenebilir ve interoperable blockchain platformu.',
    color: '#E84142',
    icon: 'cryptocurrency:avax',
    website: 'https://avax.network',
    tokenSymbol: 'AVAX',
    blockchain: 'Avalanche',
    isActive: true
  },
  {
    name: 'Solana',
    slug: 'solana',
    description: 'Yüksek hızlı, düşük maliyetli blockchain. Web3 uygulamaları için optimize edilmiş.',
    color: '#9945FF',
    icon: 'cryptocurrency:sol',
    website: 'https://solana.com',
    tokenSymbol: 'SOL',
    blockchain: 'Solana',
    isActive: true
  },
  {
    name: 'Chainlink',
    slug: 'chainlink',
    description: 'Merkezi olmayan oracle ağı. Gerçek dünya verilerini blockchain\'e bağlar.',
    color: '#375BD2',
    icon: 'cryptocurrency:link',
    website: 'https://chain.link',
    tokenSymbol: 'LINK',
    blockchain: 'Ethereum',
    isActive: true
  },
  {
    name: 'Uniswap',
    slug: 'uniswap',
    description: 'Merkezi olmayan kripto para birimi borsası. Otomatik market yapıcı (AMM) protokolü.',
    color: '#FF007A',
    icon: 'cryptocurrency:uni',
    website: 'https://uniswap.org',
    tokenSymbol: 'UNI',
    blockchain: 'Ethereum',
    isActive: true
  },
  {
    name: 'Aave',
    slug: 'aave',
    description: 'Merkezi olmayan borç verme ve borç alma protokolü. DeFi\'nin öncülerinden.',
    color: '#B6509E',
    icon: 'cryptocurrency:aave',
    website: 'https://aave.com',
    tokenSymbol: 'AAVE',
    blockchain: 'Ethereum',
    isActive: true
  },
  {
    name: 'Compound',
    slug: 'compound',
    description: 'Algoritmik para piyasası protokolü. Kripto varlıkların borç verilmesi ve alınması.',
    color: '#00D395',
    icon: 'cryptocurrency:comp',
    website: 'https://compound.finance',
    tokenSymbol: 'COMP',
    blockchain: 'Ethereum',
    isActive: true
  },
  {
    name: 'PancakeSwap',
    slug: 'pancakeswap',
    description: 'BNB Smart Chain üzerinde çalışan merkezi olmayan borsa ve yield farming platformu.',
    color: '#D1884F',
    icon: 'cryptocurrency:cake',
    website: 'https://pancakeswap.finance',
    tokenSymbol: 'CAKE',
    blockchain: 'BNB Chain',
    isActive: true
  }
];

const sampleArticles = [
  {
    title: 'Arbitrum Yeni Güncelleme ile Gas Ücretlerini %30 Düşürüyor',
    slug: 'arbitrum-gas-ucretleri-dusuruyor',
    excerpt: 'Arbitrum\'un son güncellemesi ile işlem maliyetleri önemli ölçüde azalacak. Kullanıcılar daha ucuz işlem yapabilecek.',
    content: 'Arbitrum ekibi, platformun son güncellemesiyle gas ücretlerinde %30\'a varan düşüş sağlayacağını duyurdu...',
    status: 'PUBLISHED',
    contentType: 'NEWS',
    isFeatured: true,
    isBreaking: false,
    views: 1250,
    likes: 89,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gün önce
    authorId: 1
  },
  {
    title: 'Optimism Superchain Vizyonunu Açıkladı',
    slug: 'optimism-superchain-vizyonu',
    excerpt: 'Optimism, birbirine bağlı L2 ağları için Superchain vizyonunu paylaştı. Ekosistem genişliyor.',
    content: 'Optimism Foundation, Superchain adını verdikleri yeni vizyonlarını açıkladı...',
    status: 'PUBLISHED',
    contentType: 'ANNOUNCEMENT',
    isFeatured: false,
    isBreaking: true,
    views: 892,
    likes: 67,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 gün önce
    authorId: 1
  },
  {
    title: 'Polygon zkEVM Mainnet Beta Başlatıldı',
    slug: 'polygon-zkevm-mainnet-beta',
    excerpt: 'Polygon zkEVM mainnet beta sürümü kullanıma açıldı. Zero-knowledge teknolojisiyle Ethereum uyumluluğu.',
    content: 'Polygon Labs, uzun zamandır beklenen zkEVM mainnet beta sürümünü kullanıma açtı...',
    status: 'PUBLISHED',
    contentType: 'UPDATE',
    isFeatured: true,
    isBreaking: false,
    views: 2140,
    likes: 156,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
    authorId: 1
  }
];

async function seedProtocols() {
  try {
    console.log('🌱 Protocol verileri ekleniyor...');

    // Önce mevcut kategorileri kontrol et
    const existingCategories = await prisma.category.findMany();
    console.log(`📊 Mevcut kategori sayısı: ${existingCategories.length}`);

    // Protokolleri ekle
    for (const protocolData of protocolsData) {
      const existingProtocol = await prisma.category.findUnique({
        where: { slug: protocolData.slug }
      });

      if (existingProtocol) {
        console.log(`⚠️  ${protocolData.name} zaten mevcut, güncelleniyor...`);
        await prisma.category.update({
          where: { slug: protocolData.slug },
          data: protocolData
        });
      } else {
        console.log(`✅ ${protocolData.name} ekleniyor...`);
        await prisma.category.create({
          data: protocolData
        });
      }
    }

    console.log('ℹ️  Makale ekleme atlandı - bu demo için sadece protokoller eklendi.');

    console.log('🎉 Protocol verileri başarıyla eklendi!');
    
    // İstatistikler
    const totalCategories = await prisma.category.count();
    
    console.log(`📈 Toplam protokol sayısı: ${totalCategories}`);

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Script çalıştırma
if (require.main === module) {
  seedProtocols()
    .then(() => {
      console.log('✨ Seed işlemi tamamlandı!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed işlemi başarısız:', error);
      process.exit(1);
    });
}

module.exports = { seedProtocols };