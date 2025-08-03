<template>
  <div class="space-y-8">
    <!-- Featured Slider -->
    <section class="featured-slider">
      <v-card class="overflow-hidden" elevation="4" rounded="xl">
        <div class="swiper-container" ref="featuredSwiper">
          <div class="swiper-wrapper">
            <div v-for="news in featuredNews" :key="news.id" class="swiper-slide">
              <div class="relative aspect-w-16 aspect-h-9 md:aspect-h-7">
                <v-img 
                  :src="news.image" 
                  :alt="news.title"
                  height="400"
                  cover
                  class="w-full h-full"
                >
                  <div class="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
                  <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <v-chip 
                      v-if="news.category" 
                      color="primary" 
                      size="small"
                      class="mb-3"
                    >
                      {{ news.category.name }}
                    </v-chip>
                    <h2 class="text-xl md:text-2xl font-bold text-white mb-2">
                      {{ news.title }}
                    </h2>
                    <p class="text-sm text-white/80 mb-3 line-clamp-2">
                      {{ news.excerpt }}
                    </p>
                    <div class="flex items-center text-white/70 text-xs">
                      <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                      <span>{{ formatDate(news.date) }}</span>
                    </div>
                  </div>
                  <router-link 
                    :to="{ name: 'article', params: { slug: news.id } }"
                    class="absolute inset-0 z-10"
                  ></router-link>
                </v-img>
              </div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </v-card>
    </section>
    
    <!-- Banner Ad - Leaderboard (728x90) -->
    <section class="mb-8">
      <v-card class="overflow-hidden" elevation="2" rounded="lg">
        <a href="#" target="_blank" class="block text-decoration-none">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-avatar size="64" color="blue">
                  <span class="text-h4 font-weight-bold">T</span>
                </v-avatar>
                <div class="ml-4">
                  <div class="text-h6 font-weight-bold text-blue">TUSAŞ</div>
                  <div class="text-body-2 text-blue-darken-1">Türk Havacılık ve Uzay Sanayii</div>
                </div>
              </div>
              <v-btn 
                color="blue" 
                variant="flat"
                rounded="lg"
                size="small"
              >
                Daha Fazla Bilgi
              </v-btn>
            </div>
          </v-card-text>
        </a>
        <div class="text-caption text-medium-emphasis text-right pa-2">Reklam</div>
      </v-card>
    </section>
    
    <!-- Latest News -->
    <section>
      <div class="d-flex align-center justify-space-between mb-6">
        <h2 class="text-h4 font-weight-bold text-dark">Son Haberler</h2>
        <v-btn 
          variant="text" 
          color="primary"
          append-icon="mdi-arrow-right"
        >
          Tümünü Gör
        </v-btn>
      </div>
      
      <v-row>
        <v-col 
          v-for="news in latestNews.slice(0, 6)" 
          :key="news.id"
          cols="12" 
          sm="6" 
          lg="4"
          class="d-flex"
        >
          <NewsCard 
            :news="news"
            show-excerpt
            show-read-more
            class="w-100"
          />
        </v-col>
      </v-row>
    </section>
    
    <!-- Banner Ad - Medium Rectangle (300x250) -->
    <section class="my-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full overflow-hidden rounded-lg">
          <a href="#" target="_blank" class="block">
            <div class="bg-red-50 w-full h-[250px] flex flex-col items-center justify-center border border-red-100 rounded-lg overflow-hidden">
              <div class="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                R
              </div>
              <div class="text-xl font-bold text-red-800 mb-2">ROKETSAN</div>
              <div class="text-sm text-red-600 mb-4">Füze ve Roket Sistemleri</div>
              <div class="bg-red-600 text-white py-2 px-6 rounded-full text-sm font-medium">
                Keşfet
              </div>
            </div>
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>
        
        <div class="w-full overflow-hidden rounded-lg">
          <a href="#" target="_blank" class="block">
            <div class="bg-green-50 w-full h-[250px] flex flex-col items-center justify-center border border-green-100 rounded-lg overflow-hidden">
              <div class="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                H
              </div>
              <div class="text-xl font-bold text-green-800 mb-2">HAVELSAN</div>
              <div class="text-sm text-green-600 mb-4">Yazılım ve Bilişim</div>
              <div class="bg-green-600 text-white py-2 px-6 rounded-full text-sm font-medium">
                Detaylı Bilgi
              </div>
            </div>
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>
      </div>
    </section>
    
    <!-- Defense Categories Grid -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-light">Kara</h2>
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
               class="flex items-center space-x-3 py-2 border-b border-dark-700 last:border-0">
            <div class="flex-shrink-0 w-20 h-20">
              <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
            </div>
            <div>
              <h3 class="font-medium text-sm line-clamp-2 text-light">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-secondary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-light/60 mt-1">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="md:col-span-1">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-light">Hava</h2>
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
               class="flex items-center space-x-3 py-2 border-b border-dark-700 last:border-0">
            <div class="flex-shrink-0 w-20 h-20">
              <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
            </div>
            <div>
              <h3 class="font-medium text-sm line-clamp-2 text-light">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-secondary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-light/60 mt-1">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="md:col-span-1">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-light">Deniz</h2>
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
               class="flex items-center space-x-3 py-2 border-b border-dark-700 last:border-0">
            <div class="flex-shrink-0 w-20 h-20">
              <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
            </div>
            <div>
              <h3 class="font-medium text-sm line-clamp-2 text-light">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-secondary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-light/60 mt-1">{{ formatDate(news.date) }}</div>
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
          <h2 class="text-xl font-bold text-light">Teknoloji</h2>
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
              <h3 class="font-medium text-sm text-light">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-secondary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-light/60">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Projects Section -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-light">Projeler</h2>
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
              <h3 class="font-medium text-sm text-light">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-secondary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-light/60">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <!-- Banner Ad - Wide Skyscraper (160x600) -->
    <section class="my-8">
      <div class="w-full overflow-hidden rounded-lg">
        <a href="#" target="_blank" class="block">
          <div class="bg-gray-50 w-full h-[120px] md:h-[90px] flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between w-full px-4 md:px-8">
              <div class="flex items-center mb-3 md:mb-0">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  M
                </div>
                <div>
                  <div class="text-lg font-bold text-primary">MKE</div>
                  <div class="text-xs text-primary/70">Makina ve Kimya Endüstrisi</div>
                </div>
              </div>
              <div class="bg-primary text-white py-1.5 px-4 rounded-lg text-sm font-medium">
                Ziyaret Et
              </div>
            </div>
          </div>
        </a>
        <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
      </div>
    </section>
    
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

import NewsCard from '@/components/news/NewsCard.vue'

export default {
  name: 'HomePage',
  components: {
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