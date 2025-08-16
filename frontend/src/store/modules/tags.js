import { tagService } from '@/services'

const state = () => ({
  tags: [],
  popularTags: [],
  trendingTags: [],
  loading: {
    tags: false,
    popular: false,
    trending: false
  },
  error: null
})

const mutations = {
  SET_TAGS(state, tags) {
    state.tags = tags
  },
  SET_POPULAR_TAGS(state, tags) {
    state.popularTags = tags
  },
  SET_TRENDING_TAGS(state, tags) {
    state.trendingTags = tags
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
  async fetchTags({ commit }, filters = {}) {
    commit('SET_LOADING', { type: 'tags', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await tagService.getTags(filters)
      const tags = response.data?.data || response.data || response
      commit('SET_TAGS', tags)
    } catch (error) {
      console.error('Error fetching tags:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'tags', status: false })
    }
  },

  async fetchPopularTags({ commit }, limit = 20) {
    commit('SET_LOADING', { type: 'popular', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await tagService.getPopularTags(limit)
      const tags = response.data?.data || response.data || response
      commit('SET_POPULAR_TAGS', tags)
    } catch (error) {
      console.error('Error fetching popular tags:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'popular', status: false })
    }
  },

  async fetchTrendingTags({ commit }, limit = 10) {
    commit('SET_LOADING', { type: 'trending', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await tagService.getTrendingTags(limit)
      const tags = response.data?.data || response.data || response
      commit('SET_TRENDING_TAGS', tags)
    } catch (error) {
      console.error('Error fetching trending tags:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'trending', status: false })
    }
  },

  async fetchTagBySlug({ commit }, slug) {
    commit('CLEAR_ERROR')
    try {
      const response = await tagService.getTagBySlug(slug)
      const tag = response.data || response
      return tag
    } catch (error) {
      console.error('Error fetching tag:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      throw error
    }
  },

  async searchTags({ commit }, query) {
    commit('CLEAR_ERROR')
    try {
      const response = await tagService.searchTags(query)
      const tags = response.data?.data || response.data || response
      return tags
    } catch (error) {
      console.error('Error searching tags:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return []
    }
  }
}

const getters = {
  getTags: (state) => state.tags || [],
  getPopularTags: (state) => state.popularTags || [],
  getTrendingTags: (state) => state.trendingTags || [],
  getTagBySlug: (state) => (slug) => {
    if (!Array.isArray(state.tags)) return null
    return state.tags.find(tag => tag && tag.slug === slug)
  },
  getTagById: (state) => (id) => {
    if (!Array.isArray(state.tags)) return null
    return state.tags.find(tag => tag && tag.id === id)
  },
  isLoading: (state) => (type) => state.loading[type],
  hasError: (state) => !!state.error,
  getError: (state) => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}