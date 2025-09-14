<template>
  <div class="category-page  theme-text-primary">
    <!-- Tags Navigation -->
    <CategoriesSlider 
      :categories="categoryTags"
      :is-loading="isLoading"
      mode="back"
      :back-title="currentCategory ? currentCategory.name : 'Kategori'"
      link-type="tag"
      @back="goBack"
    />

    <!-- Posts Feed -->
    <div class="posts-feed">

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4 mt-4">
        <SkeletonLoader v-for="i in 10" :key="i" type="news" />
      </div>

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
import { useRoute, useRouter } from "vue-router";
import NewsPost from "@/components/news/NewsPost.vue";
import StateMessage from "@/components/common/StateMessage.vue";
import SkeletonLoader from "@/components/common/SkeletonLoader.vue";
import LoadMoreButton from "@/components/common/LoadMoreButton.vue";
import CategoriesSlider from "@/components/ui/Categories/CategoriesSlider.vue";

export default {
  name: "CategoryPage",
  components: {
    NewsPost,
    StateMessage,
    SkeletonLoader,
    LoadMoreButton,
    CategoriesSlider,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const displayedPostsCount = ref(10);
    const loadingMore = ref(false);

    const categories = computed(() => store.state.categories.categories || []);
    const currentCategory = computed(() => {
      const cats = categories.value;
      if (!Array.isArray(cats)) return null;
      return cats.find((c) => c && c.slug === route.params.slug) || null;
    });

    const categoryTags = computed(() => {
      // Get all tags from posts in this category
      const categoryPosts = allCategoryNews.value || [];
      const tagMap = new Map();
      
      categoryPosts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => {
            if (tag && tag.slug) {
              if (!tagMap.has(tag.slug)) {
                tagMap.set(tag.slug, {
                  id: tag.id,
                  name: tag.name,
                  slug: tag.slug,
                  articleCount: 0
                });
              }
              tagMap.get(tag.slug).articleCount++;
            }
          });
        }
      });
      
      return Array.from(tagMap.values()).sort((a, b) => b.articleCount - a.articleCount);
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

    const goBack = () => {
      router.push({ name: 'home' });
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
      categories,
      currentCategory,
      categoryTags,
      categoryNews,
      hasMorePosts,
      isLoading,
      loadingMore,
      loadMorePosts,
      formatDate,
      goBack,
    };
  },
};
</script>

<style scoped>
/* Category Page Layout */
.category-page {
  max-width: 700px;
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