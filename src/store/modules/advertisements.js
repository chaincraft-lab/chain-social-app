import { advertisementService } from '@/api'

const state = () => ({
  advertisements: [],
  loading: false,
  error: null
})

const mutations = {
  SET_ADVERTISEMENTS(state, ads) {
    state.advertisements = ads
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
  async fetchAdvertisements({ commit }, position = null) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    try {
      const response = await advertisementService.getAdvertisements(position)
      commit('SET_ADVERTISEMENTS', response.data)
    } catch (error) {
      console.error('Error fetching advertisements:', error)
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  getAdvertisements: (state) => state.advertisements || [],
  getAdvertisementsByPosition: (state) => (position) => {
    if (!Array.isArray(state.advertisements)) return []
    return state.advertisements.filter(ad => ad && ad.position === position)
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