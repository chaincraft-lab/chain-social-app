import { newsService } from '@/api'

const state = () => ({
  latestNews: [],
  popularNews: [],
  featuredNews: [],
  categoryNews: {},
  loading: {
    latest: false,
    popular: false,
    featured: false,
    category: false
  },
  error: null
})

const mutations = {
  SET_LATEST_NEWS(state, news) {
    state.latestNews = news
  },
  SET_POPULAR_NEWS(state, news) {
    state.popularNews = news
  },
  SET_FEATURED_NEWS(state, news) {
    state.featuredNews = news
  },
  SET_CATEGORY_NEWS(state, { categorySlug, news }) {
    state.categoryNews = { ...state.categoryNews, [categorySlug]: news }
  },
  SET_LOADING(state, { type, status }) {
    state.loading[type] = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  }
}

const actions = {
  async fetchLatestNews({ commit }, limit = 10) {
    commit('SET_LOADING', { type: 'latest', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await newsService.getLatestNews(limit)
      commit('SET_LATEST_NEWS', response.data)
    } catch (error) {
      console.error('Error fetching latest news:', error)
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', { type: 'latest', status: false })
    }
  },

  async fetchPopularNews({ commit }, limit = 5) {
    commit('SET_LOADING', { type: 'popular', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await newsService.getPopularNews(limit)
      commit('SET_POPULAR_NEWS', response.data)
    } catch (error) {
      console.error('Error fetching popular news:', error)
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', { type: 'popular', status: false })
    }
  },

  async fetchFeaturedNews({ commit }, limit = 3) {
    commit('SET_LOADING', { type: 'featured', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await newsService.getFeaturedNews(limit)
      commit('SET_FEATURED_NEWS', response.data)
    } catch (error) {
      console.error('Error fetching featured news:', error)
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', { type: 'featured', status: false })
    }
  },

  async fetchCategoryNews({ commit, state }, { categorySlug, limit = 12 }) {
    commit('SET_LOADING', { type: 'category', status: true })
    commit('CLEAR_ERROR')
    try {
      // For now, we'll filter from existing latestNews
      // In a real app, this would be an API call
      const allNews = state.latestNews || []
      const categoryNews = allNews.filter(news => 
        news.category && news.category.slug === categorySlug
      ).slice(0, limit)
      
      // If no news found in latestNews, generate mock data
      if (categoryNews.length === 0) {
        const categoryTitles = {
          'kara': ['Tank Modernizasyonu Projesi', 'Yeni Zırhlı Araç Tasarımı', 'Kara Kuvvetleri Tatbikatı'],
          'hava': ['F-35 Projesinde Son Durum', 'Yerli Savaş Uçağı Gelişmeleri', 'Hava Savunma Sistemi'],
          'deniz': ['Milli Denizaltı Projesi', 'Gemi İnşa Sanayii', 'Deniz Kuvvetleri Modernizasyonu'],
          'teknoloji': ['Yapay Zeka Uygulamaları', 'Siber Güvenlik İnovasyonları', 'Drone Teknolojileri'],
          'siber': ['Siber Saldırı Korunması', 'Kripto Güvenlik Sistemleri', 'Bilgi Güvenliği Protokolleri'],
          'uzay': ['Uydu Teknolojisi Gelişmeleri', 'Uzay Programı İlerlemesi', 'Roket Sistemi Testleri']
        }
        
        const baseTitles = categoryTitles[categorySlug] || [`${categorySlug} Haberi`]
        const mockNews = Array(limit).fill().map((_, i) => {
          const titleTemplate = baseTitles[i % baseTitles.length]
          const randomDate = new Date()
          randomDate.setHours(randomDate.getHours() - Math.floor(Math.random() * 168)) // Random time within last week
          
          return {
            id: `category-${categorySlug}-${i + 100}`,
            title: `${titleTemplate} ${i > baseTitles.length - 1 ? Math.floor(i / baseTitles.length) + 1 : ''}`.trim(),
            excerpt: 'Son gelişmeler kapsamında önemli adımlar atılıyor. Detaylı bilgi ve analizler için haberin devamını okuyabilirsiniz.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            image: `https://picsum.photos/id/${i + 150}/400/400`,
            date: randomDate.toISOString(),
            category: {
              id: categorySlug,
              slug: categorySlug,
              name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
            },
            author: {
              name: ['Ahmet Editör', 'Ayşe Yazarı', 'Mehmet Muhabir', 'Fatma Analiz'][i % 4],
              avatar: `https://picsum.photos/id/${i + 300}/40/40`
            },
            readTime: Math.floor(Math.random() * 8) + 3,
            likes: Math.floor(Math.random() * 500) + 50,
            comments: Math.floor(Math.random() * 50) + 5,
            tags: [`${categorySlug}`, 'savunma', 'teknoloji'].slice(0, Math.floor(Math.random() * 3) + 1)
          }
        })
        commit('SET_CATEGORY_NEWS', { categorySlug, news: mockNews })
      } else {
        commit('SET_CATEGORY_NEWS', { categorySlug, news: categoryNews })
      }
    } catch (error) {
      console.error('Error fetching category news:', error)
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', { type: 'category', status: false })
    }
  }
}

const getters = {
  getLatestNews: (state) => state.latestNews || [],
  getPopularNews: (state) => state.popularNews || [],
  getFeaturedNews: (state) => state.featuredNews || [],
  getCategoryNews: (state) => (categorySlug) => state.categoryNews[categorySlug] || [],
  isLoading: (state) => (type) => state.loading[type],
  hasError: (state) => !!state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}