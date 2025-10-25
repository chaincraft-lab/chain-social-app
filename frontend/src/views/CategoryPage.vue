<template>
  <div class="category-page theme-text-primary">
    <!-- News Feed -->
    <div class="posts-feed">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <SkeletonLoader v-for="i in 6" :key="i" type="news" />
      </div>

      <!-- Category Posts -->
      <div v-else-if="categoryNews && categoryNews.length > 0" class="posts-container">
        <NewsPost
          v-for="news in categoryNews"
          :key="news?.id || Math.random()"
          :news="news"
          class="mb-4"
        />

        <!-- Load More Button -->
        <LoadMoreButton
          v-if="hasMorePosts"
          :has-more="hasMorePosts"
          :is-loading="loadingMore"
          :button-text="$t('pages.category.loadMore')"
          @loadMore="loadMorePosts"
        />

        <!-- End Message -->
        <div v-else-if="categoryNews.length > 5" class="text-center py-4 text-gray-400">
          {{ $t('pages.category.allNewsViewed') }}
        </div>
      </div>

      <!-- No Posts Found -->
      <StateMessage
        v-else
        type="empty"
        :title="$t('pages.category.noNewsTitle')"
        :message="$t('pages.category.noNewsMessage')"
        icon="mdi-newspaper-variant-outline"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import NewsPost from "@/components/news/NewsPost.vue";
import StateMessage from "@/components/common/StateMessage.vue";
import SkeletonLoader from "@/components/common/SkeletonLoader.vue";
import LoadMoreButton from "@/components/common/LoadMoreButton.vue";

export default {
  name: "CategoryPage",
  components: {
    Icon,
    NewsPost,
    StateMessage,
    SkeletonLoader,
    LoadMoreButton,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const displayedPostsCount = ref(10);
    const loadingMore = ref(false);
    const isFollowing = ref(false);

    const categories = computed(() => store.state.categories.categories || []);
    const currentCategory = computed(() => {
      const cats = categories.value;
      if (!Array.isArray(cats)) return null;
      const categorySlug = route.params.slug;
      return cats.find((c) => c && c.slug === categorySlug) || null;
    });


    const allCategoryNews = computed(() => {
      const categorySlug = route.params.slug;
      return store.getters["news/getCategoryNews"](categorySlug) || [];
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
      const categorySlug = route.params.slug;
      console.log('Loading category news for:', categorySlug);
      if (categorySlug) {
        try {
          await store.dispatch(
            "categories/fetchCategoryBySlug",
            categorySlug
          );

          await store.dispatch("news/fetchCategoryNews", {
            categorySlug: categorySlug,
            limit: 50,
          });
          
          const news = store.getters["news/getCategoryNews"](categorySlug);
          console.log('Category news loaded:', news);
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

    const toggleFollow = () => {
      isFollowing.value = !isFollowing.value;
    };

    onMounted(() => {
      loadCategoryNews();
    });

    watch(
      () => route.params.slug,
      () => {
        displayedPostsCount.value = 10;
        loadCategoryNews();
      }
    );

    return {
      categories,
      currentCategory,
      categoryNews,
      hasMorePosts,
      isLoading,
      loadingMore,
      loadMorePosts,
      formatDate,
      goBack,
      isFollowing,
      toggleFollow,
    };
  },
};
</script>

<style scoped>
/* Category Page Layout */
.category-page {
  width: 100%;
  padding: 0;
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