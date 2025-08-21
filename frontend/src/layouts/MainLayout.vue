<template>
  <div class="min-h-screen flex flex-col theme-bg-primary theme-text-primary">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1 theme-bg-secondary">
      <div class="container mx-auto px-4">
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
/* Any additional styling specific to the layout */
</style> 