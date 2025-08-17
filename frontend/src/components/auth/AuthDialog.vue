<template>
  <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeDialog"></div>
    
    <!-- Dialog -->
    <div class="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
      <!-- Close Button -->
      <button
        @click="closeDialog"
        class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">NewsHub</h2>
        <p class="text-gray-400 text-sm">Haberin ve Bilginin Sosyal Medyası</p>
      </div>

      <!-- Navigation Tabs -->
      <div v-if="currentMode !== 'forgot'" class="flex bg-gray-800 rounded-lg p-1 mb-6">
        <button
          @click="setMode('login')"
          :class="[
            'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all',
            currentMode === 'login' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-400 hover:text-white'
          ]"
        >
          Giriş Yap
        </button>
        <button
          @click="setMode('register')"
          :class="[
            'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all',
            currentMode === 'register' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-400 hover:text-white'
          ]"
        >
          Kayıt Ol
        </button>
      </div>

      <!-- Google Login -->
      <div v-if="currentMode !== 'forgot'" class="mb-6">
        <button
          @click="handleGoogleLogin"
          :disabled="isGoogleLoading"
          class="w-full flex items-center justify-center px-4 py-2.5 border border-gray-700 rounded-lg text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5 mr-3">
          <span>Google ile {{ currentMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol' }}</span>
          <svg v-if="isGoogleLoading" class="animate-spin ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
        
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 text-gray-400 bg-gray-900">veya</span>
          </div>
        </div>
      </div>

      <!-- Login Form -->
      <form v-if="currentMode === 'login'" @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-100">E-posta</label>
          <input
            type="email"
            id="email"
            v-model="loginData.email"
            autocomplete="email"
            required
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white border border-white/10 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium text-gray-100">Şifre</label>
            <button
              type="button"
              @click="setMode('forgot')"
              class="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Şifremi unuttum?
            </button>
          </div>
          <div class="mt-2 relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="loginData.password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-2 pr-10 text-white border border-white/10 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-500': errors.password }"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
        </div>

        <div class="flex items-center">
          <input
            type="checkbox"
            id="remember-me"
            v-model="loginData.rememberMe"
            class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-300">Beni hatırla</label>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="animate-spin mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else>Giriş Yap</span>
        </button>
      </form>

      <!-- Register Form -->
      <form v-else-if="currentMode === 'register'" @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-100">Ad Soyad</label>
          <input
            type="text"
            id="name"
            v-model="registerData.name"
            autocomplete="name"
            required
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white border border-white/10 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-400">{{ errors.name }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-100">E-posta</label>
          <input
            type="email"
            id="email"
            v-model="registerData.email"
            autocomplete="email"
            required
            class="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white border border-white/10 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-100">Şifre</label>
            <div class="mt-2 relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="registerData.password"
                autocomplete="new-password"
                required
                class="block w-full rounded-md bg-white/5 px-3 py-2 pr-10 text-white border border-white/10 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
            <p v-else class="mt-1 text-xs text-gray-400">
              Şifre en az 6 karakter, bir küçük harf, bir büyük harf ve bir rakam/özel karakter içermelidir
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-100">Şifre Tekrar</label>
            <div class="mt-2 relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="registerData.confirmPassword"
                autocomplete="new-password"
                required
                class="block w-full rounded-md bg-white/5 px-3 py-2 pr-10 text-white border border-white/10 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                :class="{ 'border-red-500': errors.confirmPassword }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-400">{{ errors.confirmPassword }}</p>
          </div>
        </div>

        <div class="flex items-start">
          <input
            type="checkbox"
            id="accept-terms"
            v-model="registerData.acceptTerms"
            class="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
          />
          <label for="accept-terms" class="ml-2 block text-sm text-gray-300">
            <a href="/terms" target="_blank" class="text-indigo-400 hover:text-indigo-300">Kullanım Şartları</a>'nı ve 
            <a href="/privacy" target="_blank" class="text-indigo-400 hover:text-indigo-300">Gizlilik Politikası</a>'nı kabul ediyorum
          </label>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="animate-spin mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else>Kayıt Ol</span>
        </button>
      </form>

      <!-- Forgot Password Form -->
      <div v-else-if="currentMode === 'forgot'" class="space-y-6">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-semibold text-white">Şifremi Unuttum</h3>
          <p class="mt-2 text-sm text-gray-400">E-posta adresinizi girin, şifre sıfırlama bağlantısını size göndereceğiz.</p>
        </div>

        <form @submit.prevent="handleForgotPassword">
          <div>
            <label for="forgot-email" class="block text-sm font-medium text-gray-100">E-posta</label>
            <input
              type="email"
              id="forgot-email"
              v-model="forgotData.email"
              autocomplete="email"
              required
              class="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white border border-white/10 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="mt-4 w-full flex justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>Şifre Sıfırlama Gönder</span>
          </button>

          <button
            type="button"
            @click="setMode('login')"
            class="mt-3 w-full text-center text-sm text-indigo-400 hover:text-indigo-300"
          >
            ← Giriş sayfasına dön
          </button>
        </form>
      </div>

      <!-- Alert Messages -->
      <div v-if="alertMessage" :class="[
        'mt-6 p-4 rounded-lg border flex items-center',
        alertType === 'success' ? 'bg-green-900/20 border-green-500 text-green-400' :
        alertType === 'info' ? 'bg-blue-900/20 border-blue-500 text-blue-400' :
        'bg-red-900/20 border-red-500 text-red-400'
      ]">
        <svg :class="['w-5 h-5 mr-2', alertType === 'success' ? 'text-green-400' : alertType === 'info' ? 'text-blue-400' : 'text-red-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="alertType === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          <path v-else-if="alertType === 'info'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="flex-1">{{ alertMessage }}</span>
        <button @click="clearAlert" class="ml-2 text-gray-400 hover:text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'AuthDialog',
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
      currentTab: this.initialMode,
      showPassword: false,
      showConfirmPassword: false,
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
        login: 'Hoş Geldiniz',
        register: 'Kayıt Olun',
        forgot: 'Şifre Sıfırlama'
      }
      return titles[this.currentMode]
    },
    currentModeSubtitle() {
      const subtitles = {
        login: 'Giriş yaparak devam edin',
        register: 'Hesabınızı oluşturun',
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
    currentMode(newMode) {
      this.currentTab = newMode
      this.clearAlert()
      this.errors = {}
    },
    currentTab(newTab) {
      if (newTab !== this.currentMode) {
        this.currentMode = newTab
      }
    }
  },
  methods: {
    ...mapActions('user', ['login', 'register', 'forgotPassword']),
    
    setMode(mode) {
      this.currentMode = mode
      this.currentTab = mode
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
      this.showPassword = false
      this.showConfirmPassword = false
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

