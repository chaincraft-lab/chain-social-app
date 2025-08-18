<template>
  <Modal 
    :is-open="isOpen" 
    size="md" 
    custom-class="p-8"
    @close="closeDialog"
  >
    <!-- Header -->
    <AuthHeader 
      :title="currentModeTitle"
      :subtitle="currentModeSubtitle"
    />

    <!-- Navigation Tabs -->
    <AuthTabs
      v-if="currentMode !== 'forgot'"
      v-model="currentMode"
    />

    <!-- Google Login -->
    <SocialLoginButton
      v-if="currentMode !== 'forgot'"
      provider="Google"
      :action-text="currentMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'"
      :is-loading="isGoogleLoading"
      @click="handleGoogleLogin"
    />

    <!-- Login Form -->
    <LoginForm
      v-if="currentMode === 'login'"
      :form-data="loginData"
      :errors="errors"
      :is-loading="isLoading"
      @submit="handleLogin"
      @forgot-password="setMode('forgot')"
    />

    <!-- Register Form -->
    <RegisterForm
      v-else-if="currentMode === 'register'"
      :form-data="registerData"
      :errors="errors"
      :is-loading="isLoading"
      @submit="handleRegister"
    />

    <!-- Forgot Password Form -->
    <ForgotPasswordForm
      v-else-if="currentMode === 'forgot'"
      :form-data="forgotData"
      :errors="errors"
      :is-loading="isLoading"
      @submit="handleForgotPassword"
      @back-to-login="setMode('login')"
    />

    <!-- Alert Messages -->
    <AlertMessage
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
      class="mt-6"
      @dismiss="clearAlert"
    />
  </Modal>
</template>

<script>
import { mapActions } from 'vuex'
import Modal from '@/components/common/Modal.vue'
import AlertMessage from '@/components/common/AlertMessage.vue'
import AuthHeader from '@/components/ui/Auth/AuthHeader.vue'
import AuthTabs from '@/components/ui/Auth/AuthTabs.vue'
import SocialLoginButton from '@/components/ui/Auth/SocialLoginButton.vue'
import LoginForm from '@/components/ui/Auth/LoginForm.vue'
import RegisterForm from '@/components/ui/Auth/RegisterForm.vue'
import ForgotPasswordForm from '@/components/ui/Auth/ForgotPasswordForm.vue'

