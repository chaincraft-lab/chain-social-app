import { LIGHT_MODE_THEME, DARK_MODE_THEME, themeUtils } from '@/config/theme'

const state = () => ({
  isDarkMode: false,
  theme: LIGHT_MODE_THEME
})

const mutations = {
  SET_DARK_MODE(state, isDark) {
    state.isDarkMode = isDark
    state.theme = isDark ? DARK_MODE_THEME : LIGHT_MODE_THEME
    
    // LocalStorage'a kaydet
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    
    // HTML document'e theme class'ını ekle
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark)
      // Body'ye de class ekle
      document.body.classList.toggle('dark', isDark)
    }
    
    // CSS değişkenlerini güncelle
    this.dispatch('theme/updateCSSVariables')
  },
  
  TOGGLE_THEME(state) {
    const newDarkMode = !state.isDarkMode
    this.commit('theme/SET_DARK_MODE', newDarkMode)
  },
  
  INITIALIZE_THEME(state) {
    // LocalStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme')
    let isDark = false
    
    if (savedTheme) {
      // Kullanıcı tercihi varsa onu kullan
      isDark = savedTheme === 'dark'
    } else {
      // Kullanıcı tercihi yoksa sistem tercihini kontrol et
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    this.commit('theme/SET_DARK_MODE', isDark)
  }
}

const actions = {
  initializeTheme({ commit }) {
    commit('INITIALIZE_THEME')
  },
  
  toggleTheme({ commit }) {
    commit('TOGGLE_THEME')
  },
  
  setDarkMode({ commit }, isDark) {
    commit('SET_DARK_MODE', isDark)
  },
  
  updateCSSVariables({ state }) {
    if (typeof document === 'undefined') return
    
    // Theme renklerini CSS değişkenleri olarak document root'a ekle
    const cssVariables = themeUtils.generateCSSVariables(state.isDarkMode)
    const root = document.documentElement
    
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
    
    // Mevcut color değişkenlerini de güncelle (geriye dönük uyumluluk için)
    const theme = state.theme
    
    // Navbar renkleri
    root.style.setProperty('--color-navbar-bg', theme.navbar.bg)
    root.style.setProperty('--color-navbar-text', theme.navbar.text)
    root.style.setProperty('--color-navbar-border', theme.navbar.border)
    
    // Auth button renkleri
    root.style.setProperty('--color-auth-bg', theme.auth.bg)
    root.style.setProperty('--color-auth-hover', theme.auth.hover)
    root.style.setProperty('--color-auth-text', theme.auth.text)
    
    // Temel renkler
    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-text-primary', theme.text.primary)
    root.style.setProperty('--color-text-secondary', theme.text.secondary)
    root.style.setProperty('--color-bg-primary', theme.bg.primary)
    root.style.setProperty('--color-bg-secondary', theme.bg.secondary)
    root.style.setProperty('--color-border-primary', theme.border.primary)
    
    // System colors
    root.style.setProperty('--color-success', theme.success)
    root.style.setProperty('--color-error', theme.error)
    root.style.setProperty('--color-warning', theme.warning)
    root.style.setProperty('--color-info', theme.info)
  },
  
  // Sistem tema değişikliklerini dinle
  watchSystemTheme({ commit, state }) {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Eğer kullanıcı manuel bir tercih yapmamışsa sistem tercihini takip et
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        commit('SET_DARK_MODE', e.matches)
      }
    }
    
    // Event listener ekle
    mediaQuery.addListener(handleChange)
    
    // Cleanup için listener'ı return et
    return () => mediaQuery.removeListener(handleChange)
  }
}

const getters = {
  isDarkMode: (state) => state.isDarkMode,
  currentTheme: (state) => state.theme,
  themeMode: (state) => state.isDarkMode ? 'dark' : 'light',
  
  // Tema renklerini almak için helper getters
  getThemeColor: (state) => (path) => {
    return themeUtils.getThemeColor(state.isDarkMode, path)
  },
  
  navbarColors: (state) => state.theme.navbar,
  authColors: (state) => state.theme.auth,
  textColors: (state) => state.theme.text,
  bgColors: (state) => state.theme.bg,
  borderColors: (state) => state.theme.border
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}