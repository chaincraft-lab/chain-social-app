import { categoryService } from '@/services'

const state = () => ({
  categories: [],
  popularCategories: [],
  parentCategories: [],
  loading: {
    categories: false,
    popular: false,
    parent: false
  },
  error: null
})

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_POPULAR_CATEGORIES(state, categories) {
    state.popularCategories = categories
  },
  SET_PARENT_CATEGORIES(state, categories) {
    state.parentCategories = categories
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
  async fetchCategories({ commit }) {
    commit('SET_LOADING', { type: 'categories', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await categoryService.getActiveCategories()
      const categories = response.data?.data || response.data || response
      commit('SET_CATEGORIES', categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'categories', status: false })
    }
  },

  async fetchPopularCategories({ commit }, limit = 10) {
    commit('SET_LOADING', { type: 'popular', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await categoryService.getPopularCategories(limit)
      const categories = response.data?.data || response.data || response
      commit('SET_POPULAR_CATEGORIES', categories)
    } catch (error) {
      console.error('Error fetching popular categories:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'popular', status: false })
    }
  },

  async fetchParentCategories({ commit }) {
    commit('SET_LOADING', { type: 'parent', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await categoryService.getParentCategories()
      const categories = response.data?.data || response.data || response
      commit('SET_PARENT_CATEGORIES', categories)
    } catch (error) {
      console.error('Error fetching parent categories:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'parent', status: false })
    }
  },

  async fetchCategoryBySlug({ commit }, slug) {
    commit('CLEAR_ERROR')
    try {
      const response = await categoryService.getCategoryBySlug(slug)
      const category = response.data || response
      return category
    } catch (error) {
      console.error('Error fetching category:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      throw error
    }
  },

  async searchCategories({ commit }, query) {
    commit('CLEAR_ERROR')
    try {
      const response = await categoryService.searchCategories(query)
      const categories = response.data?.data || response.data || response
      return categories
    } catch (error) {
      console.error('Error searching categories:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return []
    }
  }
}

const getters = {
  getCategories: (state) => state.categories || [],
  getPopularCategories: (state) => state.popularCategories || [],
  getParentCategories: (state) => state.parentCategories || [],
  getCategoryBySlug: (state) => (slug) => {
    if (!Array.isArray(state.categories)) return null
    return state.categories.find(category => category && category.slug === slug)
  },
  getCategoryById: (state) => (id) => {
    if (!Array.isArray(state.categories)) return null
    return state.categories.find(category => category && category.id === id)
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