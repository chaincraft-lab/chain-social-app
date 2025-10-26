<template>
  <Modal 
    :is-open="isOpen" 
    size="md" 
    custom-class="p-4 sm:p-8"
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
      :action-text="currentMode === 'login' ? $t('auth.social.loginAction') : $t('auth.social.registerAction')"
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
        login: this.$t('auth.header.title'),
        register: this.$t('auth.header.title'),
        forgot: this.$t('auth.forgotPassword.title')
      }
      return titles[this.currentMode]
    },
    currentModeSubtitle() {
      const subtitles = {
        login: this.$t('auth.header.subtitle'),
        register: this.$t('auth.header.subtitle'),
        forgot: this.$t('auth.forgotPassword.description')
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
        this.errors.email = this.$t('auth.validation.emailRequired')
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.loginData.email)) {
        this.errors.email = this.$t('auth.validation.emailInvalid')
        isValid = false
      }
      
      if (!this.loginData.password) {
        this.errors.password = this.$t('auth.validation.passwordRequired')
        isValid = false
      }
      
      return isValid
    },
    
    validateRegister() {
      this.errors = {}
      let isValid = true
      
      if (!this.registerData.name) {
        this.errors.name = this.$t('auth.validation.nameRequired')
        isValid = false
      }
      
      if (!this.registerData.email) {
        this.errors.email = this.$t('auth.validation.emailRequired')
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.registerData.email)) {
        this.errors.email = this.$t('auth.validation.emailInvalid')
        isValid = false
      }
      
      // Şifre validasyonu
      if (!this.registerData.password) {
        this.errors.password = this.$t('auth.validation.passwordRequired')
        isValid = false
      } else {
        const password = this.registerData.password
        const passwordErrors = []
        
        if (password.length < 6) {
          passwordErrors.push(this.$t('auth.validation.passwordRequirements.minLength'))
        }
        
        if (!/[a-z]/.test(password)) {
          passwordErrors.push(this.$t('auth.validation.passwordRequirements.lowercase'))
        }
        
        if (!/[A-Z]/.test(password)) {
          passwordErrors.push(this.$t('auth.validation.passwordRequirements.uppercase'))
        }
        
        if (!/[\d\W]/.test(password)) {
          passwordErrors.push(this.$t('auth.validation.passwordRequirements.numberOrSpecial'))
        }
        
        if (passwordErrors.length > 0) {
          this.errors.password = this.$t('auth.validation.passwordRequirements', { requirements: passwordErrors.join(', ') })
          isValid = false
        }
      }
      
      // Şifre tekrar validasyonu
      if (!this.registerData.confirmPassword) {
        this.errors.confirmPassword = this.$t('auth.validation.confirmPasswordRequired')
        isValid = false
      } else if (this.registerData.confirmPassword.length < 6) {
        this.errors.confirmPassword = this.$t('auth.validation.confirmPasswordMinLength')
        isValid = false
      } else if (this.registerData.password !== this.registerData.confirmPassword) {
        this.errors.confirmPassword = this.$t('auth.validation.passwordMismatch')
        isValid = false
      }
      
      if (!this.registerData.acceptTerms) {
        this.showAlert(this.$t('auth.validation.termsRequired'))
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
          this.showAlert(this.$t('auth.messages.loginSuccess'), 'success')
          this.$emit('success', 'login')
          setTimeout(() => {
            this.closeDialog()
          }, 1500)
        } else {
          this.showAlert(result.error || this.$t('auth.messages.loginError'))
        }
      } catch (error) {
        this.showAlert(this.$t('auth.messages.loginError'))
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
          this.showAlert(this.$t('auth.messages.registerSuccess'), 'success')
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
            this.showAlert(result.error || this.$t('auth.messages.registerError'))
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
          this.showAlert(this.$t('auth.messages.registerError'))
        }
      } finally {
        this.isLoading = false
      }
    },
    
    async handleForgotPassword() {
      if (!this.forgotData.email) {
        this.errors.email = this.$t('auth.validation.emailRequired')
        return
      }
      
      if (!/\S+@\S+\.\S+/.test(this.forgotData.email)) {
        this.errors.email = this.$t('auth.validation.emailInvalid')
        return
      }
      
      this.isLoading = true
      this.clearAlert()
      this.errors = {}
      
      try {
        const result = await this.forgotPassword(this.forgotData.email)
        
        if (result.success) {
          this.showAlert(this.$t('auth.messages.forgotPasswordSuccess'), 'success')
          setTimeout(() => {
            this.setMode('login')
          }, 2000)
        } else {
          this.showAlert(result.error || this.$t('auth.messages.forgotPasswordError'))
        }
      } catch (error) {
        this.showAlert(this.$t('auth.messages.forgotPasswordError'))
      } finally {
        this.isLoading = false
      }
    },
    
    async handleGoogleLogin() {
      this.isGoogleLoading = true
      this.clearAlert()
      
      try {
        // Google login implementation would go here
        this.showAlert(this.$t('auth.messages.googleNotAvailable'), 'info')
      } catch (error) {
        this.showAlert(this.$t('auth.messages.googleError'))
      } finally {
        this.isGoogleLoading = false
      }
    }
  }
}
</script>

