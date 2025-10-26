const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Protocol-specific categories for blockchain ecosystem
const categoriesData = [
  {
    name: 'DeFi',
    slug: 'defi',
    description: 'Decentralized finance protocols and applications. Lending, DEX, yield farming.',
    color: '#10B981',
    icon: 'material-symbols:account-balance',
    isActive: true
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'Blockchain games, NFT games and GameFi projects.',
    color: '#8B5CF6',
    icon: 'material-symbols:sports-esports',
    isActive: true
  },
  {
    name: 'NFT',
    slug: 'nft',
    description: 'Non-Fungible Token projects, marketplaces and collections.',
    color: '#F59E0B',
    icon: 'material-symbols:image',
    isActive: true
  },
  {
    name: 'Infrastructure',
    slug: 'infrastructure',
    description: 'Infrastructure projects, bridges, developer tools and node services.',
    color: '#6B7280',
    icon: 'material-symbols:settings',
    isActive: true
  },
  {
    name: 'Grants',
    slug: 'grants',
    description: 'Grant programs, funding opportunities and ecosystem support.',
    color: '#EF4444',
    icon: 'material-symbols:card-giftcard',
    isActive: true
  },
  {
    name: 'Finance',
    slug: 'finance',
    description: 'Traditional finance news, market analysis and economic developments.',
    color: '#3B82F6',
    icon: 'material-symbols:trending-up',
    isActive: true
  }
];

// Sample articles removed - will be imported via batchImportArticles script

async function seedCategories() {
  try {
    console.log('🌱 Adding category data...');

    // First check existing categories
    const existingCategories = await prisma.category.findMany();
    console.log(`📊 Existing category count: ${existingCategories.length}`);

    // Add categories
    for (const categoryData of categoriesData) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      });

      if (existingCategory) {
        console.log(`⚠️  ${categoryData.name} already exists, updating...`);
        await prisma.category.update({
          where: { slug: categoryData.slug },
          data: categoryData
        });
      } else {
        console.log(`✅ Adding ${categoryData.name}...`);
        await prisma.category.create({
          data: categoryData
        });
      }
    }

    console.log('🎉 Category data added successfully!');
    
    // Statistics
    const totalCategories = await prisma.category.count();
    
    console.log(`📈 Total category count: ${totalCategories}`);

  } catch (error) {
    console.error('❌ Error occurred:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Script execution
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('✨ Seed operation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed operation failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCategories };