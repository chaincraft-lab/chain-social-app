<template>
  <div class="space-y-8">
    <!-- Featured Slider -->
    <section class="featured-slider">
      <div class="relative rounded-xl overflow-hidden shadow-md">
        <div class="swiper-container" ref="featuredSwiper">
          <div class="swiper-wrapper">
            <div v-for="news in featuredNews" :key="news.id" class="swiper-slide">
              <div class="relative aspect-w-16 aspect-h-9 md:aspect-h-7">
                <img 
                  :src="news.image" 
                  :alt="news.title"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <BaseBadge 
                    v-if="news.category" 
                    variant="primary" 
                    size="sm" 
                    rounded="md"
                    class="mb-2"
                  >
                    {{ news.category.name }}
                  </BaseBadge>
                  <h2 class="text-xl md:text-2xl font-bold text-white mb-2">
                    {{ news.title }}
                  </h2>
                  <p class="text-sm text-white/80 mb-3 line-clamp-2">
                    {{ news.excerpt }}
                  </p>
                  <div class="flex items-center text-white/70 text-xs">
                    <span>{{ formatDate(news.date) }}</span>
                  </div>
                </div>
                <router-link 
                  :to="{ name: 'article', params: { slug: news.id } }"
                  class="absolute inset-0 z-10"
                ></router-link>
              </div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    </section>
    
    <!-- Latest News -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-dark">Son Haberler</h2>
        <BaseButton 
          variant="link" 
          size="sm"
          class="text-primary"
        >
          Tümünü Gör
        </BaseButton>
      </div>
      
      <div class="card-grid">
        <NewsCard 
          v-for="news in latestNews.slice(0, 6)" 
          :key="news.id" 
          :news="news"
          show-excerpt
        />
      </div>
    </section>
    
    <!-- Defense Categories Grid -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-dark">Kara</h2>
          <router-link 
            :to="{ name: 'category', params: { slug: 'kara' } }"
            class="text-sm text-primary hover:text-secondary transition-colors"
          >
            Tümünü Gör
          </router-link>
        </div>
        
        <div class="space-y-4">
          <NewsCard 
            v-if="getCategoryNewsBySlug('kara')[0]"
            :news="getCategoryNewsBySlug('kara')[0]" 
            :show-excerpt="true"
            excerpt-length="120"
          />
          
          <div v-for="news in getCategoryNewsBySlug('kara').slice(1, 3)" 
               :key="news.id" 
               class="flex items-center space-x-3 py-2 border-b border-light-200 last:border-0">
            <div class="flex-shrink-0 w-20 h-20">
              <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
            </div>
            <div>
              <h3 class="font-medium text-sm line-clamp-2">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-primary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-dark/60 mt-1">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="md:col-span-1">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-dark">Hava</h2>
          <router-link 
            :to="{ name: 'category', params: { slug: 'hava' } }"
            class="text-sm text-primary hover:text-secondary transition-colors"
          >
            Tümünü Gör
          </router-link>
        </div>
        
        <div class="space-y-4">
          <NewsCard 
            v-if="getCategoryNewsBySlug('hava')[0]"
            :news="getCategoryNewsBySlug('hava')[0]" 
            :show-excerpt="true"
            excerpt-length="120"
          />
          
          <div v-for="news in getCategoryNewsBySlug('hava').slice(1, 3)" 
               :key="news.id" 
               class="flex items-center space-x-3 py-2 border-b border-light-200 last:border-0">
            <div class="flex-shrink-0 w-20 h-20">
              <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
            </div>
            <div>
              <h3 class="font-medium text-sm line-clamp-2">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-primary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-dark/60 mt-1">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="md:col-span-1">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-dark">Deniz</h2>
          <router-link 
            :to="{ name: 'category', params: { slug: 'deniz' } }"
            class="text-sm text-primary hover:text-secondary transition-colors"
          >
            Tümünü Gör
          </router-link>
        </div>
        
        <div class="space-y-4">
          <NewsCard 
            v-if="getCategoryNewsBySlug('deniz')[0]"
            :news="getCategoryNewsBySlug('deniz')[0]" 
            :show-excerpt="true"
            excerpt-length="120"
          />
          
          <div v-for="news in getCategoryNewsBySlug('deniz').slice(1, 3)" 
               :key="news.id" 
               class="flex items-center space-x-3 py-2 border-b border-light-200 last:border-0">
            <div class="flex-shrink-0 w-20 h-20">
              <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
            </div>
            <div>
              <h3 class="font-medium text-sm line-clamp-2">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-primary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-dark/60 mt-1">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Technology and Projects -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Technology Section -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-dark">Teknoloji</h2>
          <router-link 
            :to="{ name: 'category', params: { slug: 'teknoloji' } }"
            class="text-sm text-primary hover:text-secondary transition-colors"
          >
            Tümünü Gör
          </router-link>
        </div>
        
        <div class="space-y-4">
          <NewsCard 
            v-if="getCategoryNewsBySlug('teknoloji')[0]"
            :news="getCategoryNewsBySlug('teknoloji')[0]" 
            :show-excerpt="true"
            excerpt-length="150"
          />
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="news in getCategoryNewsBySlug('teknoloji').slice(1, 3)" 
                 :key="news.id" 
                 class="flex flex-col space-y-2">
              <div class="w-full aspect-w-16 aspect-h-9">
                <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
              </div>
              <h3 class="font-medium text-sm">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-primary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-dark/60">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Projects Section -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-dark">Projeler</h2>
          <router-link 
            :to="{ name: 'category', params: { slug: 'projeler' } }"
            class="text-sm text-primary hover:text-secondary transition-colors"
          >
            Tümünü Gör
          </router-link>
        </div>
        
        <div class="space-y-4">
          <NewsCard 
            v-if="getCategoryNewsBySlug('projeler')[0]"
            :news="getCategoryNewsBySlug('projeler')[0]" 
            :show-excerpt="true"
            excerpt-length="150"
          />
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="news in getCategoryNewsBySlug('projeler').slice(1, 3)" 
                 :key="news.id" 
                 class="flex flex-col space-y-2">
              <div class="w-full aspect-w-16 aspect-h-9">
                <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
              </div>
              <h3 class="font-medium text-sm">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-primary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-dark/60">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <!-- International News -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-dark">Uluslararası</h2>
        <router-link 
          :to="{ name: 'category', params: { slug: 'uluslararasi' } }"
          class="text-sm text-primary hover:text-secondary transition-colors"
        >
          Tümünü Gör
        </router-link>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NewsCard 
          v-for="news in getCategoryNewsBySlug('uluslararasi').slice(0, 3)" 
          :key="news.id" 
          :news="news"
          :show-excerpt="true"
          excerpt-length="100"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { onMounted, ref } from 'vue'
