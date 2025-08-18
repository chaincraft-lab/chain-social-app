<template>
  <div class="category-page">
    <!-- Posts Feed -->
    <div class="posts-feed">
      <!-- Loading State -->
      <LoadingSpinner
        v-if="isLoading"
        size="lg"
        text="Kategori haberleri yükleniyor..."
        :fullScreen="false"
      />

      <!-- Category Posts -->
      <div v-else class="posts-container">
        <NewsPost
          v-for="news in categoryNews"
          :key="news?.id || Math.random()"
          :news="news"
        />

        <!-- Load More Button -->
        <LoadMoreButton
          :has-more="hasMorePosts"
          :is-loading="loadingMore"
          :show-end-message="categoryNews.length > 0 && !hasMorePosts"
          button-text="Daha Fazla Yükle"
          end-message="Bu kategorideki tüm haberleri görüntülediniz"
          @loadMore="loadMorePosts"
        />

        <!-- No Posts Found -->
        <StateMessage
          v-if="categoryNews.length === 0"
          type="empty"
          title="Henüz haber yok"
          message="Bu kategoride henüz haber bulunmuyor"
          icon="mdi-newspaper-variant-outline"
          :show-button="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import NewsPost from "@/components/news/NewsPost.vue";
import StateMessage from "@/components/common/StateMessage.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import LoadMoreButton from "@/components/common/LoadMoreButton.vue";

export default {
  name: "CategoryPage",
  components: {
    NewsPost,
    StateMessage,
    LoadingSpinner,
    LoadMoreButton,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const displayedPostsCount = ref(10);
    const loadingMore = ref(false);

    const categories = computed(() => store.state.categories.categories || []);
    const currentCategory = computed(() => {
      const cats = categories.value;
      if (!Array.isArray(cats)) return null;
      return cats.find((c) => c && c.slug === route.params.slug) || null;
    });

    const allCategoryNews = computed(() => {
      return store.getters["news/getCategoryNews"](route.params.slug);
    });

    const categoryNews = computed(() => {
      return allCategoryNews.value.slice(0, displayedPostsCount.value);
    });

    const hasMorePosts = computed(() => {
      return allCategoryNews.value.length > displayedPostsCount.value;
    });

    const isLoading = computed(() =>
      store.getters["news/isLoading"]("category")
    );

    const loadCategoryNews = async () => {
      if (route.params.slug) {
        try {
          // Önce kategori bilgisini çek
          await store.dispatch(
            "categories/fetchCategoryBySlug",
            route.params.slug
          );

          // Sonra o kategoriye ait haberleri çek
          await store.dispatch("news/fetchCategoryNews", {
            categorySlug: route.params.slug,
            limit: 50, // Load more posts to enable pagination
          });
        } catch (error) {
          console.error("Error loading category data:", error);
        }
      }
    };

    const loadMorePosts = () => {
      loadingMore.value = true;

      // Simulate loading delay
      setTimeout(() => {
        displayedPostsCount.value += 10;
        loadingMore.value = false;
      }, 1000);
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    onMounted(() => {
      loadCategoryNews();
    });

    watch(
      () => route.params.slug,
      () => {
        displayedPostsCount.value = 10; // Reset pagination when category changes
        loadCategoryNews();
      }
    );

    return {
      currentCategory,
      categoryNews,
      hasMorePosts,
      isLoading,
      loadingMore,
      loadMorePosts,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* Category Page Layout */
.category-page {
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .category-page {
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .category-page {
    padding: 0 0.25rem;
  }
}
</style> 