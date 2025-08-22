import { userService, ApiService } from '@/services'

// ApiService instance'ını al
const apiService = new ApiService()

const state = () => ({
  currentUser: null,
  isAuthenticated: false,
  userStats: null,
  userLikes: [],
  userBookmarks: [],
  userComments: [],
  loading: {
    auth: false,
    profile: false,
    stats: false,
    likes: false,
    bookmarks: false,
    comments: false
  },
  error: null
})

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
    state.isAuthenticated = !!user
    
    // User bilgilerini localStorage'a kaydet
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },
  SET_USER_STATS(state, stats) {
    state.userStats = stats
  },
  SET_USER_LIKES(state, likes) {
    state.userLikes = likes
  },
  SET_USER_BOOKMARKS(state, bookmarks) {
    state.userBookmarks = bookmarks
  },
  SET_USER_COMMENTS(state, comments) {
    state.userComments = comments
  },
  SET_LOADING(state, { type, status }) {
    state.loading[type] = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  },
  LOGOUT_USER(state) {
    state.currentUser = null
    state.isAuthenticated = false
    state.userStats = null
    state.userLikes = []
    state.userBookmarks = []
    state.userComments = []
    
    // LocalStorage'dan user bilgilerini temizle
    localStorage.removeItem('user')
  },
  UPDATE_USER_PROFILE(state, updatedData) {
    if (state.currentUser) {
      state.currentUser = { ...state.currentUser, ...updatedData }
    }
  }
}

