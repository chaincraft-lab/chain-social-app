<template>
  <div class="profile-sidebar">
    <!-- Mobile Menu Toggle -->
    <div class="lg:hidden mb-4">
      <button 
        @click="showMobileMenu = !showMobileMenu"
        class="w-full flex items-center justify-between p-3 bg-bg-primary border border-border-primary rounded-lg shadow-md"
      >
        <span class="font-medium text-text-primary">Profil Menüsü</span>
        <Icon 
          :icon="showMobileMenu ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
          class="w-5 h-5 text-text-secondary"
        />
      </button>
    </div>
    
    <!-- Menu Items -->
    <div 
      class="space-y-2"
      :class="{ 'hidden lg:block': !showMobileMenu }"
    >
      <div 
        v-for="item in menuItems" 
        :key="item.key"
        @click="selectSection(item.key)"
        class="menu-item"
        :class="{ 'active': activeSection === item.key }"
      >
        <Icon :icon="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
        <Icon 
          v-if="item.badge" 
          icon="heroicons:exclamation-circle" 
          class="w-4 h-4 text-error ml-auto"
        />
      </div>
    </div>
    
    
    <!-- Help Section -->
    <div class="hidden lg:block mt-6 p-4 bg-info-50 dark:bg-info-950 rounded-lg border border-info-200 dark:border-info-800">
      <div class="flex items-start gap-3">
        <Icon icon="heroicons:question-mark-circle" class="w-5 h-5 text-info-600 dark:text-info-400 flex-shrink-0 mt-0.5" />
        <div>
          <h5 class="font-medium text-sm text-info-700 dark:text-info-300 mb-1">Yardıma mı ihtiyacınız var?</h5>
          <p class="text-xs text-info-600 dark:text-info-400 mb-2">Profil ayarlarınızla ilgili sorularınız için destek ekibimizle iletişime geçin.</p>
          <button class="text-xs bg-info-600 hover:bg-info-700 text-white px-3 py-1 rounded-md transition-colors">
            Destek Al
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'

// Props
const props = defineProps({
  activeSection: {
    type: String,
    default: 'overview'
  }
})

// Emits
const emit = defineEmits(['section-change'])

// State
const showMobileMenu = ref(false)

// Menu items
const menuItems = ref([
  {
    key: 'overview',
    label: 'Genel Bakış',
    icon: 'heroicons:home',
    badge: false
  },
  // {
  //   key: 'likes',
  //   label: 'Beğendiklerim',
  //   icon: 'heroicons:heart',
  //   badge: false
  // },
  // {
  //   key: 'bookmarks',
  //   label: 'Kaydettiklerim',
  //   icon: 'heroicons:bookmark',
  //   badge: false
  // },
  {
    key: 'user-info',
    label: 'Kişisel Bilgiler',
    icon: 'heroicons:user',
    badge: false
  },
  {
    key: 'change-password',
    label: 'Şifre Değiştir',
    icon: 'heroicons:key',
    badge: false
  },
  {
    key: 'delete-account',
    label: 'Hesabı Sil',
    icon: 'heroicons:trash',
    badge: true
  }
])

// Methods
const selectSection = (section) => {
  emit('section-change', section)
  showMobileMenu.value = false // Close mobile menu after selection
}
</script>

<style scoped>
.profile-sidebar {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
  box-shadow: 0 7px 14px 0 rgba(65, 69, 88, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  padding: 1rem;
  transition: all 0.3s ease;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
}

.menu-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.menu-item.active {
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  color: var(--color-text-inverse);
}

.menu-item.active :deep(.iconify) {
  color: var(--color-text-inverse);
}

.menu-item span {
  font-weight: 500;
}

@media (max-width: 1024px) {
  .profile-sidebar {
    position: sticky;
    top: 1rem;
  }
}

/* Dark theme adjustments */
.dark .menu-item.active {
  background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%);
}
</style>