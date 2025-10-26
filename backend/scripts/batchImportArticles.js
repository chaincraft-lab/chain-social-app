const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Slug utility functions
function turkishToEnglish(text) {
  const turkishMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I',
    'i': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  return text.replace(/[çÇğĞıIiİöÖşŞüÜ]/g, (match) => turkishMap[match] || match);
}

function generateSlug(text) {
  return turkishToEnglish(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

async function extractArticleData(url) {
  try {
    console.log(`📥 Fetching content from: ${url}`);
    
    // Web sayfasını fetch et
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Başlığı çıkar
    let title = $('h1').first().text().trim() || 
                $('title').text().trim() || 
                $('meta[property="og:title"]').attr('content') || 
                $('meta[name="twitter:title"]').attr('content');

    // İçeriği çıkar - farklı selectors deneyerek
    let content = '';
    
    // Medium, WordPress ve genel blog siteler için selectors
    const contentSelectors = [
      'article .post-content',
      'article .entry-content', 
      '.post-content',
      '.entry-content',
      '.content',
      'article',
      '.blog-post-content',
      '.post-body',
      '[data-testid="storyBody"]', // Medium
      '.js-post-body', // Medium
      'main article',
      '.markdown-body' // GitHub
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0 && element.text().trim().length > 100) {
        content = element.html();
        break;
      }
    }

    // Eğer hala içerik bulunamadıysa paragrafları birleştir
    if (!content || content.length < 100) {
      const paragraphs = $('p').map((i, el) => $(el).html()).get();
      if (paragraphs.length > 0) {
        content = paragraphs.join('\n\n');
      }
    }

    // Özet çıkar
    let excerpt = $('meta[name="description"]').attr('content') || 
                  $('meta[property="og:description"]').attr('content') ||
                  $('meta[name="twitter:description"]').attr('content');

    // Eğer özet yoksa ilk paragraftan al
    if (!excerpt) {
      const firstParagraph = $('p').first().text().trim();
      excerpt = firstParagraph.length > 160 ? 
                firstParagraph.substring(0, 160) + '...' : 
                firstParagraph;
    }

    // Resim URL'i çıkar
    let imageUrl = $('meta[property="og:image"]').attr('content') ||
                   $('meta[name="twitter:image"]').attr('content') ||
                   $('article img').first().attr('src') ||
                   $('img').first().attr('src');

    // Eğer resim relative URL ise absolute yap
    if (imageUrl && !imageUrl.startsWith('http')) {
      const urlObj = new URL(url);
      imageUrl = urlObj.origin + (imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl);
    }

    // Yayın tarihini çıkar
    let publishedAt = $('meta[property="article:published_time"]').attr('content') ||
                      $('time[datetime]').attr('datetime') ||
                      $('[datetime]').attr('datetime');

    if (publishedAt) {
      publishedAt = new Date(publishedAt);
    } else {
      publishedAt = new Date(); // Varsayılan olarak şimdi
    }

    return {
      title: title || 'Başlık Bulunamadı',
      content: content || 'İçerik çıkarılamadı',
      excerpt: excerpt || 'Özet bulunamadı',
      imageUrl: imageUrl || null,
      publishedAt: publishedAt,
      sourceUrl: url
    };

  } catch (error) {
    console.error(`❌ Article extraction error for ${url}:`, error.message);
    return null;
  }
}

async function getRandomCategory() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true }
    });
    
    if (categories.length === 0) {
      throw new Error('No active categories found');
    }
    
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  } catch (error) {
    console.error('❌ Error getting random category:', error.message);
    throw error;
  }
}

async function getSystemUser() {
  try {
    // System user'ı bul veya oluştur
    let systemUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'system@arbitrumsocial.app' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (!systemUser) {
      // Eğer system user yoksa ilk admin'i al
      systemUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });
    }

    if (!systemUser) {
      throw new Error('No admin user found. Please create an admin user first.');
    }

    return systemUser;
  } catch (error) {
    console.error('❌ Error getting system user:', error.message);
    throw error;
  }
}