export default {
  name: 'AuthDialog',
  components: {
    Modal,
    AlertMessage,
    AuthHeader,
    AuthTabs,
    SocialLoginButton,
    LoginForm,
    RegisterForm,
    ForgotPasswordForm
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    initialMode: {
      type: String,
      default: 'login',
      validator: value => ['login', 'register', 'forgot'].includes(value)
    }
  },
  emits: ['update:modelValue', 'success'],
  data() {
    return {
      currentMode: this.initialMode,
      isLoading: false,
      isGoogleLoading: false,
      alertMessage: '',
      alertType: 'error',
      errors: {},
      loginData: {
        email: '',
        password: '',
        rememberMe: false
      },
      registerData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      forgotData: {
        email: ''
      }
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    currentModeTitle() {
      const titles = {
        login: 'NewsHub',
        register: 'NewsHub',
        forgot: 'Şifre Sıfırlama'
      }
      return titles[this.currentMode]
    },
    currentModeSubtitle() {
      const subtitles = {
        login: 'Haberin ve Bilginin Sosyal Medyası',
        register: 'Haberin ve Bilginin Sosyal Medyası',
        forgot: 'E-posta adresinizi girin'
      }
      return subtitles[this.currentMode]
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.resetForms()
        this.clearAlert()
      }
    },
    currentMode() {
      this.clearAlert()
      this.errors = {}
    }
  },
  methods: {
    ...mapActions('user', ['login', 'register', 'forgotPassword']),
    
    setMode(mode) {
      this.currentMode = mode
      this.resetForms()
    },
    
    closeDialog() {
      this.isOpen = false
      this.resetForms()
      this.clearAlert()
    },
    
    resetForms() {
      this.loginData = {
        email: '',
        password: '',
        rememberMe: false
      }
      this.registerData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      }
      this.forgotData = {
        email: ''
      }
      this.errors = {}
    },
    
    clearAlert() {
      this.alertMessage = ''
      this.alertType = 'error'
    },
    
    showAlert(message, type = 'error') {
      this.alertMessage = message
      this.alertType = type
    },
    
    validateLogin() {
      this.errors = {}
      let isValid = true
      
      if (!this.loginData.email) {
        this.errors.email = 'E-posta gereklidir'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.loginData.email)) {
        this.errors.email = 'Geçerli bir e-posta adresi girin'
        isValid = false
      }
      
      if (!this.loginData.password) {
        this.errors.password = 'Şifre gereklidir'
        isValid = false
      }
      
      return isValid
    },
    
    validateRegister() {
      this.errors = {}
      let isValid = true
      
      if (!this.registerData.name) {
        this.errors.name = 'Ad soyad gereklidir'
        isValid = false
      }
      
      if (!this.registerData.email) {
        this.errors.email = 'E-posta gereklidir'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.registerData.email)) {
        this.errors.email = 'Geçerli bir e-posta adresi girin'
        isValid = false
      }
      
      // Şifre validasyonu
      if (!this.registerData.password) {
        this.errors.password = 'Şifre gereklidir'
        isValid = false
      } else {
        const password = this.registerData.password
        const passwordErrors = []
        
        if (password.length < 6) {
          passwordErrors.push('en az 6 karakter')
        }
        
        if (!/[a-z]/.test(password)) {
          passwordErrors.push('en az bir küçük harf')
        }
        
        if (!/[A-Z]/.test(password)) {
          passwordErrors.push('en az bir büyük harf')
        }
        
        if (!/[\d\W]/.test(password)) {
          passwordErrors.push('en az bir rakam veya özel karakter')
        }
        
        if (passwordErrors.length > 0) {
          this.errors.password = `Şifre ${passwordErrors.join(', ')} içermelidir`
          isValid = false
        }
      }
      
      // Şifre tekrar validasyonu
      if (!this.registerData.confirmPassword) {
        this.errors.confirmPassword = 'Şifre tekrarı gereklidir'
        isValid = false
      } else if (this.registerData.confirmPassword.length < 6) {
        this.errors.confirmPassword = 'Şifre tekrarı en az 6 karakter olmalıdır'
        isValid = false
      } else if (this.registerData.password !== this.registerData.confirmPassword) {
        this.errors.confirmPassword = 'Şifreler eşleşmiyor'
        isValid = false
      }
      
      if (!this.registerData.acceptTerms) {
        this.showAlert('Kullanım şartlarını kabul etmelisiniz')
        isValid = false
      }
      
      return isValid
    },
    
    async handleLogin() {
      if (!this.validateLogin()) return
      
      this.isLoading = true
      this.clearAlert()
      
      try {
        const loginPayload = {
          email: this.loginData.email,
          password: this.loginData.password,
          rememberMe: this.loginData.rememberMe
        }
        
        const result = await this.login(loginPayload)
        
        if (result.success) {
          this.showAlert('Giriş başarılı! Hoş geldiniz.', 'success')
          this.$emit('success', 'login')
          setTimeout(() => {
            this.closeDialog()
          }, 1500)
        } else {
          this.showAlert(result.error || 'Giriş yapılırken bir hata oluştu')
        }
      } catch (error) {
        this.showAlert('Giriş yapılırken bir hata oluştu')
      } finally {
        this.isLoading = false
      }
    },
    
    async handleRegister() {
      if (!this.validateRegister()) return
      
      this.isLoading = true
      this.clearAlert()
      
      try {
        const result = await this.register({
          name: this.registerData.name,
          email: this.registerData.email,
          password: this.registerData.password,
          confirmPassword: this.registerData.confirmPassword
        })
        
        if (result.success) {
          this.showAlert('Kayıt başarılı! Hoş geldiniz.', 'success')
          this.$emit('success', 'register')
          setTimeout(() => {
            this.closeDialog()
          }, 1500)
        } else {
          // Backend'den gelen detaylı hata mesajlarını işle
          if (result.details && Array.isArray(result.details)) {
            const errorMessage = result.details.join('. ')
            this.showAlert(errorMessage)
          } else {
            this.showAlert(result.error || 'Kayıt olurken bir hata oluştu')
          }
        }
      } catch (error) {
        // Axios error response'unu kontrol et
        if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
          const errorMessage = error.response.data.details.join('. ')
          this.showAlert(errorMessage)
        } else if (error.response?.data?.message) {
          this.showAlert(error.response.data.message)
        } else {
          this.showAlert('Kayıt olurken bir hata oluştu')
        }
      } finally {
        this.isLoading = false
      }
    },
    
    async handleForgotPassword() {
      if (!this.forgotData.email) {
        this.errors.email = 'E-posta gereklidir'
        return
      }
      
      if (!/\S+@\S+\.\S+/.test(this.forgotData.email)) {
        this.errors.email = 'Geçerli bir e-posta adresi girin'
        return
      }
      
      this.isLoading = true
      this.clearAlert()
      this.errors = {}
      
      try {
        const result = await this.forgotPassword(this.forgotData.email)
        
        if (result.success) {
          this.showAlert('Şifre sıfırlama bağlantısı e-postanıza gönderildi.', 'success')
          setTimeout(() => {
            this.setMode('login')
          }, 2000)
        } else {
          this.showAlert(result.error || 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu')
        }
      } catch (error) {
        this.showAlert('Şifre sıfırlama e-postası gönderilirken bir hata oluştu')
      } finally {
        this.isLoading = false
      }
    },
    
    async handleGoogleLogin() {
      this.isGoogleLoading = true
      this.clearAlert()
      
      try {
        // Google login implementation would go here
        this.showAlert('Google girişi şu anda mevcut değil', 'info')
      } catch (error) {
        this.showAlert('Google ile giriş yapılırken bir hata oluştu')
      } finally {
        this.isGoogleLoading = false
      }
    }
  }
}
</script>

