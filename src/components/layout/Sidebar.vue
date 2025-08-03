<template>
  <aside class="w-full">
    <!-- Categories -->
    <div v-if="showCategories" class="bg-white rounded-lg shadow-sm mb-6">
      <div class="border-b border-light-200 px-5 py-3">
        <h3 class="text-lg font-semibold text-dark">Kategoriler</h3>
      </div>
      <div class="p-3">
        <ul class="divide-y divide-light-200">
          <li v-for="category in categories" :key="category.id">
            <router-link
              :to="{ name: 'category', params: { slug: category.slug } }"
              class="block px-2 py-2.5 text-dark hover:text-primary transition-colors"
              active-class="text-primary font-medium"
            >
              {{ category.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Popular News -->
    <div v-if="showPopular" class="bg-white rounded-lg shadow-sm mb-6">
      <div class="border-b border-light-200 px-5 py-3">
        <h3 class="text-lg font-semibold text-dark">Popüler Haberler</h3>
      </div>
      <div class="p-3">
        <ul class="divide-y divide-light-200">
          <li v-for="(news, index) in popularNews" :key="news.id" class="py-3">
            <router-link
              :to="{ name: 'article', params: { slug: news.id } }"
              class="flex items-start gap-3 group"
            >
              <div
                class="flex-shrink-0 w-16 h-16 bg-light-100 rounded overflow-hidden"
              >
                <img
                  :src="news.image"
                  :alt="news.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-grow">
                <span class="text-xs text-primary">{{
                  formatDate(news.date)
                }}</span>
                <h4
                  class="text-sm font-medium text-dark group-hover:text-primary transition-colors line-clamp-2"
                >
                  {{ news.title }}
                </h4>
              </div>
              <div
                class="flex-shrink-0 w-8 h-8 bg-light-100 rounded-full flex items-center justify-center text-sm font-semibold text-primary"
              >
                {{ index + 1 }}
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Advertisement -->
    <div v-if="showAds" class="bg-white rounded-lg shadow-sm mb-6">
      <div class="border-b border-light-200 px-5 py-3">
        <h3 class="text-lg font-semibold text-dark">Sponsorlu</h3>
      </div>
      <div class="p-3">
        <!-- First Ad -->
        <div class="mb-4">
          <a href="#" target="_blank" class="block">
            <img
              src="@/assets/reklam/reklam_1.jpeg"
              alt="Savunma Sanayii Reklamı"
              class="w-full rounded"
            />
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>

        <!-- Second Ad -->
        <div class="mb-4">
          <a href="#" target="_blank" class="block">
            <img
              src="@/assets/reklam/reklam_2.jpg"
              alt="Savunma Sanayii Reklamı"
              class="w-full rounded"
            />
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>

        <!-- Third Ad - Only visible on larger screens -->
        <div class="mb-4">
          <a href="#" target="_blank" class="block">
            <img
              src="@/assets/reklam/reklam_3.jpg"
              alt="Savunma Sanayii Reklamı"
              class="w-full rounded"
            />
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="showTags" class="bg-white rounded-lg shadow-sm mb-6">
      <div class="border-b border-light-200 px-5 py-3">
        <h3 class="text-lg font-semibold text-dark">Etiketler</h3>
      </div>
      <div class="p-4">
        <div class="flex flex-wrap gap-2">
          <a
            v-for="tag in tags"
            :key="tag.id"
            href="#"
            class="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full text-sm transition-colors"
          >
            {{ tag.name }}
          </a>
        </div>
      </div>
    </div>

    <!-- Newsletter -->
    <div
      v-if="showNewsletter"
      class="bg-primary rounded-lg shadow-sm mb-6 text-white"
    >
      <div class="p-5">
        <h3 class="text-lg font-semibold mb-2">Bültenimize Abone Olun</h3>
        <p class="text-sm mb-4 text-white/80">
          En son haberlerden haberdar olmak için bültenimize abone olun.
        </p>
        <form @submit.prevent="subscribeNewsletter" class="mt-4">
          <div class="mb-3">
            <input
              type="email"
              v-model="email"
              placeholder="E-posta adresiniz"
              class="w-full px-4 py-2 text-dark rounded-md focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-white text-primary hover:bg-light-100 px-4 py-2 rounded-md focus:outline-none transition-colors"
          >
            Abone Ol
          </button>
        </form>
      </div>
    </div>

    <slot></slot>
  </aside>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SiteSidebar",
  props: {
    showCategories: {
      type: Boolean,
      default: true,
    },
    showPopular: {
      type: Boolean,
      default: true,
    },
    showAds: {
      type: Boolean,
      default: true,
    },
    showTags: {
      type: Boolean,
      default: true,
    },
    showNewsletter: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: "right",
      validator: (value) => ["left", "right"].includes(value),
    },
  },
  data() {
    return {
      email: "",
      tags: [
        { id: 1, name: "Politika" },
        { id: 2, name: "Ekonomi" },
        { id: 3, name: "Spor" },
        { id: 4, name: "Teknoloji" },
        { id: 5, name: "Sağlık" },
        { id: 6, name: "Eğitim" },
        { id: 7, name: "Dünya" },
        { id: 8, name: "Yaşam" },
      ],
    };
  },
  computed: {
    ...mapState("categories", ["categories"]),
    ...mapState("news", ["popularNews"]),
    ...mapState("advertisements", ["advertisements"]),
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      });
    },
    subscribeNewsletter() {
      // Burada e-posta aboneliği işlemi yapılacak
      alert(`${this.email} adresi bültene kaydedildi!`);
      this.email = "";
    },
  },
};
</script> 