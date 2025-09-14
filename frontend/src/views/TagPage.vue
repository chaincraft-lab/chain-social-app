<template>
  <div class="tag-page theme-text-primary">
    <!-- Tag Navigation -->
    <CategoriesSlider 
      :categories="[]"
      :is-loading="isLoading"
      mode="back"
      :back-title="currentTag ? `#${currentTag.name}` : 'Tag'"
      @back="goBack"
    />

    <!-- Posts Feed -->
    <div class="posts-feed">

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4 mt-4">
        <SkeletonLoader v-for="i in 10" :key="i" type="news" />
      </div>

      <!-- Tag Posts -->
      <div v-else class="posts-container">
        <NewsPost
          v-for="news in tagNews"
          :key="news?.id || Math.random()"
          :news="news"
        />

        <!-- Load More Button -->
        <LoadMoreButton
          :has-more="hasMorePosts"
          :is-loading="loadingMore"
          :show-end-message="tagNews.length > 0 && !hasMorePosts"
          button-text="Daha Fazla Yükle"
          end-message="Bu etiketteki tüm haberleri görüntülediniz"
          @loadMore="loadMorePosts"
        />

        <!-- No Posts Found -->
        <StateMessage
          v-if="tagNews.length === 0"
          type="empty"
          title="Henüz haber yok"
          message="Bu etikette henüz haber bulunmuyor"
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
  name: "TagPage",
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

    const currentTag = computed(() => {
      // Tag bilgisini store'dan al (eğer lazımsa)
      return { name: route.params.slug, slug: route.params.slug };
    });

    const allTagNews = computed(() => {
      return store.getters["news/getTagNews"](route.params.slug);
    });

    const tagNews = computed(() => {
      return allTagNews.value.slice(0, displayedPostsCount.value);
    });

    const hasMorePosts = computed(() => {
      return allTagNews.value.length > displayedPostsCount.value;
    });

    const isLoading = computed(() => store.getters["news/isLoading"]("tag"));

    const loadTagNews = async () => {
      if (route.params.slug) {
        try {
          // Önce tag bilgisini çek (eğer gerekiyorsa)
          await store.dispatch("tags/fetchTagBySlug", route.params.slug);

          // Sonra o tag'e ait haberleri çek
          await store.dispatch("news/fetchTagNews", {
            tagSlug: route.params.slug,
            limit: 50, // Load more posts to enable pagination
          });
        } catch (error) {
          console.error("Error loading tag data:", error);
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
      router.go(-1); // Go back to previous page
    };

    onMounted(() => {
      loadTagNews();
    });

    watch(
      () => route.params.slug,
      () => {
        displayedPostsCount.value = 10; // Reset pagination when tag changes
        loadTagNews();
      }
    );

    return {
      currentTag,
      tagNews,
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
/* Tag Page Layout */
.tag-page {
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
  .tag-page {
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .tag-page {
    padding: 0 0.25rem;
  }
}
</style>