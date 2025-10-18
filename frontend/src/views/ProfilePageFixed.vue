<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
          <!-- Profile Avatar -->
          <div class="relative">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-500 shadow-lg">
              <img 
                :src="userInfo.avatar || defaultAvatar" 
                :alt="userInfo.name"
                class="w-full h-full object-cover"
                @error="handleAvatarError"
              />
            </div>
            <button 
              @click="showAvatarUpload = true"
              class="absolute bottom-0 right-0 w-8 h-8 bg-primary hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
            >
              <Icon icon="heroicons:camera" class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Profile Info -->
          <div class="flex-1">
            <h1 class="text-2xl md:text-3xl font-bold text-white dark:text-gray-100 mb-2">{{ userInfo.name }}</h1>
            <p class="text-gray-200 dark:text-gray-300 mb-3">{{ userInfo.email }}</p>
            <div class="flex flex-wrap gap-4 text-sm text-gray-200 dark:text-gray-300">
              <div class="flex items-center gap-1">
                <Icon icon="heroicons:calendar" class="w-4 h-4" />
                <span>{{ formatJoinDate(userInfo.joinDate) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon icon="heroicons:heart" class="w-4 h-4" />
                <span>{{ userStats.likes }} beğeni</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon icon="heroicons:bookmark" class="w-4 h-4" />
                <span>{{ userStats.bookmarks }} kayıt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <!-- Sidebar Menu -->
          <div class="lg:col-span-1">
            <ProfileSidebar 
              :active-section="activeSection"
              @section-change="handleSectionChange"
            />
          </div>
          
          <!-- Main Content -->
          <div class="lg:col-span-4">
            <div class="profile-main-content">
              <!-- Default/Overview Section -->
              <div class="p-6">
                <h2 class="text-2xl font-bold text-text-primary mb-4">Hoş geldin, {{ userInfo.name }}! 👋</h2>
                <p class="text-text-secondary mb-6">Profil aktivitelerinin ve istatistiklerinin özeti</p>
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center p-4 bg-bg-secondary border border-border-primary rounded-lg hover:shadow-md transition-all">
                    <Icon icon="heroicons:heart" class="w-8 h-8 mx-auto mb-2 text-error" />
                    <div class="text-2xl font-bold text-text-primary">{{ userStats.likes }}</div>
                    <div class="text-sm text-text-secondary">Beğeni</div>
                  </div>
                  
                  <div class="text-center p-4 bg-bg-secondary border border-border-primary rounded-lg hover:shadow-md transition-all">
                    <Icon icon="heroicons:bookmark" class="w-8 h-8 mx-auto mb-2 text-info" />
                    <div class="text-2xl font-bold text-text-primary">{{ userStats.bookmarks }}</div>
                    <div class="text-sm text-text-secondary">Kayıt</div>
                  </div>
                  
                  <div class="text-center p-4 bg-bg-secondary border border-border-primary rounded-lg hover:shadow-md transition-all">
                    <Icon icon="heroicons:chat-bubble-left" class="w-8 h-8 mx-auto mb-2 text-success" />
                    <div class="text-2xl font-bold text-text-primary">{{ userStats.comments }}</div>
                    <div class="text-sm text-text-secondary">Yorum</div>
                  </div>
                  
                  <div class="text-center p-4 bg-bg-secondary border border-border-primary rounded-lg hover:shadow-md transition-all">
                    <Icon icon="heroicons:share" class="w-8 h-8 mx-auto mb-2 text-accent" />
                    <div class="text-2xl font-bold text-text-primary">{{ userStats.shares }}</div>
                    <div class="text-sm text-text-secondary">Paylaşım</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileSidebar from '@/components/ui/Profile/ProfileSidebar.vue'

export default {
  name: 'ProfilePageFixed',
  components: {
    ProfileSidebar
  },
  data() {
    return {
      activeSection: 'overview',
      showAvatarUpload: false,
      userInfo: {
        id: 1,
        name: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@email.com',
        avatar: null,
        bio: 'Teknoloji ve savunma sanayi ile ilgili haberleri takip ediyorum.',
        phone: '+90 555 123 45 67',
        location: 'Ankara, Türkiye',
        joinDate: '2023-01-15',
        isVerified: false
      },
      userStats: {
        likes: 127,
        bookmarks: 45,
        comments: 89,
        shares: 23
      }
    }
  },
  computed: {
    defaultAvatar() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userInfo.name)}&size=128&background=6366f1&color=ffffff`
    }
  },
  methods: {
    handleSectionChange(section) {
      this.activeSection = section
      console.log('Section changed to:', section)
    },
    handleAvatarError(event) {
      event.target.src = this.defaultAvatar
    },
    formatJoinDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long' 
      }) + ' tarihinden beri üye'
    }
  },
  mounted() {
    console.log('ProfilePageFixed mounted successfully!')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.profile-header {
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  position: relative;
  color: var(--color-text-inverse);
  transition: background 0.3s ease;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.profile-header > * {
  position: relative;
  z-index: 1;
}

.profile-content {
  flex: 1;
  background: var(--color-bg-secondary);
  transition: background-color 0.3s ease;
}

.profile-main-content {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.75rem;
  box-shadow: 0 7px 14px 0 rgba(65, 69, 88, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  min-height: 600px;
  transition: all 0.3s ease;
}

.container {
  max-width: 1400px;
}

@media (max-width: 768px) {
  .profile-header {
    text-align: center;
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .profile-content .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

@media (max-width: 1024px) {
  .profile-content .grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Dark theme specific styles */
.dark .profile-header {
  background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%);
}
</style>