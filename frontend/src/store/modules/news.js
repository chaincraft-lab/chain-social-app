import { newsService } from '@/api'

const state = () => ({
  latestNews: [],
  popularNews: [],
  featuredNews: [],
  loading: {
    latest: false,
    popular: false,
    featured: false
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
  }
}

const getters = {
  getLatestNews: (state) => state.latestNews || [],
  getPopularNews: (state) => state.popularNews || [],
  getFeaturedNews: (state) => state.featuredNews || [],
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