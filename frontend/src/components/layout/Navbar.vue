<template>
  <!-- New Clean & Modern Navbar -->
  <nav class="sticky top-0 z-[9999] theme-navbar ">
    <!-- Top Section -->
    <NavbarTop
      :is-mobile-menu-open="isMobileMenuOpen"
      @toggleMobile="toggleMobileMenu"
      @closeMobile="handleCloseMobile"
    />

    <!-- Menu Section -->
    <NavbarMenu
      :is-mobile-menu-open="isMobileMenuOpen"
      @closeMobile="handleCloseMobile"
    />
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavbarTop from './NavbarTop.vue'
import NavbarMenu from './NavbarMenu.vue'

// State
const isMobileMenuOpen = ref(false)
const navbarTop = ref(null)

// Methods
const handleCloseMobile = () => {
  isMobileMenuOpen.value = false
}

// Watch for mobile menu toggle from NavbarTop
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<style scoped>
/* Clean minimal styles for new navbar */
</style>