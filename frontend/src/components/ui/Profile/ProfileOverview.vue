<template>
  <div class="profile-overview p-6">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold theme-text-primary mb-2">
        Hoş geldin, {{ userInfo.name }}! 👋
      </h2>
      <p class="theme-text-secondary">
        Profil aktivitelerinin ve istatistiklerinin özeti
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="text-center p-4 theme-bg-secondary rounded-lg">
        <Icon icon="heroicons:heart" class="w-8 h-8 mx-auto mb-2 text-red-500" />
        <div class="text-2xl font-bold theme-text-primary">{{ userStats.likes }}</div>
        <div class="text-sm theme-text-secondary">{{ t('profile.overview.stats.likes') }}</div>
      </div>
      
      <div class="text-center p-4 theme-bg-secondary rounded-lg">
        <Icon icon="heroicons:bookmark" class="w-8 h-8 mx-auto mb-2 text-blue-500" />
        <div class="text-2xl font-bold theme-text-primary">{{ userStats.bookmarks }}</div>
        <div class="text-sm theme-text-secondary">{{ t('profile.overview.stats.bookmarks') }}</div>
      </div>
      
      <div class="text-center p-4 theme-bg-secondary rounded-lg">
        <Icon icon="heroicons:chat-bubble-left" class="w-8 h-8 mx-auto mb-2 text-green-500" />
        <div class="text-2xl font-bold theme-text-primary">{{ userStats.comments }}</div>
        <div class="text-sm theme-text-secondary">Yorum</div>
      </div>
      
      <div class="text-center p-4 theme-bg-secondary rounded-lg">
        <Icon icon="heroicons:share" class="w-8 h-8 mx-auto mb-2 text-purple-500" />
        <div class="text-2xl font-bold theme-text-primary">{{ userStats.shares }}</div>
        <div class="text-sm theme-text-secondary">Paylaşım</div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
        <Icon icon="heroicons:clock" class="w-5 h-5" />
        Son Aktiviteler
      </h3>
      
      <div v-if="recentActivities.length > 0" class="space-y-3">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="flex items-start gap-3 p-3 theme-bg-secondary rounded-lg"
        >
          <div class="flex-shrink-0 mt-1">
            <Icon 
              :icon="getActivityIcon(activity.type)" 
              :class="getActivityColor(activity.type)"
              class="w-4 h-4"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="theme-text-primary text-sm">{{ activity.title }}</p>
            <p class="theme-text-secondary text-xs">{{ formatTime(activity.date) }}</p>
          </div>
        </div>
      </div>
      
      <EmptyState 
        v-else
        icon="heroicons:clock"
        title="Henüz aktivite yok"
        description="Haberleri beğenmeye ve kaydetmeye başlayın"
        size="sm"
      />
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
        <Icon icon="heroicons:bolt" class="w-5 h-5" />
        Hızlı İşlemler
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          @click="navigateToSection('likes')"
          class="flex items-center gap-3 p-4 theme-bg-secondary hover:theme-bg-primary rounded-lg transition-colors text-left group"
        >
          <Icon icon="heroicons:heart" class="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
          <div>
            <div class="font-medium theme-text-primary">{{ t('profile.overview.actions.likes') }}</div>
            <div class="text-sm theme-text-secondary">{{ t('profile.overview.actions.likesDesc', { count: userStats.likes }) }}</div>
          </div>
        </button>
        
        <button 
          @click="navigateToSection('bookmarks')"
          class="flex items-center gap-3 p-4 theme-bg-secondary hover:theme-bg-primary rounded-lg transition-colors text-left group"
        >
          <Icon icon="heroicons:bookmark" class="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
          <div>
            <div class="font-medium theme-text-primary">{{ t('profile.overview.actions.bookmarks') }}</div>
            <div class="text-sm theme-text-secondary">{{ t('profile.overview.actions.bookmarksDesc', { count: userStats.bookmarks }) }}</div>
          </div>
        </button>
        
        <button 
          @click="navigateToSection('user-info')"
          class="flex items-center gap-3 p-4 theme-bg-secondary hover:theme-bg-primary rounded-lg transition-colors text-left group"
        >
          <Icon icon="heroicons:user" class="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
          <div>
            <div class="font-medium theme-text-primary">Profil Düzenle</div>
            <div class="text-sm theme-text-secondary">Kişisel bilgilerinizi güncelleyin</div>
          </div>
        </button>
        
        <button 
          @click="navigateToSection('change-password')"
          class="flex items-center gap-3 p-4 theme-bg-secondary hover:theme-bg-primary rounded-lg transition-colors text-left group"
        >
          <Icon icon="heroicons:key" class="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
          <div>
            <div class="font-medium theme-text-primary">Şifre Değiştir</div>
            <div class="text-sm theme-text-secondary">Hesap güvenliğinizi koruyun</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Account Status -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
        <Icon icon="heroicons:shield-check" class="w-5 h-5" />
        Hesap Durumu
      </h3>
      
      <div class="space-y-3">
        <!-- Email Verification -->
        <div class="flex items-center justify-between p-3 theme-bg-secondary rounded-lg">
          <div class="flex items-center gap-3">
            <Icon 
              :icon="userInfo.isVerified ? 'heroicons:check-circle' : 'heroicons:exclamation-circle'" 
              :class="userInfo.isVerified ? 'text-green-500' : 'text-yellow-500'"
              class="w-5 h-5"
            />
            <div>
              <div class="font-medium theme-text-primary">E-posta Doğrulama</div>
              <div class="text-sm theme-text-secondary">
                {{ userInfo.isVerified ? 'Doğrulandı' : 'Beklemede' }}
              </div>
            </div>
          </div>
          <button 
            v-if="!userInfo.isVerified"
            @click="sendVerificationEmail"
            class="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            Doğrula
          </button>
        </div>
        
        <!-- Two-Factor Authentication -->
        <div class="flex items-center justify-between p-3 theme-bg-secondary rounded-lg">
          <div class="flex items-center gap-3">
            <Icon 
              icon="heroicons:lock-closed" 
              class="w-5 h-5 text-gray-500"
            />
            <div>
              <div class="font-medium theme-text-primary">İki Faktörlü Doğrulama</div>
              <div class="text-sm theme-text-secondary">Devre dışı</div>
            </div>
          </div>
          <button 
            @click="setupTwoFactor"
            class="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-1 rounded transition-colors"
          >
            Etkinleştir
          </button>
        </div>
        
        <!-- Last Login -->
        <div class="flex items-center gap-3 p-3 theme-bg-secondary rounded-lg">
          <Icon icon="heroicons:clock" class="w-5 h-5 text-gray-500" />
          <div>
            <div class="font-medium theme-text-primary">Son Giriş</div>
            <div class="text-sm theme-text-secondary">Bugün, 14:30</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Actions -->
    <div v-if="!userInfo.isVerified" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <div class="flex items-start gap-3">
        <Icon icon="heroicons:lightbulb" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-medium text-blue-700 dark:text-blue-300 mb-1">Önerilen İşlemler</h4>
          <p class="text-sm text-blue-600 dark:text-blue-400 mb-3">
            Hesabınızı güvenli tutmak için şu adımları tamamlayın:
          </p>
          <ul class="space-y-1 text-sm text-blue-600 dark:text-blue-400">
            <li>• E-posta adresinizi doğrulayın</li>
            <li>• Güçlü bir şifre belirleyin</li>
            <li>• İki faktörlü doğrulamayı etkinleştirin</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  },
  userStats: {
    type: Object,
    required: true
  },
  recentActivities: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['navigate-to-section'])

// Methods
const navigateToSection = (section) => {
  emit('navigate-to-section', section)
}

const getActivityIcon = (type) => {
  const icons = {
    like: 'heroicons:heart',
    bookmark: 'heroicons:bookmark',
    comment: 'heroicons:chat-bubble-left',
    share: 'heroicons:share'
  }
  return icons[type] || 'heroicons:information-circle'
}

const getActivityColor = (type) => {
  const colors = {
    like: 'text-red-500',
    bookmark: 'text-blue-500',
    comment: 'text-green-500',
    share: 'text-purple-500'
  }
  return colors[type] || 'text-gray-500'
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Az önce'
  if (diffHours < 24) return `${diffHours} saat önce`
  
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return 'Dün'
  if (diffDays < 7) return `${diffDays} gün önce`
  
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short'
  })
}

const sendVerificationEmail = () => {
  alert('Doğrulama e-postası gönderildi!')
}

const setupTwoFactor = () => {
  navigateToSection('change-password')
}
</script>

<style scoped>
@media (max-width: 768px) {
  .profile-overview {
    padding: 1rem;
  }
}
</style>