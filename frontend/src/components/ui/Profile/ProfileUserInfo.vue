<template>
  <div class="profile-user-info p-6">
    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold theme-text-primary flex items-center gap-2 mb-2">
        <Icon icon="heroicons:user" class="w-6 h-6 text-blue-500" />
        Kişisel Bilgiler
      </h2>
      <p class="theme-text-secondary">Hesap bilgilerinizi güncelleyin</p>
    </div>

    <!-- User Info Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            Ad Soyad *
          </label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Adınız ve soyadınız"
            required
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">
            {{ errors.name }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            E-posta Adresi *
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ornek@email.com"
            required
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email }}
          </p>
          <p v-if="form.email !== userInfo.email" class="text-blue-600 text-sm mt-1">
            E-posta değişikliği onay gerektirir
          </p>
        </div>
      </div>

      <!-- Phone and Location -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            Telefon Numarası
          </label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+90 555 123 45 67"
            :class="{ 'border-red-500': errors.phone }"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            Konum
          </label>
          <input
            v-model="form.location"
            type="text"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Şehir, Ülke"
          />
        </div>
      </div>

      <!-- Bio -->
      <div>
        <label class="block text-sm font-medium theme-text-primary mb-2">
          Hakkında
        </label>
        <textarea
          v-model="form.bio"
          rows="4"
          class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
          maxlength="500"
        ></textarea>
        <div class="flex justify-between items-center mt-1">
          <p class="text-xs theme-text-secondary">Maksimum 500 karakter</p>
          <p class="text-xs theme-text-secondary">{{ form.bio.length }}/500</p>
        </div>
      </div>

      <!-- Preferences -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold theme-text-primary flex items-center gap-2">
          <Icon icon="heroicons:cog-6-tooth" class="w-5 h-5" />
          Tercihler
        </h3>
        
        <!-- Language Preference -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              Dil Tercihi
            </label>
            <select
              v-model="form.language"
              class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <!-- Timezone -->
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              Saat Dilimi
            </label>
            <select
              v-model="form.timezone"
              class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
              <option value="Europe/London">Londra (UTC+0)</option>
              <option value="Europe/Berlin">Berlin (UTC+1)</option>
              <option value="America/New_York">New York (UTC-5)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold theme-text-primary flex items-center gap-2">
          <Icon icon="heroicons:bell" class="w-5 h-5" />
          Bildirim Ayarları
        </h3>
        
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input
              v-model="form.notifications.email"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span class="theme-text-primary font-medium">E-posta Bildirimleri</span>
              <p class="text-sm theme-text-secondary">Yeni haberler ve güncellemeler için e-posta alın</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3">
            <input
              v-model="form.notifications.browser"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span class="theme-text-primary font-medium">Tarayıcı Bildirimleri</span>
              <p class="text-sm theme-text-secondary">Anında bildirimler için tarayıcı izni verin</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3">
            <input
              v-model="form.notifications.newsletter"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span class="theme-text-primary font-medium">Haber Bülteni</span>
              <p class="text-sm theme-text-secondary">Haftalık özet ve özel içerikler alın</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold theme-text-primary flex items-center gap-2">
          <Icon icon="heroicons:shield-check" class="w-5 h-5" />
          Gizlilik Ayarları
        </h3>
        
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input
              v-model="form.privacy.profilePublic"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span class="theme-text-primary font-medium">Herkese Açık Profil</span>
              <p class="text-sm theme-text-secondary">Profilinizi diğer kullanıcılar görebilsin</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3">
            <input
              v-model="form.privacy.showActivity"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span class="theme-text-primary font-medium">Aktivite Geçmişi</span>
              <p class="text-sm theme-text-secondary">Beğeniler ve yorumlarınızı başkaları görebilsin</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3">
            <input
              v-model="form.privacy.allowMessages"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span class="theme-text-primary font-medium">Özel Mesajlar</span>
              <p class="text-sm theme-text-secondary">Diğer kullanıcılar size mesaj gönderebilsin</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t theme-border-primary">
        <button
          type="submit"
          :disabled="!hasChanges || isLoading"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Icon 
            v-if="isLoading" 
            icon="heroicons:arrow-path" 
            class="w-5 h-5 animate-spin" 
          />
          <span>{{ isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}</span>
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

    <!-- Account Verification -->
    <div v-if="!userInfo.isVerified" class="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
      <div class="flex items-start gap-3">
        <Icon icon="heroicons:exclamation-triangle" class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h4 class="font-medium text-yellow-700 dark:text-yellow-300 mb-1">Hesap Doğrulama</h4>
          <p class="text-sm text-yellow-600 dark:text-yellow-400 mb-3">
            E-posta adresiniz henüz doğrulanmamış. Tüm özelliklere erişim için e-postanızı doğrulayın.
          </p>
          <button 
            @click="sendVerificationEmail"
            class="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
          >
            Doğrulama E-postası Gönder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'

// Props
const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['update-info'])

// State
const isLoading = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
  language: 'tr',
  timezone: 'Europe/Istanbul',
  notifications: {
    email: true,
    browser: false,
    newsletter: true
  },
  privacy: {
    profilePublic: true,
    showActivity: true,
    allowMessages: true
  }
})

const errors = ref({
  name: '',
  email: '',
  phone: ''
})

// Computed
const hasChanges = computed(() => {
  const original = props.userInfo
  return (
    form.value.name !== (original.name || '') ||
    form.value.email !== (original.email || '') ||
    form.value.phone !== (original.phone || '') ||
    form.value.location !== (original.location || '') ||
    form.value.bio !== (original.bio || '') ||
    form.value.language !== (original.language || 'tr') ||
    form.value.timezone !== (original.timezone || 'Europe/Istanbul') ||
    JSON.stringify(form.value.notifications) !== JSON.stringify(original.notifications || {}) ||
    JSON.stringify(form.value.privacy) !== JSON.stringify(original.privacy || {})
  )
})

// Methods
const initializeForm = () => {
  const user = props.userInfo
  form.value = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
    language: user.language || 'tr',
    timezone: user.timezone || 'Europe/Istanbul',
    notifications: {
      email: user.notifications?.email !== false,
      browser: user.notifications?.browser || false,
      newsletter: user.notifications?.newsletter !== false
    },
    privacy: {
      profilePublic: user.privacy?.profilePublic !== false,
      showActivity: user.privacy?.showActivity !== false,
      allowMessages: user.privacy?.allowMessages !== false
    }
  }
}

const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    phone: ''
  }
  
  let isValid = true
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Ad soyad gereklidir'
    isValid = false
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = 'E-posta adresi gereklidir'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Geçerli bir e-posta adresi girin'
    isValid = false
  }
  
  if (form.value.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(form.value.phone)) {
    errors.value.phone = 'Geçerli bir telefon numarası girin'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    await emit('update-info', form.value)
  } catch (error) {
    console.error('Error updating user info:', error)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  initializeForm()
  errors.value = {
    name: '',
    email: '',
    phone: ''
  }
}

const sendVerificationEmail = async () => {
  try {
    // API call to send verification email
    console.log('Sending verification email...')
    alert('Doğrulama e-postası gönderildi! E-posta kutunuzu kontrol edin.')
  } catch (error) {
    console.error('Error sending verification email:', error)
    alert('E-posta gönderilirken bir hata oluştu.')
  }
}

// Watch for prop changes
watch(() => props.userInfo, () => {
  initializeForm()
}, { immediate: true })
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
  .profile-user-info {
    padding: 1rem;
  }
}
</style>