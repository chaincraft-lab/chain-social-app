import { articleService } from '@/services'

const state = () => ({
  latestNews: [],
  popularNews: [],
  featuredNews: [],
  categoryNews: {},
  tagNews: {},
  loading: {
    latest: false,
    popular: false,
    featured: false,
    category: false,
    detail: false,
    related: false,
    search: false,
    breaking: false,
    tag: false
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
  SET_TAG_NEWS(state, { tagSlug, news }) {
    state.tagNews = { ...state.tagNews, [tagSlug]: news }
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
      const response = await articleService.getLatestArticles(limit)
      // Backend response'unu handle et
      const articles = response.data?.data || response.data || response
      commit('SET_LATEST_NEWS', articles)
    } catch (error) {
      console.error('Error fetching latest news:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'latest', status: false })
    }
  },

  async fetchPopularNews({ commit }, limit = 5) {
    commit('SET_LOADING', { type: 'popular', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.getPopularArticles(limit)
      // Backend response'unu handle et
      const articles = response.data?.data || response.data || response
      commit('SET_POPULAR_NEWS', articles)
    } catch (error) {
      console.error('Error fetching popular news:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'popular', status: false })
    }
  },

  async fetchFeaturedNews({ commit }, limit = 3) {
    commit('SET_LOADING', { type: 'featured', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.getFeaturedArticles(limit)
      // Backend response'unu handle et
      const articles = response.data?.data || response.data || response
      commit('SET_FEATURED_NEWS', articles)
    } catch (error) {
      console.error('Error fetching featured news:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'featured', status: false })
    }
  },

  async fetchCategoryNews({ commit }, { categorySlug, limit = 12 }) {
    commit('SET_LOADING', { type: 'category', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.getArticlesByCategory(categorySlug, { limit })
      // Backend response'unu handle et
      const articles = response.data?.data || response.data || response
      commit('SET_CATEGORY_NEWS', { categorySlug, news: articles })
    } catch (error) {
      console.error('Error fetching category news:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'category', status: false })
    }
  },

  // Yeni action'lar ekleyelim
  async fetchBreakingNews({ commit }, limit = 3) {
    commit('SET_LOADING', { type: 'breaking', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.getBreakingArticles(limit)
      const articles = response.data?.data || response.data || response
      commit('SET_FEATURED_NEWS', articles) // Breaking news için aynı state kullanabiliriz
    } catch (error) {
      console.error('Error fetching breaking news:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'breaking', status: false })
    }
  },

  async searchNews({ commit }, { query, filters = {} }) {
    commit('SET_LOADING', { type: 'search', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.searchArticles(query, filters)
      const articles = response.data?.data || response.data || response
      return articles
    } catch (error) {
      console.error('Error searching news:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return []
    } finally {
      commit('SET_LOADING', { type: 'search', status: false })
    }
  },

  async fetchFilteredNews({ commit }, filters = {}) {
    commit('SET_LOADING', { type: 'latest', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.getFilteredArticles(filters)
      const articles = response.data?.data || response.data || response
      commit('SET_LATEST_NEWS', articles)
      return articles
    } catch (error) {
      console.error('Error fetching filtered news:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return []
    } finally {
      commit('SET_LOADING', { type: 'latest', status: false })
    }
  },

  async fetchArticleBySlug({ commit }, slug) {
    commit('SET_LOADING', { type: 'detail', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.getArticleBySlug(slug)
      const article = response.data || response
      return article
    } catch (error) {
      console.error('Error fetching article:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      throw error
    } finally {
      commit('SET_LOADING', { type: 'detail', status: false })
    }
  },

  async fetchRelatedArticles({ commit }, articleId) {
    commit('SET_LOADING', { type: 'related', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.getRelatedArticles(articleId)
      const articles = response.data || response
      return articles
    } catch (error) {
      console.error('Error fetching related articles:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return []
    } finally {
      commit('SET_LOADING', { type: 'related', status: false })
    }
  },

  async fetchTagNews({ commit }, { tagSlug, limit = 50 }) {
    commit('SET_LOADING', { type: 'tag', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await articleService.getArticlesByTag(tagSlug, { limit })
      // Backend response'unu handle et
      const articles = response.data?.data || response.data || response
      commit('SET_TAG_NEWS', { tagSlug, news: articles })
    } catch (error) {
      console.error('Error fetching tag news:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'tag', status: false })
    }
  }
}

const getters = {
  getLatestNews: (state) => state.latestNews || [],
  getPopularNews: (state) => state.popularNews || [],
  getFeaturedNews: (state) => state.featuredNews || [],
  getCategoryNews: (state) => (categorySlug) => state.categoryNews[categorySlug] || [],
  getTagNews: (state) => (tagSlug) => state.tagNews[tagSlug] || [],
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