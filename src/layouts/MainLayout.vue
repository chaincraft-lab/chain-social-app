<template>
  <div>
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main Content -->
    <v-main>
      <v-container fluid class="py-6">
        <v-row>
          <!-- Left Sidebar - Hidden on Mobile -->
          <v-col cols="12" lg="3" class="d-none d-lg-block">
            <Sidebar position="left" :showAds="false" :showNewsletter="false" />
          </v-col>
          
          <!-- Main Content -->
          <v-col cols="12" lg="6">
            <router-view />
          </v-col>
          
          <!-- Right Sidebar - Hidden on Mobile -->
          <v-col cols="12" lg="3" class="d-none d-lg-block">
            <Sidebar position="right" :showCategories="false" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    
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