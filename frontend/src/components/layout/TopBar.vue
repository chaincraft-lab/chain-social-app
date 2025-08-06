<template>
  <header class="bg-primary text-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="@/assets/logo.png" alt="Logo" class="h-8 w-auto mr-2">
            <span class="font-bold text-xl">Haber Sitesi</span>
          </router-link>
        </div>
        
        <!-- Navigation -->
        <nav class="hidden md:flex space-x-4">
          <router-link 
            v-for="category in (categories || []).slice(0, 5)" 
            :key="category?.id || Math.random()" 
            :to="{ name: 'category', params: { slug: category.slug }}"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
          >
            {{ category.name }}
          </router-link>
        </nav>
        
        <!-- Search and Mobile Menu -->
        <div class="flex items-center">
          <!-- Search -->
          <div class="relative mr-2">
            <input 
              type="text" 
              placeholder="Ara..." 
              class="bg-white/20 rounded-full py-1 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
          </div>
          
          <!-- Mobile menu button -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden p-2 rounded-md hover:bg-primary-dark focus:outline-none"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden py-2">
        <router-link 
          v-for="category in (categories || [])" 
          :key="category?.id || Math.random()" 
          :to="{ name: 'category', params: { slug: category.slug }}"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark"
          @click="isMobileMenuOpen = false"
        >
          {{ category.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TopBar',
  setup() {
    const store = useStore()
    const isMobileMenuOpen = ref(false)
    
    const categories = computed(() => store.state.categories.categories || [])
    
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }
    
    return {
      categories,
      isMobileMenuOpen,
      toggleMobileMenu
    }
  }
}
</script> 