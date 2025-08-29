<template>
  <!-- Unique Pill-style Navigation -->
  <div class="relative px-6 py-4 theme-bg-secondary">
    <!-- Desktop Menu - Horizontal Pills -->
    <div class="hidden md:flex items-center justify-center">
      <div class="flex items-center space-x-2 theme-bg-primary rounded-full p-1.5 shadow-lg">
        <router-link
          v-for="item in menuItems"
          :key="item.slug"
          :to="{ name: 'category', params: { slug: item.slug } }"
          class="menu-pill theme-text-secondary hover:theme-text-primary hover:theme-bg-tertiary group"
          :class="{ 'active': isActive(item.slug) }"
        >
          <Icon :icon="item.icon" class="w-4 h-4 mr-2" />
          <span class="text-sm font-medium">{{ item.title }}</span>
        </router-link>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Teleport to="body">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-[10000] md:hidden"
        @click="closeMobileMenu"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 theme-bg-backdrop backdrop-blur-sm"></div>
        
        <!-- Mobile Menu Panel -->
        <div class="relative z-10 h-full w-80 max-w-sm theme-bg-primary shadow-xl transform transition-transform duration-300 ease-out">
          <!-- Mobile Header -->
          <div class="flex items-center justify-between p-6 border-b theme-border-primary">
            <h2 class="text-lg font-semibold theme-text-primary">Kategoriler</h2>
            <button
              @click="closeMobileMenu"
              class="p-2 rounded-full hover:theme-bg-secondary theme-text-secondary"
            >
              <Icon icon="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>

          <!-- Mobile Menu Items -->
          <div class="p-4 space-y-2">
            <router-link
              v-for="item in menuItems"
              :key="item.slug"
              :to="{ name: 'category', params: { slug: item.slug } }"
              class="mobile-menu-item theme-text-primary hover:theme-bg-secondary"
              :class="{ 'active': isActive(item.slug) }"
              @click="closeMobileMenu"
            >
              <Icon :icon="item.icon" class="w-5 h-5" />
              <span class="font-medium">{{ item.title }}</span>
            </router-link>
          </div>

          <!-- Mobile Search -->
          <div class="p-4 border-t theme-border-primary">
            <SearchBox
              v-model="mobileSearchQuery"
              placeholder="Kategori ara..."
              @search="handleMobileSearch"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MENU_ITEMS } from '@/constants/menu'
import SearchBox from '@/components/ui/Navigation/SearchBox.vue'

const route = useRoute()
const router = useRouter()

// Props
const props = defineProps({
  isMobileMenuOpen: { type: Boolean, default: false }
})

// Emits
const emit = defineEmits(['closeMobile'])

// State
const menuItems = MENU_ITEMS
const mobileSearchQuery = ref('')

// Methods
const isActive = (slug) => {
  return route.params.slug === slug
}

const closeMobileMenu = () => {
  emit('closeMobile')
}

const handleMobileSearch = () => {
  if (mobileSearchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: mobileSearchQuery.value.trim() }
    })
    closeMobileMenu()
  }
}
</script>

<style scoped>
/* Desktop Menu Pills */
.menu-pill {
  display: flex;
  align-items: center;
  padding: 0.625rem 1rem;
  border-radius: 9999px;
  transition: all 0.2s;
  transform: scale(1);
}

.menu-pill:hover {
  transform: scale(1.05);
}

.menu-pill.active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.menu-pill.active:hover {
  background: var(--color-primary-dark);
}

/* Mobile Menu Items */
.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  transform: scale(1);
}

.mobile-menu-item:hover {
  transform: scale(1.02);
}

.mobile-menu-item.active {
  background: var(--color-primary);
  color: white;
}

/* Mobile Menu Animation */
@media (max-width: 768px) {
  .mobile-menu-panel {
    animation: slideInLeft 0.3s ease-out;
  }
  
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
}
</style>