const { PrismaClient } = require('@prisma/client');

// bcrypt import with fallback
let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch (error) {
  console.warn('⚠️ bcrypt not available, using simple password hashing');
  bcrypt = {
    hash: async (password) => `hashed_${password}`
  };
}

const prisma = new PrismaClient();

// Blockchain odaklı kullanıcı verileri
const usersData = [
  {
    name: 'Ali Blockchain',
    email: 'ozkan@hotmail.com',
    password: 'password123',
    avatar: '/avatars/1.jpg',
    bio: 'Blockchain teknolojileri uzmanı ve DeFi araştırmacısı. 5+ yıllık deneyim.',
    role: 'AUTHOR',
    isActive: true
  },
  {
    name: 'Fatma Crypto',
    email: 'test@hotmail.com',
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

// Blockchain haberleri
const articlesData = [
  {
    title: 'Arbitrum One TVL 2.5 Milyar Doları Aştı: Layer 2 Başarı Hikayesi',
    slug: 'arbitrum-one-tvl-2-5-milyar-dolar',
    excerpt: 'Arbitrum One, toplam kilitlenen değer (TVL) açısından 2.5 milyar doları aşarak Layer 2 çözümleri arasında liderliğini pekiştirdi. Ekosistemde büyük büyüme görülüyor.',
    content: `Arbitrum One, Ethereum'un en popüler Layer 2 çözümlerinden biri olarak konumunu güçlendirmeye devam ediyor. Platform, toplam kilitlenen değer (TVL) açısından 2.5 milyar doları aşarak önemli bir kilometre taşına ulaştı.

Bu başarının arkasında Arbitrum'un düşük gas ücretleri ve Ethereum ile tam uyumluluğu bulunuyor. Özellikle DeFi protokolleri platform üzerinde hızla büyüyor.

**Öne Çıkan Projeler:**
- Uniswap V3 (650M$ TVL)
- Aave V3 (420M$ TVL) 
- Curve Finance (380M$ TVL)
- GMX (290M$ TVL)

Arbitrum Foundation'ın yakın zamanda açıkladığı ARB token teşvikleri de ekosistemin büyümesini hızlandırıyor. Geliştiriciler platformun güvenilirliği ve kullanım kolaylığı nedeniyle Arbitrum'u tercih ediyor.

Layer 2 savaşında Arbitrum'un bu başarısı, Ethereum'un ölçeklenebilirlik sorunlarına çözüm konusunda ne kadar ilerleme kaydedildiğini gösteriyor.`,
    status: 'PUBLISHED',
    contentType: 'NEWS',
    isFeatured: true,
    isBreaking: false,
    views: 2847,
    likes: 156,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
  },
  {
    title: 'Optimism Bedrock Güncellemesi Yayınlandı: %40 Daha Ucuz İşlemler',
    slug: 'optimism-bedrock-guncelleme-ucuz-islemler',
    excerpt: 'Optimism\'in Bedrock güncellemesi ile gas ücretleri %40 oranında düştü. Ethereum ile daha güçlü entegrasyon ve gelişmiş güvenlik özellikleri geldi.',
    content: `Optimism, uzun zamandır beklenen Bedrock güncellemesini başarıyla yayınladı. Bu güncelleme ile birlikte platform hem daha ucuz hem de daha güvenli hale geldi.

**Bedrock'un Getirdiği Yenilikler:**
- %40 daha düşük gas ücretleri
- Ethereum ile gelişmiş uyumluluk
- Artırılmış güvenlik önlemleri
- Daha hızlı finalizasyon süreleri

Güncelleme öncesi ortalama işlem maliyeti 0.15$ iken, şimdi 0.09$ seviyelerine düştü. Bu düşüş özellikle küçük işlemler için büyük bir avantaj sağlıyor.

Optimism ekosisteminde faaliyet gösteren DeFi protokolleri de bu gelişmeden oldukça memnun. Synthetix, Aave, ve Uniswap gibi projeler kullanıcılarına daha ekonomik hizmet sunabiliyor.

**OP Stack Etkisi:**
Bedrock aynı zamanda OP Stack'in temelini oluşturuyor. Base, Zora gibi diğer Layer 2'ler de bu teknolojiden faydalanacak.

Optimism Collective'in "RetroPGF" programı ile geliştiricilere verdiği destekler de ekosistemin büyümesini hızlandırıyor.`,
    status: 'PUBLISHED',
    contentType: 'UPDATE',
    isFeatured: true,
    isBreaking: true,
    views: 1923,
    likes: 89,
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 saat önce
  },
  {
    title: 'Polygon zkEVM Mainnet Beta: Zero-Knowledge Çağı Başlıyor',
    slug: 'polygon-zkevm-mainnet-beta-zero-knowledge',
    excerpt: 'Polygon zkEVM mainnet beta sürümü kullanıma açıldı. Ethereum Virtual Machine ile tam uyumlu zero-knowledge rollup teknolojisi devrim yaratıyor.',
    content: `Polygon Labs, blockchain teknolojisinde çığır açacak zkEVM mainnet beta sürümünü kullanıma açtı. Bu gelişme zero-knowledge teknolojisinin Ethereum ekosistemindeki en önemli adımlarından biri.

**zkEVM'in Avantajları:**
- Ethereum ile %100 uyumluluk
- Zero-knowledge proof teknolojisi
- Yüksek güvenlik standardı
- Düşük işlem maliyetleri

zkEVM, mevcut Ethereum akıllı kontratlarının hiçbir değişiklik yapılmadan çalışabildiği ilk ZK-rollup çözümü. Bu, geliştiriciler için büyük bir kolaylık sağlıyor.

**Teknik Özellikler:**
- İşlem hızı: 2000+ TPS
- Finalizasyon süresi: ~1 dakika
- Gas ücreti: Ethereum'un %90 altında
- Güvenlik: Ethereum seviyesinde

Polygon zkEVM üzerinde Aave, Uniswap V3, Balancer gibi önemli DeFi protokolleri zaten deploy edildi. Kullanıcılar tanıdık arayüzlerde işlem yapabiliyor.

Zero-knowledge teknolojisinin yaygınlaşması ile blockchain trilemması (güvenlik, ölçeklenebilirlik, merkeziyetsizlik) çözülmeye bir adım daha yaklaştı.`,
    status: 'PUBLISHED',
    contentType: 'ANNOUNCEMENT',
    isFeatured: false,
    isBreaking: false,
    views: 1456,
    likes: 67,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 gün önce
  },
  {
    title: 'Avalanche Subnet Devrimi: 200+ Özel Blockchain Ağı Aktif',
    slug: 'avalanche-subnet-devrimi-200-ozel-blockchain',
    excerpt: 'Avalanche ekosisteminde 200\'den fazla Subnet aktif hale geldi. Özel blockchain ağları kurumsal benimsenmeyi hızlandırıyor.',
    content: `Avalanche'nin Subnet teknolojisi blockchain dünyasında yeni bir çığır açıyor. 200'den fazla özel blockchain ağının aktif olması, platformun modüler yapısının ne kadar güçlü olduğunu gösteriyor.

**Subnet Nedir?**
Subnet'ler, Avalanche ana ağına bağlı özel blockchain'ler. Her Subnet kendi consensus mekanizması, token ekonomisi ve kurallarına sahip olabiliyor.

**Aktif Subnet Örnekleri:**
- DeFi Kingdoms (DFK Chain)
- Swimmer Network
- Castle Crush
- Shrapnel Gaming

Özellikle gaming ve kurumsal uygulamalar için Subnet'ler ideal çözüm sunuyor. Yüksek işlem hacmi gerektiren projeler kendi Subnet'lerini kurarak sınırsız ölçeklenebilirlik elde ediyor.

**Kurumsal İlgi:**
JPMorgan, Mastercard gibi büyük kurumlar Avalanche Subnet teknolojisini pilot projelerinde test ediyor. Özel ağ kurma kolaylığı kurumsal benimsenmeyi hızlandırıyor.

AVAX token'ın utility'si de Subnet'lerle artıyor. Her Subnet validatörleri AVAX stake etmek zorunda, bu da token talebini destekliyor.

Avalanche ekosisteminin toplam TVL'si 1.2 milyar doları aşarken, Subnet'lerdeki aktivite de hızla büyüyor.`,
    status: 'PUBLISHED',
    contentType: 'NEWS',
    isFeatured: false,
    isBreaking: false,
    views: 892,
    likes: 34,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gün önce
  },
  {
    title: 'Solana Mobile Saga: Web3 Telefon Satışları Rekoru Kırıyor',
    slug: 'solana-mobile-saga-web3-telefon-rekor',
    excerpt: 'Solana Mobile\'ın Saga telefonu beklenmedik bir başarı elde etti. Web3 entegrasyonu ve airdrop beklentileri satışları artırıyor.',
    content: `Solana Mobile'ın ilk Web3 telefonu Saga, başlangıçta düşük satış rakamlarına rağmen son dönemde beklenmedik bir başarı elde ediyor. Özellikle airdrop beklentileri satışları hızlandırıyor.

**Saga'nın Özellikleri:**
- Phantom wallet entegrasyonu
- Hardware güvenlik modülü
- Solana dApp store
- Native Web3 deneyimi

Telefon sahibi olmak, birçok Solana projesi için airdrop koşulu haline geldi. Bu durum ikinci el piyasada telefonun değerini artırıyor.

**Ekonomik Etki:**
- Başlangıç fiyatı: $1,000
- İkinci el fiyat: $2,500+
- Airdrop değeri: $5,000+

Özellikle JUP, WEN, BONK gibi token'ların airdrop'ları Saga sahipleri için büyük kazanç sağladı. Bu durum Web3 telefonuna olan ilgiyi artırdı.

**Gelecek Planları:**
Solana Labs, Saga'nın başarısından cesaret alarak yeni modeller üzerinde çalışıyor. Daha uygun fiyatlı versiyonlar da gündemde.

Saga'nın başarısı, Web3 cihazlarının geleceği için önemli bir gösterge. Diğer blockchain projeleri de benzer cihazlar geliştirmeyi planlıyor.`,
    status: 'PUBLISHED',
    contentType: 'NEWS',
    isFeatured: false,
    isBreaking: false,
    views: 1834,
    likes: 112,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
  },
  {
    title: 'Chainlink CCIP Mainnet\'e Çıktı: Çoklu Blockchain Köprüsü',
    slug: 'chainlink-ccip-mainnet-multi-blockchain-kopru',
    excerpt: 'Chainlink\'in Cross-Chain Interoperability Protocol (CCIP) mainnet\'e çıktı. Farklı blockchain\'ler arası güvenli veri ve token transferi mümkün.',
    content: `Chainlink, blockchain interoperability alanında devrim niteliğinde Cross-Chain Interoperability Protocol (CCIP) mainnet lansmanını gerçekleştirdi.

**CCIP\'nin Çözdüğü Sorunlar:**
- Blockchain'ler arası iletişim
- Güvenli token transferleri
- Cross-chain veri aktarımı
- Smart contract çağrıları

İlk aşamada Ethereum, Polygon, Avalanche, BNB Chain ve Arbitrum destekleniyor. Gelecekte 100+ blockchain entegrasyonu planlanıyor.

**Güvenlik Özellikleri:**
- Risk yönetim ağı
- Çoklu validasyon katmanı
- Anomali tespiti
- Hız limitleri

CCIP, bugüne kadar yaşanan cross-chain hack'lerden ders çıkararak güvenliği öncelemek üzere tasarlandı. $14 milyarlık Total Value Secured ile başlıyor.

**Kullanım Alanları:**
- DeFi protokol entegrasyonları
- NFT cross-chain transferleri
- Gaming ekosistemi bağlantıları
- Kurumsal çözümler

AAVE, Synthetix, Compound gibi major DeFi protokolleri CCIP entegrasyonlarını duyurdu. Bu protokoller artık çoklu blockchain'de faaliyet gösterebilecek.

LINK token'ın utility'si de CCIP ile genişliyor. Tüm cross-chain işlemlerde LINK fee olarak kullanılıyor.`,
    status: 'PUBLISHED',
    contentType: 'ANNOUNCEMENT',
    isFeatured: true,
    isBreaking: false,
    views: 1267,
    likes: 78,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 gün önce
  },
  {
    title: 'Uniswap V4 Hooks Sistemi: DEX Gelişiminde Yeni Dönem',
    slug: 'uniswap-v4-hooks-sistemi-dex-gelisim',
    excerpt: 'Uniswap V4\'ün hooks sistemi DEX\'lerde yenilik çağını başlatıyor. Özelleştirilebilir likidite havuzları ve gelişmiş özellikler geliyor.',
    content: `Uniswap V4, hooks sistemi ile merkezi olmayan borsa (DEX) teknolojisinde yeni bir çağ başlatıyor. Bu yenilik, likidite havuzlarını tamamen özelleştirilebilir hale getiriyor.

**Hooks Sistemi Nedir?**
Hooks, likidite havuzlarına özel mantık ekleyen smart contract'lar. Swap öncesi/sonrası, likidite ekleme/çıkarma gibi işlemlerde devreye giriyor.

**Mümkün Olan Yenilikler:**
- Dynamic fee ayarlamaları
- MEV koruması
- On-chain limit orderları
- Automated rebalancing
- Custom oracle entegrasyonları

**Gas Optimizasyonu:**
V4, "singleton" mimarisi ile gas kullanımını %99 azaltıyor. Tüm havuzlar tek bir contract'ta yönetiliyor.

**Geliştirici Ekosistemi:**
Hooks sistemi ile geliştiriciler unique DEX deneyimleri yaratabilecek. Özel AMM stratejileri, yield farming mekanizmaları ve arbitraj korumaları mümkün.

**Piyasa Etkisi:**
Uniswap V4'ün lansmanı 2024 Q2'de planlanıyor. UNI token sahipleri governance sürecine katılarak yeni özellikleri onaylayacak.

Bu gelişme DEX savaşında Uniswap'ın liderliğini pekiştirmeyi hedefliyor. Rakip DEX'ler de benzer yenilikleri takip etmeye başlıyor.`,
    status: 'PUBLISHED',
    contentType: 'UPDATE',
    isFeatured: false,
    isBreaking: false,
    views: 743,
    likes: 45,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 gün önce
  },
  {
    title: 'Aave V3 Multi-Chain Ekspansyonu: 10 Blockchain\'de Aktif',
    slug: 'aave-v3-multi-chain-ekspansiyon-10-blockchain',
    excerpt: 'Aave V3 protokolü 10 farklı blockchain\'de aktif hale geldi. Cross-chain borç verme deneyimi DeFi\'da yeni standart oluşturuyor.',
    content: `Aave V3, DeFi\'nin en büyük borç verme protokolü olarak multi-chain ekspansyonunu tamamladı. 10 farklı blockchain\'de toplam 8.5 milyar dolar TVL\'ye ulaştı.

**Aktif Blockchain\'ler:**
- Ethereum (4.2B$ TVL)
- Polygon (1.8B$ TVL)
- Avalanche (1.1B$ TVL)
- Arbitrum (850M$ TVL)
- Optimism (340M$ TVL)
- Fantom (120M$ TVL)
- Harmony (95M$ TVL)

**V3\'ün Yenilikleri:**
- Portal özelliği (cross-chain borçlanma)
- Efficiency Mode (correlated asset)
- Isolation Mode (risk yönetimi)
- High Efficiency Mode

Portal özelliği ile kullanıcılar bir blockchain\'de teminat verip başka blockchain\'de borç alabiliyor. Bu DeFi\'da ilk kez görülen bir yenilik.

**Risk Yönetimi:**
Aave V3, gelişmiş risk parametreleri ile her blockchain\'in özelliklerine göre optimize ediliyor. Isolation mode ile yeni asset\'ler güvenli şekilde entegre ediliyor.

**AAVE Token Utility:**
- Governance (köprü parametreleri)
- Safety Module staking
- Fee discount
- Borrowing power bonus

GHO stablecoin\'in multi-chain lansmanı da yaklaşıyor. Aave ekosistemine native stablecoin eklenecek.

Compound, Euler gibi rakipler de multi-chain stratejilerini hızlandırıyor.`,
    status: 'PUBLISHED',
    contentType: 'NEWS',
    isFeatured: false,
    isBreaking: false,
    views: 654,
    likes: 29,
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 gün önce
  },
  {
    title: 'PancakeSwap V3 Concentrated Liquidity: BSC\'de Uniswap Modeli',
    slug: 'pancakeswap-v3-concentrated-liquidity-bsc',
    excerpt: 'PancakeSwap V3 concentrated liquidity özelliği ile BSC\'de capital efficiency devrimini başlatıyor. LP\'ler daha yüksek getiri elde edebilecek.',
    content: `PancakeSwap, BNB Smart Chain\'in en büyük DEX\'i olarak V3 güncellemesini kullanıma açtı. Concentrated liquidity ile capital efficiency %4000\'e kadar artırılabiliyor.

**V3\'ün Ana Özellikleri:**
- Concentrated liquidity (fiyat aralığı belirleme)
- Multiple fee tiers (%0.01, %0.05, %0.25, %1)
- Advanced LP pozisyonları (NFT)
- Gelişmiş farming stratejileri

**Capital Efficiency:**
Uniswap V3 modelini takip eden PancakeSwap V3 ile LP\'ler likiditeyi belirli fiyat aralıklarında yoğunlaştırabiliyor. Bu sayede aynı sermaye ile daha yüksek fee geliri elde ediliyor.

**CAKE Token Utility:**
- Enhanced farming rewards
- V3 LP position boosts
- Governance voting power
- IFO (Initial Farm Offering) katılımı

**BSC Ekosistemi Etkisi:**
PancakeSwap V3\'ün lansmanı BSC\'deki diğer protokolleri de yeni özellikler geliştirmeye zorluyor. Venus, Alpaca Finance gibi projeler entegrasyon çalışmaları yapıyor.

**Performans Metrikleri:**
- Günlük işlem hacmi: 850M$
- Aktif LP sayısı: 45,000+
- Desteklenen token: 500+

V3 ile birlikte PancakeSwap, Ethereum dışındaki en sofistike DEX unvanını hedefliyor. Uniswap\'a rakip olmayı başarabilir mi göreceğiz.`,
    status: 'PUBLISHED',
    contentType: 'UPDATE',
    isFeatured: false,
    isBreaking: false,
    views: 521,
    likes: 18,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 gün önce
  },
  {
    title: 'Compound III (Comet) Risk Yönetimi: DeFi\'da Yeni Güvenlik Standardı',
    slug: 'compound-iii-comet-risk-yonetimi-defi-guvenlik',
    excerpt: 'Compound III\'ün Comet protokolü DeFi risk yönetiminde yeni standartlar belirliyor. Isolated markets ve dynamic risk parametreleri getiriyor.',
    content: `Compound Labs, DeFi borç verme protokollerinde güvenlik konusunda yeni bir sayfa açan Compound III (Comet) protokolünü tanıttı.

**Comet\'in İnovatif Özellikleri:**
- Isolated markets (izole piyasalar)
- Single borrowable asset per market
- Dynamic risk adjustments
- Liquidation optimizasyonu

**Risk İzolasyonu:**
Her Comet market\'i bağımsız çalışıyor. Bir market\'te yaşanan sorun diğerlerini etkilemiyor. Bu, Terra Luna çöküşü gibi sistemik riskleri önlüyor.

**USDC Odaklı Strateji:**
İlk Comet market\'leri USDC borrowing odaklı. ETH, WBTC, LINK, UNI collateral olarak kullanılabiliyor. Bu yaklaşım riski minimize ediyor.

**Gelişmiş Liquidation:**
Comet, liquidation sürecini optimize ederek underwater pozisyonları daha hızlı kapatıyor. MEV botu entegrasyonu ile efficient liquidations sağlanıyor.

**COMP Token Yenilikleri:**
- Comet markets governance
- Liquidation fee sharing
- Risk parameter voting
- Reward distribution

**DeFi Güvenlik Standartları:**
Compound III\'ün yaklaşımı, MakerDAO, Aave gibi diğer protokolleri de benzer güvenlik önlemleri almaya teşvik ediyor.

İlk 6 ayda 2.8 milyar dolar TVL hedefleniyor. Institutional DeFi kullanımını artırması bekleniyor.`,
    status: 'PUBLISHED',
    contentType: 'ANNOUNCEMENT',
    isFeatured: false,
    isBreaking: false,
    views: 398,
    likes: 22,
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 gün önce
  }
];

async function seedBlockchainMockData() {
  try {
    console.log('🚀 Blockchain mock data seeding başlıyor...');

    // Kullanıcıları ekle
    console.log('👥 Kullanıcılar ekleniyor...');
    
    for (const userData of usersData) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  ${userData.name} zaten mevcut, atlanıyor...`);
        continue;
      }

      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      console.log(`✅ ${userData.name} kullanıcısı ekleniyor...`);
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      });
    }

    // Protokollerin mevcut olduğunu kontrol et
    const protocols = await prisma.category.findMany({
      where: { isActive: true }
    });

    if (protocols.length === 0) {
      console.log('⚠️  Protokol bulunamadı. Önce protokolleri ekleyin.');
      return;
    }

    // İlk kullanıcıyı al (yazar olarak kullanacağız)
    const firstUser = await prisma.user.findFirst({
      where: { role: { in: ['AUTHOR', 'EDITOR', 'ADMIN'] } }
    });

    if (!firstUser) {
      console.log('⚠️  Yazar kullanıcı bulunamadı.');
      return;
    }

    // Makaleleri ekle
    console.log('📰 Blockchain haberleri ekleniyor...');
    
    for (const articleData of articlesData) {
      const existingArticle = await prisma.article.findUnique({
        where: { slug: articleData.slug }
      });

      if (existingArticle) {
        console.log(`⚠️  "${articleData.title}" zaten mevcut, atlanıyor...`);
        continue;
      }

      // Protokol kategori ID'sini bul
      let categoryId = protocols[0].id; // Default olarak ilk protokol
      
      // Slug'a göre uygun protokolü bul
      if (articleData.slug.includes('arbitrum')) {
        const arbitrum = protocols.find(p => p.slug === 'arbitrum');
        if (arbitrum) categoryId = arbitrum.id;
      } else if (articleData.slug.includes('optimism')) {
        const optimism = protocols.find(p => p.slug === 'optimism');
        if (optimism) categoryId = optimism.id;
      } else if (articleData.slug.includes('polygon')) {
        const polygon = protocols.find(p => p.slug === 'polygon');
        if (polygon) categoryId = polygon.id;
      } else if (articleData.slug.includes('avalanche')) {
        const avalanche = protocols.find(p => p.slug === 'avalanche');
        if (avalanche) categoryId = avalanche.id;
      } else if (articleData.slug.includes('solana')) {
        const solana = protocols.find(p => p.slug === 'solana');
        if (solana) categoryId = solana.id;
      } else if (articleData.slug.includes('chainlink')) {
        const chainlink = protocols.find(p => p.slug === 'chainlink');
        if (chainlink) categoryId = chainlink.id;
      } else if (articleData.slug.includes('uniswap')) {
        const uniswap = protocols.find(p => p.slug === 'uniswap');
        if (uniswap) categoryId = uniswap.id;
      } else if (articleData.slug.includes('aave')) {
        const aave = protocols.find(p => p.slug === 'aave');
        if (aave) categoryId = aave.id;
      } else if (articleData.slug.includes('compound')) {
        const compound = protocols.find(p => p.slug === 'compound');
        if (compound) categoryId = compound.id;
      } else if (articleData.slug.includes('pancakeswap')) {
        const pancakeswap = protocols.find(p => p.slug === 'pancakeswap');
        if (pancakeswap) categoryId = pancakeswap.id;
      }

      console.log(`✅ "${articleData.title}" makalesi ekleniyor...`);
      await prisma.article.create({
        data: {
          ...articleData,
          authorId: firstUser.id,
          categoryId: categoryId
        }
      });
    }

    console.log('🎉 Blockchain mock data başarıyla eklendi!');
    
    // İstatistikler
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.article.count()
    ]);
    
    console.log(`📊 İstatistikler:`);
    console.log(`   👥 Kullanıcı sayısı: ${stats[0]}`);
    console.log(`   🏗️  Protokol sayısı: ${stats[1]}`);
    console.log(`   📰 Haber sayısı: ${stats[2]}`);

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Script çalıştırma
if (require.main === module) {
  seedBlockchainMockData()
    .then(() => {
      console.log('✨ Blockchain mock data seed işlemi tamamlandı!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed işlemi başarısız:', error);
      process.exit(1);
    });
}

module.exports = { seedBlockchainMockData };