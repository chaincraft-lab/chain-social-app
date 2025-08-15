import { createStore } from 'vuex'
import news from './modules/news'
import categories from './modules/categories'
import advertisements from './modules/advertisements'

export default createStore({
  modules: {
    news,
    categories,
    advertisements
  },
  state: {
    isLoading: false,
    globalError: null
  },
  mutations: {
    SET_GLOBAL_LOADING(state, status) {
      state.isLoading = status
    },
    SET_GLOBAL_ERROR(state, error) {
      state.globalError = error
    },
    CLEAR_GLOBAL_ERROR(state) {
      state.globalError = null
    }
  },
  actions: {
    async fetchInitialData({ dispatch, commit }) {
      commit('SET_GLOBAL_LOADING', true)
      commit('CLEAR_GLOBAL_ERROR')
      try {
        await Promise.all([
          dispatch('categories/fetchCategories'),
          dispatch('news/fetchLatestNews'),
          dispatch('news/fetchPopularNews'),
          dispatch('news/fetchFeaturedNews'),
          dispatch('advertisements/fetchAdvertisements')
        ])
      } catch (error) {
        commit('SET_GLOBAL_ERROR', 'Başlangıç verileri yüklenirken hata oluştu')
        console.error('Error fetching initial data:', error)
      } finally {
        commit('SET_GLOBAL_LOADING', false)
      }
    }
  },
  getters: {
    isGlobalLoading: (state) => state.isLoading,
    hasGlobalError: (state) => !!state.globalError,
    getGlobalError: (state) => state.globalError
  }
})