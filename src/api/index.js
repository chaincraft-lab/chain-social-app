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
  { id: 1, name: 'Kara', slug: 'kara' },
  { id: 2, name: 'Hava', slug: 'hava' },
  { id: 3, name: 'Deniz', slug: 'deniz' },
  { id: 4, name: 'Uzay', slug: 'uzay' },
  { id: 5, name: 'Siber', slug: 'siber' },
  { id: 6, name: 'Uluslararası', slug: 'uluslararasi' },
  { id: 7, name: 'Teknoloji', slug: 'teknoloji' },
  { id: 8, name: 'Projeler', slug: 'projeler' },
  { id: 9, name: 'Analiz', slug: 'analiz' },
  { id: 10, name: 'Etkinlikler', slug: 'etkinlikler' }
]

const news = [
  {
    id: 1,
    title: 'Türkiye\'nin Yeni Milli Muharip Uçağı KAAN İlk Uçuşunu Gerçekleştirdi',
    excerpt: 'Türk Havacılık ve Uzay Sanayii (TUSAŞ) tarafından geliştirilen Milli Muharip Uçak (MMU) KAAN, ilk uçuşunu başarıyla tamamladı.',
    content: 'Türk Havacılık ve Uzay Sanayii (TUSAŞ) tarafından geliştirilen Milli Muharip Uçak (MMU) KAAN, ilk uçuşunu başarıyla tamamladı. Savunma Sanayii Başkanlığı\'nın liderliğinde geliştirilen 5. nesil savaş uçağı, Ankara\'daki TUSAŞ tesislerinde düzenlenen törenle gökyüzüyle buluştu. Cumhurbaşkanı Recep Tayyip Erdoğan\'ın da katıldığı törende, KAAN\'ın ilk uçuşu büyük bir başarıyla gerçekleştirildi. Uçak, 20 dakikalık test uçuşunda tüm sistemlerini başarıyla test etti. KAAN\'ın 2028 yılında Türk Hava Kuvvetleri\'ne teslim edilmesi planlanıyor.',
    image: 'https://picsum.photos/id/1/800/450',
    date: '2023-06-15T10:30:00',
    category: { id: 2, name: 'Hava', slug: 'hava' },
    author: { id: 1, name: 'Ahmet Yılmaz' },
    tags: ['mmu', 'kaan', 'tusaş', 'savaş uçağı']
  },
  {
    id: 2,
    title: 'ASELSAN\'dan Yeni Elektronik Harp Sistemi',
    excerpt: 'ASELSAN, yeni geliştirdiği elektronik harp sistemini tanıttı. Sistem, modern savaş ortamında elektronik karıştırma ve aldatma kabiliyetleriyle öne çıkıyor.',
    content: 'ASELSAN, yeni geliştirdiği elektronik harp sistemini tanıttı. Sistem, modern savaş ortamında elektronik karıştırma ve aldatma kabiliyetleriyle öne çıkıyor. ASELSAN Yönetim Kurulu Başkanı ve Genel Müdürü Prof. Dr. Haluk Görgün, sistemin tamamen yerli ve milli imkanlarla geliştirildiğini vurguladı. Yeni elektronik harp sistemi, hava, kara ve deniz platformlarına entegre edilebilecek şekilde tasarlandı. Sistem, düşman radarlarını tespit etme, sınıflandırma ve karıştırma yeteneklerine sahip. Ayrıca, gelişmiş yapay zeka algoritmaları sayesinde otonom olarak tehdit değerlendirmesi yapabiliyor.',
    image: 'https://picsum.photos/id/20/800/450',
    date: '2023-06-14T22:15:00',
    category: { id: 5, name: 'Siber', slug: 'siber' },
    author: { id: 2, name: 'Mehmet Demir' },
    tags: ['aselsan', 'elektronik harp', 'savunma']
  },
  {
    id: 3,
    title: 'TCG Anadolu Deniz Kuvvetleri\'ne Teslim Edildi',
    excerpt: 'Türkiye\'nin ilk uçak gemisi TCG Anadolu, düzenlenen törenle Deniz Kuvvetleri Komutanlığı\'na teslim edildi.',
    content: 'Türkiye\'nin ilk uçak gemisi TCG Anadolu, düzenlenen törenle Deniz Kuvvetleri Komutanlığı\'na teslim edildi. Sedef Tersanesi\'nde inşa edilen gemi, 225 metre uzunluğu ve 32 metre genişliğiyle Türk donanmasının en büyük gemisi unvanını taşıyor. TCG Anadolu, hem helikopter hem de insansız hava araçları için pist ve hangar imkanları sunuyor. Gemide ayrıca amfibi harekât kabiliyeti de bulunuyor. TCG Anadolu, Türk savunma sanayiinin geldiği noktayı göstermesi açısından büyük önem taşıyor.',
    image: 'https://picsum.photos/id/30/800/450',
    date: '2023-06-14T09:45:00',
    category: { id: 3, name: 'Deniz', slug: 'deniz' },
    author: { id: 3, name: 'Zeynep Kaya' },
    tags: ['tcg anadolu', 'deniz kuvvetleri', 'uçak gemisi']
  },
  {
    id: 4,
    title: 'ROKETSAN\'dan Yeni Hipersonik Füze Projesi',
    excerpt: 'ROKETSAN, hipersonik füze teknolojileri üzerinde çalıştığını duyurdu. Proje, Türkiye\'nin stratejik caydırıcılık kabiliyetlerini artıracak.',
    content: 'ROKETSAN, hipersonik füze teknolojileri üzerinde çalıştığını duyurdu. Proje, Türkiye\'nin stratejik caydırıcılık kabiliyetlerini artıracak. ROKETSAN Genel Müdürü Murat İkinci, projenin detaylarını paylaştı. Hipersonik füzeler, ses hızının 5 katından daha hızlı hareket edebilen ve bu sayede mevcut hava savunma sistemleri tarafından engellenmeleri çok zor olan silah sistemleri olarak biliniyor. Türkiye\'nin bu alandaki çalışmaları, savunma sanayiinde teknolojik bağımsızlık hedefine ulaşma yolunda önemli bir adım olarak değerlendiriliyor.',
    image: 'https://picsum.photos/id/40/800/450',
    date: '2023-06-13T14:20:00',
    category: { id: 7, name: 'Teknoloji', slug: 'teknoloji' },
    author: { id: 4, name: 'Ayşe Yıldız' },
    tags: ['roketsan', 'hipersonik', 'füze']
  },
  {
    id: 5,
    title: 'Türk Silahlı Kuvvetleri\'ne Yeni Zırhlı Araçlar Teslim Edildi',
    excerpt: 'FNSS tarafından üretilen yeni nesil zırhlı muharebe araçları, düzenlenen törenle Türk Silahlı Kuvvetleri\'ne teslim edildi.',
    content: 'FNSS tarafından üretilen yeni nesil zırhlı muharebe araçları, düzenlenen törenle Türk Silahlı Kuvvetleri\'ne teslim edildi. Milli Savunma Bakanı\'nın katılımıyla gerçekleşen törende, PARS 4x4 ve KAPLAN-10 araçlarının teslimatı yapıldı. Araçlar, yüksek koruma seviyesi, üstün hareket kabiliyeti ve modern silah sistemleriyle dikkat çekiyor. FNSS Genel Müdürü Nail Kurt, araçların tamamen yerli ve milli imkanlarla üretildiğini vurguladı. Yeni zırhlı araçlar, Türk Silahlı Kuvvetleri\'nin muharebe gücünü önemli ölçüde artıracak.',
    image: 'https://picsum.photos/id/50/800/450',
    date: '2023-06-13T11:30:00',
    category: { id: 1, name: 'Kara', slug: 'kara' },
    author: { id: 5, name: 'Ali Özkan' },
    tags: ['zırhlı araç', 'fnss', 'tsk']
  },
  {
    id: 6,
    title: 'TÜBİTAK UZAY\'dan Yeni Uydu Projesi',
    excerpt: 'TÜBİTAK UZAY, yeni yerli gözlem uydusu projesini duyurdu. Uydu, Türkiye\'nin uzay alanındaki kabiliyetlerini artıracak.',
    content: 'TÜBİTAK UZAY, yeni yerli gözlem uydusu projesini duyurdu. Uydu, Türkiye\'nin uzay alanındaki kabiliyetlerini artıracak. TÜBİTAK UZAY Enstitüsü Müdürü, projenin detaylarını paylaştı. Yeni uydu, yüksek çözünürlüklü görüntüleme kabiliyetine sahip olacak ve tamamen yerli imkanlarla üretilecek. Uydu, savunma, güvenlik, afet yönetimi, şehir planlama ve tarım gibi alanlarda kullanılacak. Projenin 2025 yılında tamamlanması ve uydunun uzaya fırlatılması planlanıyor.',
    image: 'https://picsum.photos/id/60/800/450',
    date: '2023-06-12T16:45:00',
    category: { id: 4, name: 'Uzay', slug: 'uzay' },
    author: { id: 6, name: 'Fatma Şahin' },
    tags: ['tubitak', 'uydu', 'uzay']
  },
  {
    id: 7,
    title: 'IDEF 2023 Savunma Fuarı Başladı',
    excerpt: 'Uluslararası Savunma Sanayii Fuarı IDEF 2023, İstanbul\'da kapılarını açtı. Fuara 70 ülkeden 1200\'den fazla firma katılıyor.',
    content: 'Uluslararası Savunma Sanayii Fuarı IDEF 2023, İstanbul\'da kapılarını açtı. Fuara 70 ülkeden 1200\'den fazla firma katılıyor. Cumhurbaşkanı Recep Tayyip Erdoğan\'ın katılımıyla açılan fuarda, Türk savunma sanayii şirketleri en yeni ürün ve teknolojilerini sergileme fırsatı buluyor. IDEF 2023\'te ASELSAN, TUSAŞ, ROKETSAN, HAVELSAN gibi Türk savunma sanayiinin önde gelen şirketlerinin yanı sıra dünya devi savunma şirketleri de yer alıyor. Fuar kapsamında çeşitli ikili görüşmeler ve işbirliği anlaşmaları da imzalanması bekleniyor.',
    image: 'https://picsum.photos/id/70/800/450',
    date: '2023-06-12T10:15:00',
    category: { id: 10, name: 'Etkinlikler', slug: 'etkinlikler' },
    author: { id: 7, name: 'Can Yılmaz' },
    tags: ['idef', 'fuar', 'savunma sanayii']
  },
  {
    id: 8,
    title: 'Savunma Sanayii Başkanlığı\'ndan Yeni İhale Duyurusu',
    excerpt: 'Savunma Sanayii Başkanlığı, yeni insansız deniz aracı projesi için ihale duyurusu yaptı. İhaleye yerli ve milli firmalar katılabilecek.',
    content: 'Savunma Sanayii Başkanlığı, yeni insansız deniz aracı projesi için ihale duyurusu yaptı. İhaleye yerli ve milli firmalar katılabilecek. Savunma Sanayii Başkanı İsmail Demir, projenin önemine dikkat çekerek, "İnsansız deniz araçları, deniz kuvvetlerimizin geleceğinde önemli bir rol oynayacak. Bu projeyle deniz savunma kabiliyetlerimizi daha da güçlendireceğiz" dedi. İhale kapsamında geliştirilecek insansız deniz araçları, keşif, gözetleme, istihbarat toplama ve denizaltı savunma harbi gibi görevlerde kullanılacak.',
    image: 'https://picsum.photos/id/80/800/450',
    date: '2023-06-11T15:30:00',
    category: { id: 8, name: 'Projeler', slug: 'projeler' },
    author: { id: 8, name: 'Deniz Aydın' },
    tags: ['ssb', 'ihale', 'insansız deniz aracı']
  },
  {
    id: 9,
    title: 'NATO\'dan Türk Savunma Sanayiine Övgü',
    excerpt: 'NATO Genel Sekreteri, Türk savunma sanayiinin son yıllardaki gelişimini övdü ve Türkiye\'nin ittifaka katkılarını vurguladı.',
    content: 'NATO Genel Sekreteri, Türk savunma sanayiinin son yıllardaki gelişimini övdü ve Türkiye\'nin ittifaka katkılarını vurguladı. NATO Genel Sekreteri, Brüksel\'de düzenlenen basın toplantısında, "Türkiye\'nin savunma sanayiindeki atılımları ve özgün sistemler geliştirme konusundaki başarısı takdire şayan. Türkiye, NATO\'nun güney kanadının güvenliğinde kilit bir rol oynuyor" ifadelerini kullandı. Türkiye\'nin özellikle insansız hava araçları, elektronik harp sistemleri ve deniz platformları alanındaki başarıları, uluslararası alanda da dikkat çekiyor.',
    image: 'https://picsum.photos/id/90/800/450',
    date: '2023-06-11T22:00:00',
    category: { id: 6, name: 'Uluslararası', slug: 'uluslararasi' },
    author: { id: 9, name: 'Burak Yılmaz' },
    tags: ['nato', 'uluslararası', 'savunma']
  },
  {
    id: 10,
    title: 'Savunma Sanayiinde Yapay Zeka Dönemi',
    excerpt: 'Türk savunma sanayii şirketleri, yapay zeka teknolojilerine yatırım yapıyor. Yapay zeka, savunma sistemlerinin etkinliğini artıracak.',
    content: 'Türk savunma sanayii şirketleri, yapay zeka teknolojilerine yatırım yapıyor. Yapay zeka, savunma sistemlerinin etkinliğini artıracak. HAVELSAN Genel Müdürü, yapay zeka teknolojilerinin savunma sanayiindeki önemine dikkat çekti. Yapay zeka, özellikle otonom sistemler, hedef tanıma, tehdit değerlendirme ve karar destek sistemlerinde kullanılıyor. Türkiye\'nin yapay zeka stratejisi kapsamında savunma sanayii alanında yapılan çalışmalar, teknolojik bağımsızlık hedefine ulaşmada önemli bir rol oynuyor.',
    image: 'https://picsum.photos/id/100/800/450',
    date: '2023-06-10T13:45:00',
    category: { id: 5, name: 'Siber', slug: 'siber' },
    author: { id: 10, name: 'Ece Yılmaz' },
    tags: ['yapay zeka', 'savunma', 'teknoloji']
  }
]

const advertisements = [
  {
    id: 1,
    title: 'ASELSAN',
    image: 'https://picsum.photos/id/201/300/250',
    url: 'https://www.aselsan.com.tr'
  },
  {
    id: 2,
    title: 'TUSAŞ',
    image: 'https://picsum.photos/id/202/300/250',
    url: 'https://www.tusas.com'
  },
  {
    id: 3,
    title: 'ROKETSAN',
    image: 'https://picsum.photos/id/203/300/600',
    url: 'https://www.roketsan.com.tr'
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