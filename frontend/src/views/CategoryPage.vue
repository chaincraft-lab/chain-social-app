<template>
  <div class="category-page theme-text-primary">
    <!-- Category Header with integrated subheader content -->
    <div class="flex justify-between items-start mb-6">
      <!-- Left Side - Sub Categories Area -->
      <div class="flex-1">
        <!-- Back Button -->
        <button 
          @click="goBack"
          class="flex items-center text-gray-400 hover:text-white transition-colors mb-3"
        >
          <Icon icon="heroicons:arrow-left" class="w-5 h-5 mr-2" />
          Ana Sayfa
        </button>
        
        <h1 v-if="currentCategory" class="text-2xl font-bold text-white mb-2">
          {{ currentCategory.name }}
        </h1>
        <p v-if="currentCategory?.description" class="text-gray-400">
          {{ currentCategory.description }}
        </p>
      </div>

      <!-- Right Side - Category Info Header -->
      <div class="flex flex-col items-center ml-8">
        <!-- Category Name -->
        <div class="flex items-center justify-center mb-4">
          <h1 class="text-white font-bold text-3xl">{{ currentCategory?.name || 'Kategori' }}</h1>
        </div>

        <!-- Follower Count -->
        <div class="flex items-center justify-center text-gray-400 text-sm mb-4">
          <Icon icon="heroicons:users" class="w-4 h-4 mr-2" />
          <span>{{ currentCategory?.articleCount ? `${currentCategory.articleCount}` : '20.356' }} Takipçi</span>
        </div>

        <!-- Follow Button -->
        <div class="flex justify-center">
          <button 
            @click="toggleFollow"
            class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2"
            :class="{ 'bg-blue-600 hover:bg-blue-500': isFollowing }"
          >
            <Icon 
              :icon="isFollowing ? 'heroicons:check' : 'heroicons:plus'" 
              class="w-4 h-4" 
            />
            <span>{{ isFollowing ? 'TAKİP EDİLİYOR' : 'TAKİP ET' }}</span>
          </button>
        </div>
      </div>
    </div>


    <!-- Posts Feed -->
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
          button-text="Daha Fazla Yükle"
          @loadMore="loadMorePosts"
        />

        <!-- End Message -->
        <div v-else-if="categoryNews.length > 5" class="text-center py-4 text-gray-400">
          Bu kategorideki tüm haberleri görüntülediniz
        </div>
      </div>

      <!-- No Posts Found -->
      <StateMessage
        v-else
        type="empty"
        title="Henüz haber yok"
        message="Bu kategoride henüz haber bulunmuyor"
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
      // For subcategory pages, use categorySlug, for category pages use slug
      const categorySlug = route.params.categorySlug || route.params.slug;
      return cats.find((c) => c && c.slug === categorySlug) || null;
    });


    const allCategoryNews = computed(() => {
      // For subcategory pages, use categorySlug, for category pages use slug
      const categorySlug = route.params.categorySlug || route.params.slug;
      const apiNews = store.getters["news/getCategoryNews"](categorySlug);
      
      // Eğer API'den veri yoksa mock data göster
      if (!apiNews || apiNews.length === 0) {
        return getMockNewsForCategory(categorySlug);
      }
      
      return apiNews;
    });

    // Mock news data for categories
    const getMockNewsForCategory = (categorySlug) => {
      const mockNews = {
        'aave': [
          {
            id: 1,
            title: 'Aave V3 Multi-Chain Ekspansyonu Devam Ediyor - 48',
            slug: 'aave-v3-multi-chain-expansion',
            excerpt: 'Aave V3 protokolü yeni blockchain ağlarına genişlemeye devam ediyor. DeFi\'nin en büyük lending platformu...',
            content: 'Aave V3 protokolü, DeFi alanındaki liderliğini pekiştirerek yeni blockchain ağlarına entegrasyon çalışmalarını sürdürüyor.',
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            author: { id: 1, name: 'Ayşe Web3' },
            category: { id: 1, name: 'AAVE', slug: 'aave' },
            views: 1234,
            likes: 48,
            isBreaking: false,
            isFeatured: true
          },
          {
            id: 2,
            title: 'Near Protocol Sharding Teknolojisi İlerliyor - 72',
            slug: 'near-protocol-sharding-technology',
            excerpt: 'Near Protocol\'un sharding teknolojisi ile ölçeklenebilirlik alanında yeni bir milata imza atıyor...',
            content: 'Near Protocol, sharding teknolojisi sayesinde saniyede binlerce işlem kapasitesine ulaşmayı hedefliyor.',
            image: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            author: { id: 2, name: 'Ali Crypto' },
            category: { id: 1, name: 'AAVE', slug: 'aave' },
            views: 892,
            likes: 72,
            isBreaking: false,
            isFeatured: false
          }
        ],
        'ethereum': [
          {
            id: 3,
            title: 'Ethereum 2.0 Staking Rewards Artıyor',
            slug: 'ethereum-2-staking-rewards',
            excerpt: 'Ethereum 2.0 ağında staking yapan kullanıcılar için ödül oranları yükselişte...',
            content: 'Ethereum 2.0 ağının büyümesiyle birlikte staking ödülleri de artış gösteriyor.',
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600',
            publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            author: { id: 1, name: 'Ayşe Web3' },
            category: { id: 2, name: 'Ethereum', slug: 'ethereum' },
            views: 2156,
            likes: 89,
            isBreaking: true,
            isFeatured: true
          }
        ]
      };
      
      // Eğer o kategori için mock veri yoksa genel mock veri döndür
      return mockNews[categorySlug] || mockNews['aave'];
    };

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
      const categorySlug = route.params.categorySlug || route.params.slug;
      console.log('Loading category news for:', categorySlug);
      if (categorySlug) {
        try {
          // Önce kategori bilgisini çek
          await store.dispatch(
            "categories/fetchCategoryBySlug",
            categorySlug
          );

          // Sonra o kategoriye ait haberleri çek
          await store.dispatch("news/fetchCategoryNews", {
            categorySlug: categorySlug,
            limit: 50, // Load more posts to enable pagination
          });
          
          // Debug: Category news'i kontrol et
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
      () => [route.params.slug, route.params.categorySlug, route.params.subSlug],
      () => {
        displayedPostsCount.value = 10; // Reset pagination when category changes
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