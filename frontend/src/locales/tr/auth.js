export default {
  login: {
    title: 'Giriş Yap',
    email: 'E-posta',
    password: 'Şifre',
    submit: 'Giriş Yap',
    forgotPassword: 'Şifremi unuttum?'
  },
  register: {
    title: 'Kayıt Ol',
    fullName: 'Ad Soyad',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifre Tekrar',
    submit: 'Kayıt Ol',
    terms: 'Kullanım Şartları',
    privacy: 'Gizlilik Politikası',
    passwordHelp: 'Şifre en az 6 karakter, bir küçük harf, bir büyük harf ve bir rakam/özel karakter içermelidir',
    acceptTerms: '<a href="/terms" target="_blank" class="text-indigo-400 hover:text-indigo-300">Kullanım Şartları</a>\'nı ve <a href="/privacy" target="_blank" class="text-indigo-400 hover:text-indigo-300">Gizlilik Politikası</a>\'nı kabul ediyorum'
  },
  forgotPassword: {
    title: 'Şifremi Unuttum',
    email: 'E-posta',
    submit: 'Şifre Sıfırlama Gönder',
    description: 'E-posta adresinizi girin, şifre sıfırlama bağlantısını size göndereceğiz.',
    backToLogin: '← Giriş sayfasına dön'
  },
  social: {
    loginWith: '{provider} ile {action}',
    loginAction: 'Giriş Yap',
    registerAction: 'Kayıt Ol',
    or: 'veya'
  },
  header: {
    title: 'ChainSocial',
    subtitle: 'Arbitrum ekosistemine özel blockchain haberleri'
  },
  validation: {
    emailRequired: 'E-posta gereklidir',
    emailInvalid: 'Geçerli bir e-posta adresi girin',
    passwordRequired: 'Şifre gereklidir',
    passwordRequirements: 'Şifre {requirements} içermelidir',
    confirmPasswordRequired: 'Şifre tekrarı gereklidir',
    confirmPasswordMinLength: 'Şifre tekrarı en az 6 karakter olmalıdır',
    passwordMismatch: 'Şifreler eşleşmiyor',
    nameRequired: 'Ad soyad gereklidir',
    termsRequired: 'Kullanım şartlarını kabul etmelisiniz',
    passwordRequirements: {
      minLength: 'en az 6 karakter',
      lowercase: 'en az bir küçük harf',
      uppercase: 'en az bir büyük harf',
      numberOrSpecial: 'en az bir rakam veya özel karakter'
    }
  },
  messages: {
    loginSuccess: 'Giriş başarılı! Hoş geldiniz.',
    loginError: 'Giriş yapılırken bir hata oluştu',
    registerSuccess: 'Kayıt başarılı! Hoş geldiniz.',
    registerError: 'Kayıt olurken bir hata oluştu',
    forgotPasswordSuccess: 'Şifre sıfırlama bağlantısı e-postanıza gönderildi.',
    forgotPasswordError: 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu',
    googleNotAvailable: 'Google girişi şu anda mevcut değil',
    googleError: 'Google ile giriş yapılırken bir hata oluştu'
  }
}