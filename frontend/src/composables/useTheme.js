/**
 * Tema Yönetimi Composable
 * 
 * Bu composable tema renklerini dinamik olarak değiştirmek ve yönetmek için kullanılır.
 * CSS değişkenlerini JavaScript'ten kontrol etmeyi sağlar.
 */

import { ref, computed, onMounted } from 'vue'
import { THEME_COLORS, LIGHT_MODE_COLORS, DARK_MODE_COLORS, themeUtils } from '@/config/theme.js'

// Reactivity için tema state'i
const currentTheme = ref('default')
const isDarkMode = ref(false)

export function useTheme() {
  
  /**
   * CSS değişkenini dinamik olarak ayarlar
   * @param {string} property - CSS property adı (--color-primary gibi)
   * @param {string} value - Yeni değer
   */
  const setCSSVariable = (property, value) => {
    document.documentElement.style.setProperty(property, value)
  }

  /**
   * CSS değişkeninin değerini okur
   * @param {string} property - CSS property adı
   * @returns {string} CSS değişkenin değeri
   */
  const getCSSVariable = (property) => {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim()
  }

  /**
   * Primary rengi dinamik olarak değiştirir
   * @param {string} newColor - Yeni primary renk (hex formatında)
   */
  const setPrimaryColor = (newColor) => {
    setCSSVariable('--color-primary', newColor)
    setCSSVariable('--color-primary-rgb', themeUtils.hexToRgb(newColor))
    
    // Primary renk değiştiğinde ilgili gölge renklerini de güncelle
    const shadows = {
      '--color-primary-50': adjustBrightness(newColor, 90),
      '--color-primary-100': adjustBrightness(newColor, 80),
      '--color-primary-200': adjustBrightness(newColor, 70),
      '--color-primary-300': adjustBrightness(newColor, 60),
      '--color-primary-400': adjustBrightness(newColor, 40),
      '--color-primary-500': adjustBrightness(newColor, 20),
      '--color-primary-600': adjustBrightness(newColor, 0),
      '--color-primary-700': adjustBrightness(newColor, -20),
      '--color-primary-800': adjustBrightness(newColor, -40),
      '--color-primary-900': adjustBrightness(newColor, -60),
      '--color-primary-950': adjustBrightness(newColor, -80),
    }
    
    Object.entries(shadows).forEach(([property, value]) => {
      setCSSVariable(property, value)
    })
  }

  /**
   * Rengin parlaklığını ayarlar
   * @param {string} hex - Hex renk kodu
   * @param {number} percent - Parlaklık yüzdesi (-100 ile 100 arası)
   * @returns {string} Yeni hex renk kodu
   */
  const adjustBrightness = (hex, percent) => {
    // Hex'i RGB'ye çevir
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    
    // RGB değerlerini sınırla
    const red = Math.max(0, Math.min(255, R))
    const green = Math.max(0, Math.min(255, G))
    const blue = Math.max(0, Math.min(255, B))
    
    return '#' + (0x1000000 + (red * 0x10000) + (green * 0x100) + blue).toString(16).slice(1)
  }

  /**
   * Light ve Dark mode renklerini uygular
   * @param {boolean} isDark - Dark mode aktif mi
   */
  const applyModeColors = (isDark) => {
    const colors = isDark ? DARK_MODE_COLORS : LIGHT_MODE_COLORS
    
    Object.entries(colors).forEach(([key, value]) => {
      setCSSVariable(`--color-${key}`, value)
    })
    
    // RGB değerlerini de güncelle
    setCSSVariable('--color-primary-rgb', themeUtils.hexToRgb(colors.primary))
    setCSSVariable('--color-accent-primary-rgb', themeUtils.hexToRgb(colors['accent-primary']))
    setCSSVariable('--color-accent-secondary-rgb', themeUtils.hexToRgb(colors['accent-secondary']))
  }

  /**
   * Dark mode'u toggle eder
   */
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    applyModeColors(isDarkMode.value)
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }

  /**
   * Dark mode'u ayarlar
   * @param {boolean} enabled - Dark mode aktif mi
   */
  const setDarkMode = (enabled) => {
    isDarkMode.value = enabled
    document.documentElement.classList.toggle('dark', enabled)
    applyModeColors(enabled)
    localStorage.setItem('darkMode', enabled.toString())
  }

  /**
   * Önceden tanımlı tema setlerini uygular (Light/Dark mode ile uyumlu)
   * @param {string} themeName - Tema adı
   */
  const applyTheme = (themeName) => {
    const themes = {
      default: {
        light: {
          primary: '#6B7280', // Kül grisi
          'accent-primary': '#3B82F6', // Mavi
          'accent-secondary': '#10B981', // Yeşil
        },
        dark: {
          primary: '#9CA3AF', // Açık kül
          'accent-primary': '#60A5FA', // Açık mavi
          'accent-secondary': '#34D399', // Açık yeşil
        }
      },
      blue: {
        light: {
          primary: '#1E40AF', // Koyu mavi
          'accent-primary': '#3B82F6', // Mavi
          'accent-secondary': '#06B6D4', // Cyan
        },
        dark: {
          primary: '#3B82F6', // Mavi
          'accent-primary': '#60A5FA', // Açık mavi
          'accent-secondary': '#22D3EE', // Açık cyan
        }
      },
      green: {
        light: {
          primary: '#059669', // Koyu yeşil
          'accent-primary': '#10B981', // Yeşil
          'accent-secondary': '#06B6D4', // Cyan
        },
        dark: {
          primary: '#10B981', // Yeşil
          'accent-primary': '#34D399', // Açık yeşil
          'accent-secondary': '#22D3EE', // Açık cyan
        }
      },
      purple: {
        light: {
          primary: '#7C3AED', // Mor
          'accent-primary': '#A855F7', // Açık mor
          'accent-secondary': '#EC4899', // Pembe
        },
        dark: {
          primary: '#A855F7', // Açık mor
          'accent-primary': '#C084FC', // Daha açık mor
          'accent-secondary': '#F472B6', // Açık pembe
        }
      }
    }

    const theme = themes[themeName]
    if (theme) {
      const modeTheme = isDarkMode.value ? theme.dark : theme.light
      
      Object.entries(modeTheme).forEach(([key, value]) => {
        setCSSVariable(`--color-${key}`, value)
        // RGB değerlerini de güncelle
        setCSSVariable(`--color-${key}-rgb`, themeUtils.hexToRgb(value))
      })
      
      currentTheme.value = themeName
      localStorage.setItem('currentTheme', themeName)
    }
  }

  /**
   * Sistem tema tercihini kontrol eder
   */
  const detectSystemTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  /**
   * Kaydedilmiş tema ayarlarını yükler
   */
  const loadSavedTheme = () => {
    // Dark mode ayarını yükle ve renkları uygula
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true')
    } else {
      // Eğer kayıt yoksa sistem tercihini kullan
      setDarkMode(detectSystemTheme())
    }

    // Tema ayarını yükle
    const savedTheme = localStorage.getItem('currentTheme')
    if (savedTheme && savedTheme !== 'default') {
      applyTheme(savedTheme)
    } else {
      // Default tema renklerini uygula
      applyModeColors(isDarkMode.value)
    }
  }

  /**
   * Tema bilgilerini döndürür
   */
  const getThemeInfo = computed(() => ({
    currentTheme: currentTheme.value,
    isDarkMode: isDarkMode.value,
    primaryColor: getCSSVariable('--color-primary'),
    secondaryColor: getCSSVariable('--color-secondary'),
    accentColor: getCSSVariable('--color-accent'),
  }))

  /**
   * Kullanılabilir temaları listeler
   */
  const availableThemes = computed(() => [
    { name: 'default', label: 'Varsayılan (Kül Grisi)', primary: '#6B7280' },
    { name: 'blue', label: 'Mavi', primary: '#1e40af' },
    { name: 'green', label: 'Yeşil', primary: '#059669' },
    { name: 'purple', label: 'Mor', primary: '#7c3aed' },
  ])

  /**
   * Custom renk picker için renk değiştirme
   * @param {Object} colors - { primary, secondary, accent }
   */
  const setCustomColors = (colors) => {
    if (colors.primary) setPrimaryColor(colors.primary)
    if (colors.secondary) {
      setCSSVariable('--color-secondary', colors.secondary)
      setCSSVariable('--color-secondary-rgb', themeUtils.hexToRgb(colors.secondary))
    }
    if (colors.accent) {
      setCSSVariable('--color-accent', colors.accent)
      setCSSVariable('--color-accent-rgb', themeUtils.hexToRgb(colors.accent))
    }
    currentTheme.value = 'custom'
    localStorage.setItem('currentTheme', 'custom')
    localStorage.setItem('customColors', JSON.stringify(colors))
  }

  // Component mount olduğunda tema ayarlarını yükle
  onMounted(() => {
    loadSavedTheme()
  })

  // System theme değişikliklerini dinle
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Sadece kullanıcı manuel ayar yapmamışsa sistem tercihini takip et
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches)
      }
    })
  }

  return {
    // State
    currentTheme: computed(() => currentTheme.value),
    isDarkMode: computed(() => isDarkMode.value),
    themeInfo: getThemeInfo,
    availableThemes,
    
    // Methods
    setPrimaryColor,
    toggleDarkMode,
    setDarkMode,
    applyTheme,
    setCustomColors,
    setCSSVariable,
    getCSSVariable,
    loadSavedTheme,
    
    // Utils
    themeUtils
  }
}

export default useTheme