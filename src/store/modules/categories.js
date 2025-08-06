import { newsService } from '@/api'

const state = () => ({
  categories: [],
  loading: false,
  error: null
})

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  }
}

const actions = {
  async fetchCategories({ commit }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    try {
      const response = await newsService.getCategories()
      commit('SET_CATEGORIES', response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  getCategories: (state) => state.categories || [],
  getCategoryBySlug: (state) => (slug) => {
    if (!Array.isArray(state.categories)) return null
    return state.categories.find(category => category && category.slug === slug)
  },
  isLoading: (state) => state.loading,
  hasError: (state) => !!state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}