// Swiper 11.x için önerilen import yöntemi
import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import NewsCard from '@/components/news/NewsCard.vue'

export default {
  name: 'HomePage',
  components: {
    BaseButton,
    BaseBadge,
    NewsCard
  },
  setup() {
    const featuredSwiper = ref(null)
    
    onMounted(() => {
      // Initialize featured slider
      new Swiper(featuredSwiper.value, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      })
    })
    
    return {
      featuredSwiper
    }
  },
  computed: {
    ...mapState(['categories', 'latestNews', 'popularNews', 'featuredNews']),
    
    mainCategories() {
      return this.categories.slice(0, 3)
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    getCategoryNews(categoryId) {
      // Simulating getting news by category
      // In a real app, you would have a proper filter or API call
      return this.latestNews
        .filter(news => news.category && news.category.id === categoryId)
        .slice(0, 5)
    },
    getCategoryNewsBySlug(slug) {
      return this.latestNews
        .filter(news => news.category && news.category.slug === slug)
        .slice(0, 5)
    }
  }
}
</script>

<style>
.swiper-button-prev,
.swiper-button-next {
  color: white;
  background: rgba(0, 0, 0, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-button-prev:after,
.swiper-button-next:after {
  font-size: 18px;
}

.swiper-pagination-bullet {
  background: white;
  opacity: 0.6;
}

.swiper-pagination-bullet-active {
  opacity: 1;
  background: theme('colors.primary.DEFAULT');
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style> 