import { createI18n } from 'vue-i18n'
import tr from './tr/index.js'
import en from './en/index.js'

const messages = {
  tr,
  en
}

// Varsayılan dil Türkçe, localStorage'dan tercih edilen dili al
const getDefaultLocale = () => {
  const savedLocale = localStorage.getItem('language')
  if (savedLocale && ['tr', 'en'].includes(savedLocale)) {
    return savedLocale
  }
  // Tarayıcı dili kontrolü
  const browserLocale = navigator.language.split('-')[0]
  return ['tr', 'en'].includes(browserLocale) ? browserLocale : 'tr'
}

const i18n = createI18n({
  legacy: false, // Composition API kullanımı için
  locale: getDefaultLocale(),
  fallbackLocale: 'tr',
  messages,
  globalInjection: true // $t'yi global olarak kullanabilmek için
})

export default i18n