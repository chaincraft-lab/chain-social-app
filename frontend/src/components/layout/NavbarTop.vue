<template>
  <!-- Top navbar with logo, search, auth -->
  <div class="border-b theme-border-primary">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
    <!-- Logo -->
    <router-link to="/" class="flex items-center">
      <img src="@/assets/logo.png" alt="Logo" class="h-12" />
    </router-link>

    <!-- Search Box - Desktop -->
    <div class="hidden md:block flex-1 max-w-lg mx-8">
      <SearchBox
        v-model="searchQuery"
        placeholder="Haber ara..."
        @search="handleSearch"
      />
    </div>

    <!-- Right Actions -->
    <div class="flex items-center space-x-4">
      <!-- Theme Toggle -->
      <ThemeToggle class="hidden md:block" />

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

</script>