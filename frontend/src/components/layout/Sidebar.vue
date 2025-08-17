<template>
  <aside class="w-full">
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
              :to="{ name: 'article', params: { slug: news.slug } }"
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


    <!-- Tags -->
    <div v-if="showTags" class="tags-card">
      <div class="tags-header">
        <h3 class="tags-title">
          <v-icon size="small" class="mr-2" color="primary">mdi-tag-multiple</v-icon>
          Popüler Etiketler
        </h3>
      </div>
      <div class="tags-content">
        <!-- Loading State -->
        <div v-if="isTagsLoading" class="tags-loading">
          <div v-for="i in 6" :key="i" class="tag-skeleton" :style="{ width: Math.random() * 60 + 80 + 'px' }"></div>
        </div>
        
        <!-- Tags List -->
        <div v-else-if="tags.length > 0" class="tags-grid">
          <router-link
            v-for="tag in tags"
            :key="tag.id"
            :to="{ name: 'tag', params: { slug: tag.slug } }"
            class="tag-chip"
          >
            {{ tag.name }}
          </router-link>
        </div>
        
        <!-- Empty State -->
        <div v-else class="tags-empty-state">
          <v-icon size="small" color="grey-lighten-1">mdi-tag-outline</v-icon>
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
/* Simple Tags Card */
.tags-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.tags-header {
  padding: 1rem 1.25rem 0.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.tags-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
}

.tags-content {
  padding: 1rem 1.25rem 1.25rem;
}

/* Loading State */
.tags-loading {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-skeleton {
  height: 28px;
  background: linear-gradient(
    90deg,
    #f8f9fa 25%,
    #e9ecef 50%,
    #f8f9fa 75%
  );
  background-size: 200% 100%;
  border-radius: 14px;
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
  gap: 0.5rem;
}

.tag-chip {
  display: inline-block;
  padding: 0.4rem 0.75rem;
  background: #f8f9fa;
  color: #495057;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.tag-chip:hover {
  background: #800000;
  color: white;
  border-color: #800000;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(128, 0, 0, 0.2);
}

/* Empty State */
.tags-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  text-align: center;
}

.empty-text {
  margin: 0.5rem 0 0 0;
  font-size: 0.8rem;
  color: #9e9e9e;
}

/* Responsive */
@media (max-width: 768px) {
  .tags-card {
    margin-bottom: 1rem;
  }
  
  .tags-header {
    padding: 0.75rem 1rem 0.25rem;
  }
  
  .tags-content {
    padding: 0.75rem 1rem 1rem;
  }
  
  .tags-grid {
    gap: 0.4rem;
  }
  
  .tag-chip {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
}
</style> 