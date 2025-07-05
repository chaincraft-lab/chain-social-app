import axios from 'axios'

// API base URL - bu gerçek bir API ile değiştirilecek
const API_URL = 'https://api.example.com'

// Axios instance
// Not: Şu anda mock veriler kullanıyoruz, gerçek API'ye geçildiğinde bu kullanılacak
// eslint-disable-next-line no-unused-vars
const apiClientReal = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
})

// Mock API Services
// Mock data
const categories = [
  { id: 1, name: 'Gündem', slug: 'gundem' },
  { id: 2, name: 'Ekonomi', slug: 'ekonomi' },
  { id: 3, name: 'Spor', slug: 'spor' },
  { id: 4, name: 'Teknoloji', slug: 'teknoloji' },
  { id: 5, name: 'Sağlık', slug: 'saglik' },
  { id: 6, name: 'Eğitim', slug: 'egitim' },
  { id: 7, name: 'Dünya', slug: 'dunya' },
  { id: 8, name: 'Yaşam', slug: 'yasam' }
]

const news = [
  {
    id: 1,
    title: 'Türkiye\'nin Yeni Ekonomi Paketi Açıklandı',
    excerpt: 'Hazine ve Maliye Bakanı tarafından açıklanan yeni ekonomi paketi, enflasyonla mücadele ve ekonomik büyümeyi desteklemek için önemli adımlar içeriyor.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/1/800/450',
    date: '2023-06-15T10:30:00',
    category: { id: 2, name: 'Ekonomi', slug: 'ekonomi' },
    author: { id: 1, name: 'Ahmet Yılmaz' },
    tags: ['ekonomi', 'enflasyon', 'paket']
  },
  {
    id: 2,
    title: 'Milli Takım Avrupa Şampiyonası\'nda Çeyrek Finale Yükseldi',
    excerpt: 'Türkiye Milli Futbol Takımı, Avrupa Şampiyonası\'nda güçlü rakibini 2-1 mağlup ederek çeyrek finale yükselmeyi başardı.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/20/800/450',
    date: '2023-06-14T22:15:00',
    category: { id: 3, name: 'Spor', slug: 'spor' },
    author: { id: 2, name: 'Mehmet Demir' },
    tags: ['futbol', 'milli takım', 'euro 2024']
  },
  {
    id: 3,
    title: 'Yapay Zeka Teknolojisinde Çığır Açan Gelişme',
    excerpt: 'Bilim insanları, yapay zeka teknolojisinde devrim yaratacak yeni bir algoritma geliştirdi. Bu gelişme, birçok sektörde önemli değişimlere yol açabilir.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/30/800/450',
    date: '2023-06-14T09:45:00',
    category: { id: 4, name: 'Teknoloji', slug: 'teknoloji' },
    author: { id: 3, name: 'Zeynep Kaya' },
    tags: ['yapay zeka', 'teknoloji', 'bilim']
  },
  {
    id: 4,
    title: 'Sağlık Bakanlığı\'ndan Yeni Aşı Kampanyası',
    excerpt: 'Sağlık Bakanlığı, halk sağlığını korumak amacıyla yeni bir aşı kampanyası başlattı. Kampanya kapsamında risk grubundaki vatandaşlara ücretsiz aşı imkanı sunulacak.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/40/800/450',
    date: '2023-06-13T14:20:00',
    category: { id: 5, name: 'Sağlık', slug: 'saglik' },
    author: { id: 4, name: 'Ayşe Yıldız' },
    tags: ['sağlık', 'aşı', 'kampanya']
  },
  {
    id: 5,
    title: 'Eğitimde Dijital Dönüşüm Projesi Hayata Geçiyor',
    excerpt: 'Milli Eğitim Bakanlığı, eğitimde dijital dönüşüm projesini hayata geçiriyor. Proje kapsamında tüm okullara yüksek hızlı internet ve dijital eğitim materyalleri sağlanacak.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/50/800/450',
    date: '2023-06-13T11:30:00',
    category: { id: 6, name: 'Eğitim', slug: 'egitim' },
    author: { id: 5, name: 'Ali Özkan' },
    tags: ['eğitim', 'dijital', 'teknoloji']
  },
  {
    id: 6,
    title: 'Dünya Liderlerinden İklim Değişikliği Zirvesi',
    excerpt: 'Dünya liderleri, iklim değişikliğiyle mücadele için bir araya geldi. Zirvede, karbon emisyonlarını azaltmak için yeni hedefler belirlendi.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/60/800/450',
    date: '2023-06-12T16:45:00',
    category: { id: 7, name: 'Dünya', slug: 'dunya' },
    author: { id: 6, name: 'Fatma Şahin' },
    tags: ['iklim değişikliği', 'çevre', 'zirve']
  },
  {
    id: 7,
    title: 'Yeni Kültür Sanat Merkezi Açılıyor',
    excerpt: 'Şehrin merkezinde yer alan yeni kültür sanat merkezi, önümüzdeki hafta kapılarını sanatseverlere açıyor. Merkez, çeşitli sergi ve etkinliklere ev sahipliği yapacak.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/70/800/450',
    date: '2023-06-12T10:15:00',
    category: { id: 8, name: 'Yaşam', slug: 'yasam' },
    author: { id: 7, name: 'Can Yılmaz' },
    tags: ['kültür', 'sanat', 'etkinlik']
  },
  {
    id: 8,
    title: 'Merkez Bankası Faiz Kararını Açıkladı',
    excerpt: 'Merkez Bankası, beklentiler doğrultusunda faiz oranlarında değişikliğe gitmedi. Ekonomistler, kararın piyasalara etkisini değerlendiriyor.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/80/800/450',
    date: '2023-06-11T15:30:00',
    category: { id: 2, name: 'Ekonomi', slug: 'ekonomi' },
    author: { id: 8, name: 'Deniz Aydın' },
    tags: ['ekonomi', 'faiz', 'merkez bankası']
  },
  {
    id: 9,
    title: 'Süper Lig\'de Şampiyon Belli Oldu',
    excerpt: 'Süper Lig\'de sezonun son maçları oynandı ve şampiyon belli oldu. Şampiyon takım, kupasını törenle aldı.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/90/800/450',
    date: '2023-06-11T22:00:00',
    category: { id: 3, name: 'Spor', slug: 'spor' },
    author: { id: 9, name: 'Burak Yılmaz' },
    tags: ['spor', 'futbol', 'şampiyonluk']
  },
  {
    id: 10,
    title: 'Yeni Nesil Akıllı Telefonlar Tanıtıldı',
    excerpt: 'Teknoloji devleri, yeni nesil akıllı telefonlarını tanıttı. Yapay zeka özellikleri ve gelişmiş kamera sistemleriyle dikkat çeken telefonlar, yakında piyasaya sürülecek.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    image: 'https://picsum.photos/id/100/800/450',
    date: '2023-06-10T13:45:00',
    category: { id: 4, name: 'Teknoloji', slug: 'teknoloji' },
    author: { id: 10, name: 'Ece Yılmaz' },
    tags: ['teknoloji', 'akıllı telefon', 'yapay zeka']
  }
]

