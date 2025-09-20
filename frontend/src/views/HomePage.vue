<template>
  <div class="homepage-feed  theme-text-primary">
    <!-- Category Stories -->
    <CategoryStories 
      :categories="categories"
      :is-loading="isLoading"
    />

    <!-- News Feed Posts -->
    <section class="news-feed">
      <!-- Post Feed -->
      <div class="posts-container">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <SkeletonLoader v-for="i in 10" :key="i" type="news" />
        </div>

        <!-- Actual Posts -->
        <transition-group
          v-else
          name="news-post"
          tag="div"
          class="news-posts-list"
        >
          <NewsPost
            v-for="news in filteredNews"
            :key="news?.id || Math.random()"
            :news="news"
          />
        </transition-group>

        <!-- Load More Button -->
        <LoadMoreButton
          :has-more="hasMorePosts"
          :is-loading="loadingMore"
          :show-end-message="!hasMorePosts && filteredNews.length > 0"
          :show-skeleton="isLoading"
          button-text="Daha Fazla Haber Yükle"
          end-message="Tüm haberler yüklendi"
          @loadMore="loadMorePosts"
        />
      </div>
    </section>
  </div>
</template>


<script>
import { mapState } from "vuex";
import NewsPost from "@/components/news/NewsPost.vue";
import StateMessage from "@/components/common/StateMessage.vue";
import SkeletonLoader from "@/components/common/SkeletonLoader.vue";
import LoadMoreButton from "@/components/common/LoadMoreButton.vue";
import CategoryStories from "@/components/stories/CategoryStories.vue";

export default {
  name: "HomePage",
  components: {
    NewsPost,
    StateMessage,
    SkeletonLoader,
    LoadMoreButton,
    CategoryStories,
  },
  data() {
    return {
      selectedFilter: "all",
      loadingMore: false,
      hasMorePosts: true,
      displayedPostsCount: 10,
    };
  },
  async mounted() {
    // HomePage yüklendiğinde veri varsa tekrar çekme
    if (!this.latestNews || this.latestNews.length === 0) {
      await this.fetchInitialData();
    }

    // Infinite scroll listener ekle
    this.setupInfiniteScroll();
  },

  beforeUnmount() {
    // Listener'ı temizle
    this.removeInfiniteScroll();
  },
  computed: {
    ...mapState("categories", ["categories"]),
    ...mapState("news", ["latestNews", "popularNews", "featuredNews"]),

    isLoading() {
      return (
        this.$store.getters["news/isLoading"]("latest") ||
        this.$store.getters["news/isLoading"]("featured") ||
        this.$store.getters["categories/isLoading"]("categories")
      );
    },

    filteredNews() {
      if (!this.latestNews || !Array.isArray(this.latestNews)) {
        return [];
      }

      let filtered = [...this.latestNews];

      switch (this.selectedFilter) {
        case "trending":
          // Sort by engagement (likes + comments) - simulated
          filtered.sort(() => Math.random() * 1000 - Math.random() * 1000);
          break;
        case "recent":
          // Sort by date (most recent first)
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        default:
          // Default: mix of recent and trending
          break;
      }

      return filtered.slice(0, this.displayedPostsCount);
    },
  },
  methods: {
    async fetchInitialData() {
      try {
        // Paralel olarak tüm verileri çek
        await Promise.all([
          this.$store.dispatch("news/fetchLatestNews", 20),
          this.$store.dispatch("news/fetchFeaturedNews", 5),
          this.$store.dispatch("news/fetchPopularNews", 5),
          this.$store.dispatch("categories/fetchCategories"),
        ]);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },


    async loadMorePosts() {
      if (this.loadingMore || !this.hasMorePosts) return;

      this.loadingMore = true;

      try {
        // Daha fazla makale yükle
        const currentCount = this.displayedPostsCount;
        await this.$store.dispatch("news/fetchLatestNews", currentCount + 10);

        this.displayedPostsCount += 10;

        // Eğer gelen veri sayısı istediğimizden azsa, daha fazla veri yok demektir
        if (this.latestNews.length < this.displayedPostsCount) {
          this.hasMorePosts = false;
        }
      } catch (error) {
        console.error("Error loading more posts:", error);
      } finally {
        this.loadingMore = false;
      }
    },

    setupInfiniteScroll() {
      this.scrollHandler = () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Sayfa sonuna 200px yaklaştığında yeni veri yükle
        if (scrollTop + windowHeight >= documentHeight - 200) {
          this.loadMorePosts();
        }
      };

      // Throttle scroll event for performance
      this.throttledScrollHandler = this.throttle(this.scrollHandler, 300);
      window.addEventListener("scroll", this.throttledScrollHandler);
    },

    removeInfiniteScroll() {
      if (this.throttledScrollHandler) {
        window.removeEventListener("scroll", this.throttledScrollHandler);
      }
    },

    throttle(func, delay) {
      let timeoutId;
      let lastExecTime = 0;

      return function (...args) {
        const currentTime = Date.now();

        if (currentTime - lastExecTime > delay) {
          func.apply(this, args);
          lastExecTime = currentTime;
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
            lastExecTime = Date.now();
          }, delay - (currentTime - lastExecTime));
        }
      };
    },
  },

  watch: {
    selectedFilter() {
      // Reset displayed posts when filter changes
      this.displayedPostsCount = 10;
      this.hasMorePosts = true;
    },
  },
};
</script>

<style scoped>
/* Homepage Feed Layout */
.homepage-feed {
  width: 100%;
  padding: 0;
}


/* News Feed */
.news-feed {
  margin-bottom: 2rem;
}


/* Posts Container */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100vh; /* Prevent layout shift */
  transition: opacity 0.3s ease;
}

/* Prevent content jump during loading */
.posts-container.loading {
  opacity: 0.9;
}

.news-posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


/* Mobile Responsive */
@media (max-width: 768px) {
}

@media (max-width: 480px) {
}



/* New posts animation */
.news-post-enter-active {
  animation: slideInUp 0.6s ease-out;
}

.news-post-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> 