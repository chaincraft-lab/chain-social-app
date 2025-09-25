<template>
  <div class="profile-change-password p-6">
    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold theme-text-primary flex items-center gap-2 mb-2">
        <Icon icon="heroicons:key" class="w-6 h-6 text-yellow-500" />
        Şifre Değiştir
      </h2>
      <p class="theme-text-secondary">Hesabınızın güvenliği için güçlü bir şifre kullanın</p>
    </div>

    <!-- Security Tips -->
    <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <div class="flex items-start gap-3">
        <Icon icon="heroicons:shield-check" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-medium text-blue-700 dark:text-blue-300 mb-2">Güvenli Şifre Önerileri</h4>
          <ul class="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• En az 8 karakter uzunluğunda olmalı</li>
            <li>• Büyük ve küçük harf içermeli</li>
            <li>• En az bir rakam ve özel karakter bulunmalı</li>
            <li>• Kişisel bilgilerinizi içermemeli</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Change Password Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Current Password -->
      <div>
        <label class="block text-sm font-medium theme-text-primary mb-2">
          Mevcut Şifre *
        </label>
        <div class="relative">
          <input
            v-model="form.currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
            placeholder="Mevcut şifrenizi girin"
            required
            :class="{ 'border-red-500': errors.currentPassword }"
          />
          <button
            type="button"
            @click="showCurrentPassword = !showCurrentPassword"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon 
              :icon="showCurrentPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
              class="w-5 h-5" 
            />
          </button>
        </div>
        <p v-if="errors.currentPassword" class="text-red-500 text-sm mt-1">
          {{ errors.currentPassword }}
        </p>
      </div>

      <!-- New Password -->
      <div>
        <label class="block text-sm font-medium theme-text-primary mb-2">
          Yeni Şifre *
        </label>
        <div class="relative">
          <input
            v-model="form.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
            placeholder="Yeni şifrenizi girin"
            required
            :class="{ 'border-red-500': errors.newPassword }"
            @input="validatePassword"
          />
          <button
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon 
              :icon="showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
              class="w-5 h-5" 
            />
          </button>
        </div>
        <p v-if="errors.newPassword" class="text-red-500 text-sm mt-1">
          {{ errors.newPassword }}
        </p>
        
        <!-- Password Strength Indicator -->
        <div v-if="form.newPassword" class="mt-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm theme-text-secondary">Şifre Gücü:</span>
            <span 
              class="text-sm font-medium"
              :class="passwordStrengthColor"
            >
              {{ passwordStrengthText }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300"
              :class="passwordStrengthColor.replace('text-', 'bg-')"
              :style="{ width: passwordStrengthPercentage + '%' }"
            ></div>
          </div>
          
          <!-- Password Requirements -->
          <div class="mt-3 space-y-1">
            <div class="flex items-center gap-2 text-xs">
              <Icon 
                :icon="passwordChecks.length ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                :class="passwordChecks.length ? 'text-green-500' : 'text-gray-400'"
                class="w-4 h-4"
              />
              <span :class="passwordChecks.length ? 'text-green-600' : 'theme-text-secondary'">
                En az 8 karakter
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <Icon 
                :icon="passwordChecks.uppercase ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                :class="passwordChecks.uppercase ? 'text-green-500' : 'text-gray-400'"
                class="w-4 h-4"
              />
              <span :class="passwordChecks.uppercase ? 'text-green-600' : 'theme-text-secondary'">
                Büyük harf içeriyor
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <Icon 
                :icon="passwordChecks.lowercase ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                :class="passwordChecks.lowercase ? 'text-green-500' : 'text-gray-400'"
                class="w-4 h-4"
              />
              <span :class="passwordChecks.lowercase ? 'text-green-600' : 'theme-text-secondary'">
                Küçük harf içeriyor
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <Icon 
                :icon="passwordChecks.number ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                :class="passwordChecks.number ? 'text-green-500' : 'text-gray-400'"
                class="w-4 h-4"
              />
              <span :class="passwordChecks.number ? 'text-green-600' : 'theme-text-secondary'">
                Rakam içeriyor
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <Icon 
                :icon="passwordChecks.special ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                :class="passwordChecks.special ? 'text-green-500' : 'text-gray-400'"
                class="w-4 h-4"
              />
              <span :class="passwordChecks.special ? 'text-green-600' : 'theme-text-secondary'">
                Özel karakter içeriyor
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm New Password -->
      <div>
        <label class="block text-sm font-medium theme-text-primary mb-2">
          Yeni Şifre Tekrar *
        </label>
        <div class="relative">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
            placeholder="Yeni şifrenizi tekrar girin"
            required
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon 
              :icon="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
              class="w-5 h-5" 
            />
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Two-Factor Authentication Option -->
      <div class="p-4 theme-bg-secondary rounded-lg border theme-border-primary">
        <div class="flex items-start gap-3">
          <Icon icon="heroicons:shield-check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h4 class="font-medium theme-text-primary mb-1">İki Faktörlü Doğrulama</h4>
            <p class="text-sm theme-text-secondary mb-3">
              Hesabınızın güvenliğini artırmak için iki faktörlü doğrulamayı etkinleştirin.
            </p>
            <label class="flex items-center gap-2">
              <input
                v-model="form.enableTwoFactor"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm theme-text-primary">Şifre değiştirdikten sonra iki faktörlü doğrulamayı etkinleştir</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t theme-border-primary">
        <button
          type="submit"
          :disabled="!isFormValid || isLoading"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Icon 
            v-if="isLoading" 
            icon="heroicons:arrow-path" 
            class="w-5 h-5 animate-spin" 
          />
          <span>{{ isLoading ? 'Şifre Değiştiriliyor...' : 'Şifreyi Değiştir' }}</span>
        </button>
        
        <button
          type="button"
          @click="resetForm"
          class="flex-1 theme-bg-secondary hover:theme-bg-primary theme-text-secondary hover:theme-text-primary font-medium py-3 px-6 rounded-lg transition-colors"
        >
          İptal Et
        </button>
      </div>
    </form>

    <!-- Last Password Change Info -->
    <div class="mt-8 p-4 theme-bg-secondary rounded-lg">
      <div class="flex items-center gap-3">
        <Icon icon="heroicons:clock" class="w-5 h-5 theme-text-secondary" />
        <div>
          <p class="text-sm theme-text-primary font-medium">Son şifre değişikliği</p>
          <p class="text-xs theme-text-secondary">15 Şubat 2024, 14:30</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'

// Emits
const emit = defineEmits(['change-password'])

// State
const isLoading = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  enableTwoFactor: false
})

