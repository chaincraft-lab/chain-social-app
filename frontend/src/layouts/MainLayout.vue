<template>
  <div class="min-h-screen flex flex-col  theme-text-primary relative">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1 theme-bg-primary pb-2 md:pb-0">
      <!-- Full Width Layout for Profile Page -->
      <div v-if="isProfilePage" class="w-full">
        <router-view />
      </div>
      
      <!-- Category Page Layout (Custom Layout) -->
      <div v-else-if="isCategoryPage" class="container mx-auto px-4 md:px-6">
        <div class="grid grid-cols-12 gap-6 py-8">
          <!-- Left Side - Category Card -->
          <div class="col-span-12 lg:col-span-4">
            <div class="sticky top-8">
              <router-view name="categoryCard" />
            </div>
          </div>

          <!-- Right Side - News Feed -->
          <div class="col-span-12 lg:col-span-8">
            <router-view />
          </div>
        </div>
      </div>
      
      <!-- Standard Layout with Sidebars -->
      <div v-else class="container mx-auto px-4 md:px-6">
        <div class="grid grid-cols-12 gap-6 py-8">
          <!-- Left Sidebar - Hidden on Mobile -->
          <div class="col-span-12 lg:col-span-3 hidden lg:block">
              <Sidebar
                position="left"
                :showPopular="false"
                :showAds="false"
                :showNewsletter="false"
              />
          </div>

          <!-- Main Content -->
          <div class="col-span-12 lg:col-span-6">
            <router-view />
          </div>

          <!-- Right Sidebar - Hidden on Mobile -->
          <div class="col-span-12 lg:col-span-3 hidden lg:block">
            <Sidebar
              position="right"
              :showCategories="false"
              :showTags="false"
              :showNewsletter="false"
              :showWeather="true"
              :showMarket="true"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
    
    <!-- Bottom Navigation - Mobile Only -->
    <BottomNavigation />
  </div>
</template>

<script>
import Navbar from "@/components/layout/Navbar.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Footer from "@/components/layout/Footer.vue";
import BottomNavigation from "@/components/layout/BottomNavigation.vue";

export default {
  name: "MainLayout",
  components: {
    Navbar,
    Sidebar,
    Footer,
    BottomNavigation,
  },
  computed: {
    isProfilePage() {
      return this.$route.name === 'profile'
    },
    isCategoryPage() {
      return this.$route.name === 'category' || this.$route.name === 'subcategory'
    }
  },
  mounted() {
    // Fetch initial data when layout is mounted
    this.$store.dispatch("fetchInitialData");
  },
};
</script>

<style scoped>

</style> 