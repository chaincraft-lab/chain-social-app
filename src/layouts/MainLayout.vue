<template>
  <div class="min-h-screen flex flex-col bg-light-50">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main Content -->
    <main class="flex-grow py-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Sidebar - Hidden on Mobile -->
          <div class="hidden lg:block lg:col-span-3">
            <Sidebar position="left" :showAds="false" :showNewsletter="false" />
          </div>
          
          <!-- Main Content -->
          <div class="lg:col-span-6">
            <router-view />
          </div>
          
          <!-- Right Sidebar - Hidden on Mobile -->
          <div class="hidden lg:block lg:col-span-3">
            <Sidebar position="right" :showCategories="false" />
          </div>
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'MainLayout',
  components: {
    Navbar,
    Sidebar,
    Footer
  },
  mounted() {
    // Fetch initial data when layout is mounted
    this.$store.dispatch('fetchInitialData')
  }
}
</script>

<style scoped>
/* Any additional styling specific to the layout */
</style> 