async function saveArticleToDatabase(articleData) {
  try {
    console.log(`💾 Saving article: ${articleData.title.substring(0, 50)}...`);

    // Random kategori al
    const category = await getRandomCategory();
    console.log(`📂 Selected category: ${category.name}`);

    // System user al (cache için static)
    if (!saveArticleToDatabase.author) {
      saveArticleToDatabase.author = await getSystemUser();
      console.log(`👤 Using author: ${saveArticleToDatabase.author.name}`);
    }

    // Slug oluştur ve benzersiz yap
    let slug = generateSlug(articleData.title);
    
    // Aynı slug varsa sayı ekle
    let counter = 1;
    let originalSlug = slug;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Makaleyi kaydet
    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        slug: slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        image: articleData.imageUrl,
        status: 'PUBLISHED',
        isFeatured: false,
        isBreaking: false,
        publishedAt: articleData.publishedAt,
        authorId: saveArticleToDatabase.author.id,
        categoryId: category.id,
        contentType: 'NEWS'
      },
      include: {
        author: true,
        category: true
      }
    });

    console.log(`✅ Article saved! ID: ${article.id}, Slug: ${article.slug}`);
    return article;

  } catch (error) {
    console.error(`❌ Database save error for "${articleData.title}":`, error.message);
    return null;
  }
}

function readUrlsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const urls = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.startsWith('http'));
    
    return urls;
  } catch (error) {
    console.error('❌ Error reading URLs file:', error.message);
    return [];
  }
}

async function batchImportArticles(urlsFile) {
  try {
    console.log('🚀 Starting batch article import process...');
    
    // URL'leri dosyadan oku
    const urls = readUrlsFromFile(urlsFile);
    console.log(`📄 Found ${urls.length} URLs to process`);
    
    if (urls.length === 0) {
      console.log('❌ No valid URLs found in file');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    // Her URL'i sırayla işle
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`\n📰 Processing ${i + 1}/${urls.length}: ${url}`);
      
      try {
        // 1. Web sayfasından makale verilerini çıkar
        const articleData = await extractArticleData(url);
        
        if (!articleData) {
          console.log(`⚠️  Skipping ${url} - extraction failed`);
          errorCount++;
          continue;
        }
        
        console.log(`  📋 Title: ${articleData.title.substring(0, 80)}...`);
        console.log(`  📝 Content: ${articleData.content.length} chars`);
        console.log(`  🖼️  Image: ${articleData.imageUrl ? 'Found' : 'None'}`);
        
        // 2. Veritabanına kaydet
        const savedArticle = await saveArticleToDatabase(articleData);
        
        if (savedArticle) {
          successCount++;
        } else {
          errorCount++;
        }
        
        // Rate limiting - 2 saniye bekle
        if (i < urls.length - 1) {
          console.log('  ⏳ Waiting 2 seconds...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${url}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n🎉 Batch import completed!');
    console.log(`✅ Successfully imported: ${successCount} articles`);
    console.log(`❌ Failed: ${errorCount} articles`);

  } catch (error) {
    console.error('💥 Batch import failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
async function main() {
  const urlsFile = process.argv[2] || path.join(__dirname, 'article-urls.txt');
  
  if (!fs.existsSync(urlsFile)) {
    
    // List files in scripts directory for debugging
    const scriptsDir = __dirname;
    console.log(`📁 Files in ${scriptsDir}:`);
    try {
      const files = fs.readdirSync(scriptsDir);
      files.forEach(file => console.log(`   - ${file}`));
    } catch (err) {
      console.log(`   Error reading directory: ${err.message}`);
    }
    
    process.exit(1);
  }

  try {
    await batchImportArticles(urlsFile);
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

// Eğer script doğrudan çalıştırılıyorsa main'i çağır
if (require.main === module) {
  main();
}

module.exports = { batchImportArticles, extractArticleData };