<template>
  <div class="min-h-screen flex flex-col  theme-text-primary relative">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1 theme-bg-primary">
      <div class="container mx-auto px-1">
        <div class="grid grid-cols-12 gap-6 py-6">
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
  </div>
</template>

<script>
import Navbar from "@/components/layout/Navbar.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Footer from "@/components/layout/Footer.vue";

export default {
  name: "MainLayout",
  components: {
    Navbar,
    Sidebar,
    Footer,
  },
  mounted() {
    // Fetch initial data when layout is mounted
    this.$store.dispatch("fetchInitialData");
  },
};
</script>

<style scoped>

</style> 