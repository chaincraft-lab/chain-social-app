import axios from 'axios';

// API Base URL - environment variable'dan alınabilir
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8020/api/v1';

// Cookie utility functions
const CookieUtils = {
  set(name, value, days = 7, secure = false) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    const secureFlag = secure ? '; secure' : '';
    const sameSite = '; samesite=strict';
    document.cookie = name + '=' + (value || '') + expires + '; path=/' + secureFlag + sameSite;
  },

  get(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  remove(name) {
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000,
      withCredentials: true // Cookie'lerin gönderilmesi için
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Token varsa header'a ekle
        const token = CookieUtils.get('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Başarılı response'ları direkt döndür
        return response.data;
      },
      (error) => {
        // Hataları handle et
        if (error.response?.status === 401) {
          // Unauthorized - token geçersiz olabilir
          this.handleUnauthorized();
        }
        
        return Promise.reject(error);
      }
    );
  }

  // HTTP Methods
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  // Utility methods
  setAuthToken(token, rememberMe = false) {
    if (token) {
      this.client.defaults.headers.Authorization = `Bearer ${token}`;
      // Remember me seçiliyse 30 gün, değilse 7 gün
      const days = rememberMe ? 30 : 7;
      const isSecure = location.protocol === 'https:';
      CookieUtils.set('authToken', token, days, isSecure);
    } else {
      delete this.client.defaults.headers.Authorization;
      CookieUtils.remove('authToken');
    }
  }

  getAuthToken() {
    return CookieUtils.get('authToken');
  }

  // Cookie utils'i export et
  getCookieUtils() {
    return CookieUtils;
  }

  // 401 Unauthorized durumunu handle et
  handleUnauthorized() {
    // Token'ı temizle
    CookieUtils.remove('authToken');
    delete this.client.defaults.headers.Authorization;
    
    // User bilgilerini localStorage'dan temizle
    localStorage.removeItem('user');
    
    // Store'u temizle (eğer store varsa)
    if (typeof window !== 'undefined' && window.$store) {
      window.$store.commit('user/LOGOUT_USER');
    }
    
    // Event dispatch et ki diğer componentler dinleyebilsin
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } }));
    }
  }
}

export default ApiService;