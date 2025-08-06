export const MENU_ITEMS = [
  { 
    title: "Haberler",
    key: "news",
    icon: "mdi-newspaper",
    subtitles: [
      "Gündem", 
      "Uluslararası", 
      "Uzay", 
      "Siber"
    ] 
  },
  { 
    title: "Savunma Kuvvetleri",
    key: "defense-forces",
    icon: "mdi-shield-account",
    hasNestedDropdown: true,
    nestedCategories: [
      {
        title: "Kara",
        key: "land",
        icon: "mdi-tank",
        subtitles: [
          "Tank", 
          "Zırhlı Araçlar", 
          "Topçu Sistemleri", 
          "Füze Sistemleri", 
          "Hafif Silahlar", 
          "Kara Savunma Sistemleri"
        ]
      },
      {
        title: "Deniz",
        key: "naval", 
        icon: "mdi-ship-wheel",
        subtitles: [
          "Fırkateyn", 
          "Denizaltı", 
          "Korvet", 
          "Amfibi Gemiler", 
          "Hücumbot", 
          "Deniz Savunma Sistemleri"
        ]
      },
      {
        title: "Hava",
        key: "air",
        icon: "mdi-airplane", 
        subtitles: [
          "Savaş Uçakları", 
          "Helikopterler", 
          "İHA/SİHA", 
          "Nakliye Uçakları", 
          "Hava Savunma Sistemleri", 
          "Aviyonik Sistemler"
        ]
      }
    ]
  },
  { 
    title: "Teknoloji",
    key: "technology",
    icon: "mdi-cog",
    subtitles: [
      "Yeni Gelişmeler", 
      "Yapay Zeka", 
      "Elektronik Harp", 
      "İncelemeler"
    ] 
  },
  { 
    title: "Projeler",
    key: "projects",
    icon: "mdi-briefcase",
    subtitles: [
      "Milli Projeler", 
      "İhaleler", 
      "Firma Ortaklıkları", 
      "Ar-Ge Çalışmaları"
    ] 
  },
  { 
    title: "Analiz",
    key: "analysis",
    icon: "mdi-chart-line",
    subtitles: [
      "Stratejik Yorum", 
      "Uzman Görüşü", 
      "Röportajlar", 
      "Sektör Analizi"
    ] 
  },
  { 
    title: "Galeri",
    key: "gallery",
    icon: "mdi-image-multiple",
    subtitles: [
      "Fotoğraf", 
      "Video", 
      "3D ve Animasyonlar"
    ] 
  },
  { 
    title: "Savunma Ligleri",
    key: "defense-leagues",
    icon: "mdi-trophy",
    subtitles: [
      "Kara Güvenlik Ligi", 
      "Hava Güvenlik Ligi", 
      "Deniz Güvenlik Ligi", 
      "Siber Güvenlik Ligi",
      "Uzay Güvenlik Ligi"
    ] 
  },
  { 
    title: "Hakkımızda",
    key: "about",
    icon: "mdi-information",
    subtitles: [
      "Ekibimiz", 
      "İletişim", 
      "Reklam"
    ] 
  }
]