const advertisements = [
  {
    id: 1,
    title: 'Reklam 1',
    image: 'https://picsum.photos/id/201/300/250',
    url: 'https://example.com/ad1'
  },
  {
    id: 2,
    title: 'Reklam 2',
    image: 'https://picsum.photos/id/202/300/250',
    url: 'https://example.com/ad2'
  },
  {
    id: 3,
    title: 'Reklam 3',
    image: 'https://picsum.photos/id/203/300/600',
    url: 'https://example.com/ad3'
  }
]

// Create a mock API client
// eslint-disable-next-line no-unused-vars
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

// News service
export const newsService = {
  getCategories() {
    return Promise.resolve({ data: categories })
  },
  
  getLatestNews(limit = 10) {
    const sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date))
    return Promise.resolve({ data: sortedNews.slice(0, limit) })
  },
  
  getPopularNews(limit = 5) {
    // For mock purposes, we'll just return random news
    const shuffled = [...news].sort(() => 0.5 - Math.random())
    return Promise.resolve({ data: shuffled.slice(0, limit) })
  },
  
  getFeaturedNews(limit = 3) {
    // For mock purposes, we'll just return the first few news items
    return Promise.resolve({ data: news.slice(0, limit) })
  },
  
  getNewsByCategory(categoryId, limit = 10) {
    const filteredNews = news.filter(item => item.category && item.category.id === categoryId)
    return Promise.resolve({ data: filteredNews.slice(0, limit) })
  },
  
  getNewsById(id) {
    const foundNews = news.find(item => item.id === id)
    return Promise.resolve({ data: foundNews })
  },
  
  searchNews(query) {
    const filteredNews = news.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.excerpt.toLowerCase().includes(query.toLowerCase())
    )
    return Promise.resolve({ data: filteredNews })
  }
}

// Advertisement service
export const advertisementService = {
  // eslint-disable-next-line no-unused-vars
  getAdvertisements(position = 'sidebar') {
    return Promise.resolve({ data: advertisements })
  }
}

export default {
  news: newsService,
  advertisements: advertisementService
} 