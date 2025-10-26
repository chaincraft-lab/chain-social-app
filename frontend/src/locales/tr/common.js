export default {
  actions: {
    save: 'Kaydet',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',
    create: 'Oluştur',
    update: 'Güncelle',
    close: 'Kapat',
    submit: 'Gönder',
    loading: 'Yükleniyor...',
    loadMore: 'Daha Fazla Yükle'
  },
  sorting: {
    newest: 'En Yeni',
    oldest: 'En Eski',
    titleAZ: 'Başlık (A-Z)',
    popular: 'En Popüler'
  },
  messages: {
    success: 'İşlem başarılı',
    error: 'Bir hata oluştu',
    noData: 'Veri bulunamadı',
    backToHome: 'Ana Sayfaya Dön'
  },
  shareOn: '{platform}\'de paylaş',
  news: 'Haber',
  popular: 'Popüler',
  popularNews: 'Popüler Haber',
  readNews: 'Haberi Oku',
  widgets: {
    cryptoMarket: {
      title: 'Crypto Piyasası',
      loading: 'Piyasa verileri alınıyor...',
      error: 'Piyasa verileri alınamadı',
      emptyState: 'Piyasa verileri yükleniyor...'
    },
    market: {
      title: 'Piyasalar & Döviz',
      loading: 'ECB kurları alınıyor...',
      majorCurrencies: 'Ana Para Birimleri',
      marketIndicators: 'Piyasa Göstergeleri',
      gold: 'Altın (Ons)',
      silver: 'Gümüş (Ons)',
      oil: 'Petrol/TRY',
      dollarIndex: 'Dolar Endeksi',
      volatility: 'Volatilite',
      riskScore: 'Risk Skoru',
      lastUpdate: 'Son güncelleme',
      refresh: 'Yenile',
      currencies: {
        usd: 'Amerikan Doları',
        eur: 'Euro',
        gbp: 'İngiliz Sterlini',
        jpy: 'Japon Yeni'
      },
      risk: {
        low: 'DÜŞÜK',
        medium: 'ORTA',
        high: 'YÜKSEK'
      },
      errors: {
        fetchFailed: 'Döviz kurları alınamadı',
        invalidFormat: 'API yanıtı beklenen formatta değil',
        general: 'Bir hata oluştu'
      }
    }
  },
  time: {
    now: 'Az önce',
    today: 'Bugün',
    yesterday: 'Dün',
    daysAgo: '{count} gün önce',
    hoursAgo: '{count} saat önce',
    minutesAgo: '{count} dakika önce'
  },
  ui: {
    categories: 'Kategoriler',
    categoriesLoading: 'Kategoriler yükleniyor...',
    searchCategory: 'Kategori ara...',
    allCategories: 'Tüm Kategoriler',
    refresh: 'Yenile',
    tryAgain: 'Yeniden Dene',
    search: 'Arama',
    searchResults: 'Arama Sonuçları',
    searchPlaceholder: 'Haber ara...',
    searchDescription: 'Aramak istediğiniz kelimeyi yukarı giriniz.',
    searchLoading: 'Arama sonuçları yükleniyor...',
    searchError: 'Arama Hatası',
    searchErrorMessage: 'Arama sırasında hata oluştu',
    allSearchResults: 'Tüm arama sonuçları görüntülediniz',
    article: 'Makale',
    articleContent: 'Makale içeriği',
    articleContentLoading: 'Makale içeriği yükleniyor...',
    relatedNews: 'İlgili Haberler',
    newArticles: 'Daha fazla makale yükle',
    endOfPage: 'Sayfa sonuna 200px yaklaştığında yeni veri yükle',
    upload: 'Yükleniyor...',
    uploadPhoto: 'Fotoğrafı Kaydet',
    uploadingPhoto: 'Yükleniyor...',
    newPassword: 'Yeni Şifre',
    newPasswordPlaceholder: 'Yeni şifrenizi girin',
    newPasswordRepeat: 'Yeni Şifre Tekrar',
    newPasswordRepeatPlaceholder: 'Yeni şifrenizi tekrar girin',
    popularNews: 'Popüler Haberler',
    latestNews: 'Son Haberler',
    allArticlesLoaded: 'Tüm makaleler yüklendi',
    newsCount: '{count} haber',
    newest: 'En Yeni',
    oldest: 'En Eski',
    sortBy: 'Kategori',
    sortByCategory: 'Kategoriye Göre',
    filterBy: 'Kategori',
    resultsFound: '{count} haber bulundu'
  },
  states: {
    noArticles: 'Henüz makale yok',
    noArticlesInTag: 'Bu etiketle henüz makale bulunmuyor.',
    allTagNews: 'Bu etiketteki tüm haberleri görüntülediniz',
    noTagNews: 'Henüz haber yok',
    noTagNewsMessage: 'Bu etikette henüz haber bulunmuyor',
    noLikedNews: 'Henüz beğendiğiniz haber yok',
    noLikedNewsDescription: 'Haberları beğenmeye başlayın, burada görüntüleyin.',
    exploreNews: 'Haberleri Keşfet',
    removeLikeConfirm: 'Bu haberi beğenmeyi kaldırmak istediğinizden emin misiniz?',
    noBookmarks: 'Henüz kaydettiğiniz haber yok',
    noBookmarksDescription: 'Haberları kaydetmeye başlayın, daha sonra burada bulabilirsiniz.',
    removeBookmarkConfirm: 'Bu haberi kayıtlarınızdan kaldırmak istediğinizden emin misiniz?',
    removeSelectedBookmarks: 'Seçili {count} haberi kayıtlarınızdan kaldırmak istediğinizden emin misiniz?',
    noSubCategories: 'Alt kategori bulunmuyor',
    noCategories: 'Henüz kategori bulunmuyor',
    noPopularNews: 'Henüz popüler haber bulunmuyor',
    noFeaturedStories: 'Öne çıkan haber bulunamadı'
  },
  likes: {
    liked: 'Makale beğenildi!',
    unliked: 'Beğeni kaldırıldı!'
  },
  bookmarks: {
    saved: 'Makale kaydedildi!',
    removed: 'Kayıt kaldırıldı!'
  },
  profile: {
    likesDescription: 'Haberleri beğenmeye ve kaydetmeye başlayın',
    newsletterDescription: 'Yeni haberler ve güncellemeler için e-posta alın',
    newsletter: 'Haber Bülteni',
    newsletterWeekly: 'Haftalık özet ve özel içerikler alın',
    bio: 'Teknoloji ve savunma sanayi ile ilgili haberleri takip ediyorum.',
    location: 'Ankara, Türkiye',
    accountDeletion: 'Beğendiğiniz ve kaydettiğiniz haberler kaybolacak',
    reregistration: 'Bu e-posta adresiyle yeniden kayıt olmanız gerekecek',
    pageRefresh: 'Sayfayı yenile - backend\'den user-specific data gelecek'
  },
  languages: {
    turkish: 'Türkçe',
    english: 'English'
  },
  comments: {
    turkishDefenseCompanies: 'Türkiye\'nin başlıca savunma sanayi şirketleri',
    loadMoreArticles: 'Daha fazla makale yükle',
    pageScroll: 'Sayfa sonuna 200px yaklaştığında yeni veri yükle',
    articleDetails: 'Gerçek API çağrısı - makale detayını çek',
    relatedArticles: 'İlgili makaleleri çek',
    getTagArticles: 'Sonra o tag\'e ait haberleri çek',
    responseFormat: 'Yeni response formatını handle et ve search results\'ları news format\'ına çevir'
  }
}