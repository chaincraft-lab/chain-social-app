<template>
  <div class="tag-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <v-skeleton-loader type="card"></v-skeleton-loader>
      <v-skeleton-loader type="article" class="mb-4"></v-skeleton-loader>
      <v-skeleton-loader type="article" class="mb-4"></v-skeleton-loader>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <v-alert type="error" class="mb-4">
        {{ error }}
      </v-alert>
      <v-btn @click="loadTagData" color="primary"> Tekrar Dene </v-btn>
    </div>

    <!-- Tag Content -->
    <div v-else-if="currentTag">
      <!-- Posts Feed -->
      <div class="posts-feed">
        <!-- Loading State -->
        <div v-if="articlesLoading" class="loading-posts">
          <div v-for="i in 3" :key="i" class="loading-post">
            <div class="modern-loading-card">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full shimmer"
                ></div>
                <div class="flex flex-col gap-2">
                  <div
                    class="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full w-32 shimmer"
                  ></div>
                  <div
                    class="h-3 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full w-20 shimmer"
                  ></div>
                </div>
              </div>
              <div
                class="h-48 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl mb-4 shimmer"
              ></div>
              <div class="space-y-2">
                <div
                  class="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full shimmer"
                ></div>
                <div
                  class="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full w-3/4 shimmer"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tag Posts -->
        <div v-else class="posts-container">
          <NewsPost v-for="news in tagArticles" :key="news?.id" :news="news" />

          <!-- Load More Button -->
          <div class="load-more-section" v-if="hasMorePosts">
            <div class="modern-load-more-card">
              <v-btn
                color="secondary"
                variant="elevated"
                size="large"
                rounded="pill"
                @click="loadMorePosts"
                :loading="loadingMore"
                class="modern-btn"
              >
                <v-icon start>mdi-refresh</v-icon>
                Daha Fazla Yükle
              </v-btn>
            </div>
          </div>

          <!-- End of Feed -->
          <StateMessage 
            v-else-if="tagArticles.length > 0"
            type="success"
            title="Tüm makaleler yüklendi"
            message="Bu etiketle ilgili tüm makaleleri görüntülediniz"
            icon="mdi-check-circle"
          />

          <!-- No Posts Found -->
          <StateMessage 
            v-else
            type="empty"
            title="Henüz makale yok"
            message="Bu etiketle henüz makale bulunmuyor"
            icon="mdi-tag-outline"
            :show-button="true"
            button-color="secondary"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <v-icon size="large" color="grey">mdi-tag-remove</v-icon>
      <p class="text-gray-500 mt-4">Etiket bulunamadı</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import NewsPost from "@/components/news/NewsPost.vue";
import StateMessage from "@/components/ui/StateMessage.vue";

export default {
  name: "TagPage",
  components: {
    NewsPost,
    StateMessage,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const currentTag = ref(null);
    const tagArticles = ref([]);
    const displayedPostsCount = ref(10);
    const loadingMore = ref(false);
    const isLoading = ref(true);
    const articlesLoading = ref(false);
    const error = ref(null);

    const tagArticleCount = computed(() => {
      return tagArticles.value.length;
    });

    const displayedTagArticles = computed(() => {
      return tagArticles.value.slice(0, displayedPostsCount.value);
    });

    const hasMorePosts = computed(() => {
      // Tag endpoint'i şu anda pagination desteklemiyor, tüm articles'ı veriyor
      // Eğer backend'de pagination eklenirse burayı güncelleyebiliriz
      return false;
    });

    const loadTagData = async () => {
      try {
        isLoading.value = true;
        error.value = null;

        const slug = route.params.slug;

        // Tag bilgisini ve articles'ları aynı anda çek
        const tagData = await store.dispatch("tags/fetchTagBySlug", slug);
        currentTag.value = tagData;

        // Tag data'sından articles'ı al
        if (tagData && tagData.articles) {
          tagArticles.value = tagData.articles;
        } else {
          tagArticles.value = [];
        }
      } catch (err) {
        console.error("Error loading tag data:", err);
        error.value = "Etiket bilgileri yüklenirken hata oluştu";
      } finally {
        isLoading.value = false;
      }
    };

    const loadMorePosts = async () => {
      try {
        loadingMore.value = true;
        displayedPostsCount.value += 10;
        // Tag endpoint'i pagination desteklemiyorsa burada daha fazla veri çekmek gerekebilir
        // Şimdilik sadece counter'ı artırıyoruz
      } catch (err) {
        console.error("Error loading more posts:", err);
      } finally {
        loadingMore.value = false;
      }
    };

    onMounted(() => {
      loadTagData();
    });

    watch(
      () => route.params.slug,
      () => {
        displayedPostsCount.value = 10; // Reset pagination when tag changes
        currentTag.value = null;
        tagArticles.value = [];
        loadTagData();
      }
    );

    return {
      currentTag,
      tagArticles,
      tagArticleCount,
      hasMorePosts,
      isLoading,
      articlesLoading,
      loadingMore,
      error,
      loadTagData,
      loadMorePosts,
    };
  },
};
</script>

<style scoped>
/* Tag Page Layout */
.tag-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
  min-height: 100vh;
}

/* Posts Feed */
.posts-feed {
  margin-bottom: 2rem;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Modern Loading Cards */
.loading-posts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modern-loading-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(156, 39, 176, 0.08);
  border: 1px solid rgba(156, 39, 176, 0.05);
}

/* Shimmer Animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, #f3e5f5 25%, #e1bee7 37%, #f3e5f5 63%);
  background-size: 400px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Load More Section */
.load-more-section {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.modern-load-more-card {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(156, 39, 176, 0.15);
}

.modern-btn {
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
  transition: all 0.3s ease;
}

.modern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(156, 39, 176, 0.4);
}

/* Modern End States */
.modern-end-state,
.modern-empty-state {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.end-state-card,
.empty-state-card {
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px;
}

.empty-state-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.end-state-icon,
.empty-state-icon {
  margin-bottom: 1.5rem;
}

.end-state-title,
.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.end-state-text,
.empty-state-text {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .tag-page {
    padding: 0 0.5rem;
  }

  .tag-hero-card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .tag-title {
    font-size: 1.75rem;
  }

  .tag-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modern-load-more-card,
  .end-state-card,
  .empty-state-card {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .tag-page {
    padding: 0 0.25rem;
  }

  .tag-hero-card {
    padding: 1rem;
    border-radius: 16px;
  }

  .tag-title {
    font-size: 1.5rem;
  }

  .modern-loading-card {
    padding: 1rem;
  }
}

/* Animations */
.tag-hero-card {
  animation: slideInDown 0.6s ease-out;
}

.modern-loading-card {
  animation: fadeInUp 0.4s ease-out;
}

.end-state-card,
.empty-state-card {
  animation: bounceIn 0.6s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>