const errors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password strength validation
const passwordChecks = computed(() => {
  const password = form.value.newPassword
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

const passwordStrength = computed(() => {
  const checks = passwordChecks.value
  const score = Object.values(checks).filter(Boolean).length
  
  if (score < 2) return 0
  if (score < 3) return 1
  if (score < 4) return 2
  if (score < 5) return 3
  return 4
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  const texts = ['Çok Zayıf', 'Zayıf', 'Orta', 'Güçlü', 'Çok Güçlü']
  return texts[strength]
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  const colors = ['text-red-500', 'text-red-400', 'text-yellow-500', 'text-green-500', 'text-green-600']
  return colors[strength]
})

const passwordStrengthPercentage = computed(() => {
  return (passwordStrength.value + 1) * 20
})

const isFormValid = computed(() => {
  return (
    form.value.currentPassword &&
    form.value.newPassword &&
    form.value.confirmPassword &&
    form.value.newPassword === form.value.confirmPassword &&
    passwordStrength.value >= 2 &&
    !Object.values(errors.value).some(error => error)
  )
})

// Methods
const validatePassword = () => {
  errors.value.newPassword = ''
  
  if (form.value.newPassword && passwordStrength.value < 2) {
    errors.value.newPassword = 'Şifre çok zayıf. Güvenlik gereksinimlerini karşıladığınızdan emin olun.'
  }
  
  if (form.value.confirmPassword && form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Şifreler eşleşmiyor'
  } else {
    errors.value.confirmPassword = ''
  }
}

const handleSubmit = async () => {
  // Validate form
  if (!isFormValid.value) return
  
  isLoading.value = true
  
  try {
    await emit('change-password', {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword,
      enableTwoFactor: form.value.enableTwoFactor
    })
    
    resetForm()
  } catch (error) {
    console.error('Password change failed:', error)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    enableTwoFactor: false
  }
  
  errors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .profile-change-password {
    padding: 1rem;
  }
}
</style>