const actions = {
  async login({ commit }, credentials) {
    commit('SET_LOADING', { type: 'auth', status: true })
    commit('CLEAR_ERROR')
    try {
      // Backend'e sadece email ve password gönder
      const loginPayload = {
        email: credentials.email,
        password: credentials.password
      }
      
      const response = await userService.login(loginPayload)
      
      // Backend response yapısı: response.data.data içinde user ve access_token var
      const loginData = response.data.data
      const user = {
        id: loginData.id,
        uuid: loginData.uuid,
        email: loginData.email,
        name: loginData.name,
        surname: loginData.surname,
        username: loginData.username,
        role: loginData.role
      }
      const token = loginData.access_token
      
      // Token'ı cookie'ye kaydet
      if (token) {
        apiService.setAuthToken(token, credentials.rememberMe)
      }
      
      // User'ı store'a kaydet (localStorage'a da kaydedilecek)
      commit('SET_CURRENT_USER', user)
      
      return { success: true, user, token }
    } catch (error) {
      // Backend'den gelen hata mesajlarını işle
      let errorMessage = 'Giriş yapılırken bir hata oluştu'
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        errorMessage = error.response.data.details.join('. ')
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      commit('SET_ERROR', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      commit('SET_LOADING', { type: 'auth', status: false })
    }
  },

  async register({ commit }, userData) {
    commit('SET_LOADING', { type: 'auth', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await userService.register(userData)
      const { user, token } = response.data || response
      
      // Token varsa kaydet
      if (token) {
        apiService.setAuthToken(token, false) // Register'da remember me yok
        commit('SET_CURRENT_USER', user)
      }
      
      return { success: true, user, token }
    } catch (error) {
      console.error('Register error:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return { success: false, error: error.response?.data?.message || error.message }
    } finally {
      commit('SET_LOADING', { type: 'auth', status: false })
    }
  },

  async logout({ commit }) {
    try {
      await userService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Her durumda token'ı ve state'i temizle
      apiService.setAuthToken(null)
      commit('LOGOUT_USER')
    }
  },

  async fetchProfile({ commit }) {
    commit('SET_LOADING', { type: 'profile', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await userService.getProfile()
      const user = response.data || response
      commit('SET_CURRENT_USER', user)
      return user
    } catch (error) {
      console.error('Fetch profile error:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      // Token geçersizse logout yap
      if (error.response?.status === 401) {
        apiService.setAuthToken(null)
        commit('LOGOUT_USER')
      }
      throw error
    } finally {
      commit('SET_LOADING', { type: 'profile', status: false })
    }
  },

  async updateProfile({ commit }, userData) {
    commit('SET_LOADING', { type: 'profile', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await userService.updateProfile(userData)
      const updatedUser = response.data || response
      commit('UPDATE_USER_PROFILE', updatedUser)
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Update profile error:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return { success: false, error: error.response?.data?.message || error.message }
    } finally {
      commit('SET_LOADING', { type: 'profile', status: false })
    }
  },

  async changePassword({ commit }, passwordData) {
    commit('SET_LOADING', { type: 'profile', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await userService.changePassword(passwordData)
      return { success: true, message: response.data?.message || 'Şifre başarıyla değiştirildi' }
    } catch (error) {
      console.error('Change password error:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return { success: false, error: error.response?.data?.message || error.message }
    } finally {
      commit('SET_LOADING', { type: 'profile', status: false })
    }
  },

  async fetchUserStats({ commit }) {
    commit('SET_LOADING', { type: 'stats', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await userService.getMyStats()
      const stats = response.data || response
      commit('SET_USER_STATS', stats)
      return stats
    } catch (error) {
      console.error('Fetch user stats error:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'stats', status: false })
    }
  },

  async fetchUserLikes({ commit }, limit = 20) {
    commit('SET_LOADING', { type: 'likes', status: true })
    try {
      const response = await userService.getMyLikes(limit)
      const likes = response.data || response
      commit('SET_USER_LIKES', likes)
      return likes
    } catch (error) {
      console.error('Fetch user likes error:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'likes', status: false })
    }
  },

  async fetchUserBookmarks({ commit }, limit = 20) {
    commit('SET_LOADING', { type: 'bookmarks', status: true })
    try {
      const response = await userService.getMyBookmarks(limit)
      const bookmarks = response.data || response
      commit('SET_USER_BOOKMARKS', bookmarks)
      return bookmarks
    } catch (error) {
      console.error('Fetch user bookmarks error:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
    } finally {
      commit('SET_LOADING', { type: 'bookmarks', status: false })
    }
  },

  async initializeAuth({ commit }) {
    // Cookie'den token al
    const token = apiService.getAuthToken()
    // LocalStorage'dan user bilgilerini al
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        // Token'ı header'a set et
        apiService.setAuthToken(token)
        // User'ı store'a yükle
        commit('SET_CURRENT_USER', user)
      } catch (error) {
        // Hata varsa temizle
        apiService.setAuthToken(null)
        commit('LOGOUT_USER')
      }
    } else {
      // Token veya user yoksa temizle
      commit('LOGOUT_USER')
      apiService.setAuthToken(null)
    }
    
    // Auth logout event'ini dinle
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', () => {
        commit('LOGOUT_USER')
      })
    }
  },

  async forgotPassword({ commit }, email) {
    commit('SET_LOADING', { type: 'auth', status: true })
    commit('CLEAR_ERROR')
    try {
      const response = await userService.forgotPassword(email)
      return { success: true, message: response.data?.message || 'Şifre sıfırlama e-postası gönderildi' }
    } catch (error) {
      console.error('Forgot password error:', error)
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return { success: false, error: error.response?.data?.message || error.message }
    } finally {
      commit('SET_LOADING', { type: 'auth', status: false })
    }
  }
}

const getters = {
  getCurrentUser: (state) => state.currentUser,
  isAuthenticated: (state) => {
    // Token ve kullanıcı bilgilerinin varlığını kontrol et
    const hasToken = apiService.getAuthToken()
    const hasUser = !!state.currentUser
    return state.isAuthenticated && hasToken && hasUser
  },
  getUserStats: (state) => state.userStats,
  getUserLikes: (state) => state.userLikes,
  getUserBookmarks: (state) => state.userBookmarks,
  getUserComments: (state) => state.userComments,
  isLoading: (state) => (type) => state.loading[type],
  hasError: (state) => !!state.error,
  getError: (state) => state.error,
  getUserRole: (state) => state.currentUser?.role || 'guest',
  isAdmin: (state) => state.currentUser?.role === 'admin',
  isEditor: (state) => state.currentUser?.role === 'editor',
  isUser: (state) => state.currentUser?.role === 'user'
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}