import ApiService from '../base/ApiService';

class UserService extends ApiService {
  constructor() {
    super();
  }

  // Kullanıcı girişi
  async login(credentials) {
    return this.post('/auth/login', credentials);
  }

  // Kullanıcı kaydı
  async register(userData) {
    return this.post('/auth/register', userData);
  }

  // Şifremi unuttum
  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email });
  }

  // Şifre sıfırla
  async resetPassword(token, newPassword) {
    return this.post('/auth/reset-password', { token, password: newPassword });
  }

  // Çıkış yap
  async logout() {
    return this.post('/auth/logout');
  }

  // Token yenile
  async refreshToken() {
    return this.post('/auth/refresh');
  }

  // Kendi profilini getir
  async getProfile() {
    return this.get('/users/profile');
  }

  // Kendi profilini güncelle
  async updateProfile(userData) {
    return this.put('/users/profile', userData);
  }

  // Şifre değiştir
  async changePassword(passwordData) {
    return this.put('/users/change-password', passwordData);
  }

  // Kendi istatistiklerini getir
  async getMyStats() {
    return this.get('/users/my-stats');
  }

  // Kendi beğenilerini getir
  async getMyLikes(limit = 20) {
    const params = new URLSearchParams({ limit });
    return this.get(`/users/my-likes?${params.toString()}`);
  }

  // Kendi kaydettiği haberlerini getir
  async getMyBookmarks(limit = 20) {
    const params = new URLSearchParams({ limit });
    return this.get(`/users/my-bookmarks?${params.toString()}`);
  }

  // Kendi yorumlarını getir
  async getMyComments(limit = 20) {
    const params = new URLSearchParams({ limit });
    return this.get(`/users/my-comments?${params.toString()}`);
  }

  // Hesabı sil (kendi hesabını)
  async deleteMyAccount() {
    return this.delete('/users/profile');
  }

  // Token doğrula
  async verifyToken() {
    return this.get('/auth/verify-token');
  }

  // E-posta doğrula
  async verifyEmail(token) {
    return this.post('/auth/verify-email', { token });
  }

  // E-posta doğrulama tekrar gönder
  async resendEmailVerification() {
    return this.post('/auth/resend-verification');
  }
}

// Singleton instance
const userService = new UserService();

export default userService;