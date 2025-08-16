import axios from 'axios';

// API Base URL - environment variable'dan alınabilir
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8020/api/v1';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Token varsa header'a ekle
        const token = localStorage.getItem('token');
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
          localStorage.removeItem('token');
          // Login sayfasına yönlendir (eğer router kullanılabilirse)
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
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete this.client.defaults.headers.Authorization;
      localStorage.removeItem('token');
    }
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }
}

export default ApiService;