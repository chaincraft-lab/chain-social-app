const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();


// Blockchain-focused user data with international names
const usersData = [
  {
    name: 'Batuhan Sekerci',
    email: 'batusekerci@gmail.com',
    password: 'password123',
    avatar: '/avatars/1.jpg',
    bio: 'Blockchain technology expert and DeFi researcher with 5+ years experience.',
    role: 'AUTHOR',
    isActive: true
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@arbitrumsocial.app',
    password: 'password123',
    avatar: '/avatars/2.jpg',
    bio: 'Cryptocurrency analyst and Layer 2 protocols specialist.',
    role: 'AUTHOR',
    isActive: true
  },
  {
    name: 'Michael Rodriguez',
    email: 'michael@arbitrumsocial.app',
    password: 'password123',
    avatar: '/avatars/3.jpg',
    bio: 'DeFi protocols developer and yield farming strategist.',
    role: 'EDITOR',
    isActive: true
  },
  {
    name: 'Emma Johnson',
    email: 'emma@arbitrumsocial.app',
    password: 'password123',
    avatar: '/avatars/4.jpg',
    bio: 'Web3 technologies and NFT expert. 3+ years in blockchain journalism.',
    role: 'AUTHOR',
    isActive: true
  },
  {
    name: 'David Kim',
    email: 'admin@blockchainews.com',
    password: 'admin123',
    avatar: '/avatars/5.jpg',
    bio: 'Site administrator and blockchain ecosystem editor.',
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
  console.log('🚀 Creating mock data...');

  try {
    // Clear existing data (optional)
    console.log('📦 Clearing existing data...');
    await prisma.articleTag.deleteMany();
    await prisma.like.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();

    // Create blockchain users
    console.log('👥 Creating blockchain users...');
    const users = [];
    
    for (const userData of usersData) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  ${userData.name} already exists, skipping...`);
        users.push(existingUser);
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      console.log(`✅ Adding user ${userData.name}...`);
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

    console.log('✅ Mock data created successfully!');
    console.log('📊 Created data:');
    console.log(`   👥 ${users.length} users (blockchain specialists)`);
    console.log('   📝 Note: Articles will be imported separately via batchImportArticles script');

  } catch (error) {
    console.error('❌ Error occurred:', error);
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