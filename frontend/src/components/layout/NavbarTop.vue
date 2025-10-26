<template>
  <!-- Top navbar with logo, search, auth -->
  <div class="border-b theme-border-primary">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
    <!-- Logo -->
    <router-link to="/" class="flex items-center">
      <div class="logo-container">
        <Icon icon="heroicons:fire" class="logo-icon" />
      </div>
    </router-link>

    <!-- Search Box - Desktop -->
    <div class="hidden md:block flex-1 max-w-lg mx-8">
      <SearchBox
        v-model="searchQuery"
        :placeholder="$t('navigation.search.newsPlaceholder')"
        @search="handleSearch"
      />
    </div>

    <!-- Right Actions -->
    <div class="flex items-center space-x-4">
      <!-- Language & Theme Controls -->
      <div class="hidden md:flex items-center space-x-2">
        <LanguageSelector @languageChanged="handleLanguageChange" />
        <ThemeToggle />
      </div>

      <!-- Auth Section -->
      <div class="flex items-center space-x-3">
        <!-- Authenticated User -->
        <UserProfile
          v-if="isAuthenticated"
          :user="currentUser"
          @logout="handleLogout"
        />

        <!-- Non-authenticated User -->
        <AuthButton
          v-else
          @login="showAuthDialog = true"
        />
      </div>

      <!-- Mobile Menu Button -->
      <MobileMenuButton
        class="md:hidden"
        :is-open="props.isMobileMenuOpen"
        @toggle="emit('toggleMobile')"
      />
    </div>

        <!-- Auth Dialog - Teleport to body to avoid z-index issues -->
        <Teleport to="body">
          <AuthDialog v-model="showAuthDialog" @success="handleAuthSuccess" />
        </Teleport>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SearchBox from '@/components/ui/Navigation/SearchBox.vue'
import ThemeToggle from '@/components/ui/Navigation/ThemeToggle.vue'
import LanguageSelector from '@/components/ui/Navigation/LanguageSelector.vue'
import UserProfile from '@/components/ui/Navigation/UserProfile.vue'
import AuthButton from '@/components/ui/Navigation/AuthButton.vue'
import MobileMenuButton from '@/components/ui/Navigation/MobileMenuButton.vue'
import AuthDialog from '@/components/auth/AuthDialog.vue'

const router = useRouter()
const store = useStore()

// Props
const props = defineProps({
  isMobileMenuOpen: { type: Boolean, default: false }
})

// Emits
const emit = defineEmits(['toggleMobile', 'closeMobile'])

// State
const searchQuery = ref('')
const showAuthDialog = ref(false)

// Computed
const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])
const currentUser = computed(() => store.getters['user/getCurrentUser'])

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const handleAuthSuccess = (type) => {
  showAuthDialog.value = false
  console.log('Auth success:', type)
}

const handleLogout = async () => {
  try {
    await store.dispatch('user/logout')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const handleLanguageChange = (language) => {
  console.log('Language changed to:', language.code)
}

</script>

<style scoped>
.logo-container {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.logo-container:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: white;
}
</style>