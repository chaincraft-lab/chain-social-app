<template>
  <aside class="w-full">
    <!-- Categories -->
    <!-- <div v-if="showCategories" class="bg-white rounded-lg shadow-sm mb-6">
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
    </div> -->

    <VuetifyCategories
      v-if="showCategories"
      :categories="categories"
    />

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
    <div v-if="showTags" class="modern-tags-card">
      <div class="tags-header">
        <div class="tags-header-content">
          <v-icon class="mr-2" color="purple" size="small">mdi-tag-multiple</v-icon>
          <h3 class="tags-title">Popüler Etiketler</h3>
        </div>
        <div class="tags-decoration"></div>
      </div>
      <div class="tags-content">
        <!-- Loading State -->
        <div v-if="isTagsLoading" class="tags-loading">
          <div v-for="i in 6" :key="i" class="tag-skeleton" :style="{ width: Math.random() * 60 + 80 + 'px' }"></div>
        </div>
        
        <!-- Tags List -->
        <div v-else-if="tags.length > 0" class="tags-grid">
          <router-link
            v-for="(tag, index) in tags"
            :key="tag.id"
            :to="{ name: 'tag', params: { slug: tag.slug } }"
            class="modern-tag-chip"
            :style="{ animationDelay: index * 100 + 'ms' }"
          >
            <v-icon size="x-small" class="mr-1">mdi-tag</v-icon>
            {{ tag.name }}
          </router-link>
        </div>
        
        <!-- Empty State -->
        <div v-else class="tags-empty-state">
          <v-icon size="large" color="grey-lighten-2">mdi-tag-off</v-icon>
          <p class="empty-text">Henüz etiket bulunmuyor</p>
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
import VuetifyCategories from "../ui/VuetifyCategories.vue";

export default {
  name: "SiteSidebar",
  components: {
    VuetifyCategories,
  },
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
    };
  },
  computed: {
    ...mapState("categories", ["categories"]),
    ...mapState("news", ["popularNews"]),
    ...mapState("tags", ["popularTags"]),
    ...mapState("advertisements", ["advertisements"]),
    
    tags() {
      return this.popularTags || []
    },
    
    isTagsLoading() {
      return this.$store.getters['tags/isLoading']('popular')
    }
  },
  
  mounted() {
    // Sidebar mount olduğunda popüler tag'leri çek
    if (this.showTags && (!this.popularTags || this.popularTags.length === 0)) {
      this.$store.dispatch('tags/fetchPopularTags', 10)
    }
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

<style scoped>
/* Modern Tags Card */
.modern-tags-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(156, 39, 176, 0.1);
}

.tags-header {
  position: relative;
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
  padding: 1rem 1.25rem;
}

.tags-header-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
}

.tags-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.tags-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="tagPattern" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="7.5" cy="7.5" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23tagPattern)"/></svg>');
  opacity: 0.3;
}

.tags-content {
  padding: 1.25rem;
}

/* Loading State */
.tags-loading {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-skeleton {
  height: 32px;
  background: linear-gradient(
    90deg,
    #f3e5f5 25%,
    #e1bee7 50%,
    #f3e5f5 75%
  );
  background-size: 200% 100%;
  border-radius: 16px;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Tags Grid */
.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.modern-tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%);
  color: #673ab7;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid rgba(156, 39, 176, 0.2);
  transition: all 0.3s ease;
  animation: fadeInUp 0.4s ease-out both;
}

.modern-tag-chip:hover {
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
}

.modern-tag-chip:active {
  transform: translateY(-1px);
}

/* Empty State */
.tags-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
}

.empty-text {
  margin: 0.75rem 0 0 0;
  font-size: 0.875rem;
  color: #9e9e9e;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modern-tags-card {
    margin-bottom: 1rem;
  }
  
  .tags-header {
    padding: 0.875rem 1rem;
  }
  
  .tags-content {
    padding: 1rem;
  }
  
  .tags-grid {
    gap: 0.5rem;
  }
  
  .modern-tag-chip {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style> 