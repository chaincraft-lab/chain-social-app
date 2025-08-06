<template>
  <v-card 
    :elevation="elevation"
    :rounded="vuetifyRounded"
    :hover="hover"
    class="h-full d-flex flex-column news-card"
    @click="navigateToArticle"
  >
    <!-- News Image -->
    <div class="position-relative">
      <v-img 
        :src="news.image" 
        :alt="news.title"
        :height="imageHeight"
        cover
        :class="imageClass"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      
      <!-- Category Chip on Image -->
      <v-chip 
        v-if="showCategory && news.category && showCategoryInImage" 
        :color="getCategoryColor()" 
        size="small"
        class="position-absolute"
        style="bottom: 8px; left: 8px;"
      >
        {{ news.category.name }}
      </v-chip>
      
      <!-- Hover Overlay -->
      <div class="news-card-overlay">
        <v-btn
          icon="mdi-open-in-new"
          variant="text"
          color="white"
          size="small"
        ></v-btn>
      </div>
    </div>
    
    <!-- Card Content -->
    <v-card-text class="flex-grow-1 pa-4">
      <!-- Category Link (if not shown on image) -->
      <div v-if="showCategory && news.category && !showCategoryInImage" class="mb-2">
        <router-link 
          :to="{ name: 'category', params: { slug: news.category.slug } }"
          class="text-decoration-none"
        >
          <v-chip
            :color="getCategoryColor()"
            size="x-small"
            variant="outlined"
          >
            {{ news.category.name }}
          </v-chip>
        </router-link>
      </div>
      
      <!-- News Title -->
      <router-link 
        :to="{ name: 'article', params: { slug: news.id } }" 
        class="text-decoration-none"
      >
        <h3 :class="['text-body-1 font-weight-bold text-dark hover-color-primary mb-3', titleClass]">
          {{ news.title }}
        </h3>
      </router-link>
      
      <!-- News Excerpt -->
      <p v-if="showExcerpt" :class="['text-body-2 text-medium-emphasis', excerptClass]">
        {{ truncateText(news.excerpt, excerptLength) }}
      </p>
    </v-card-text>
    
    <!-- Card Actions -->
    <v-card-actions class="pa-4 pt-0">
      <div class="d-flex align-center w-100">
        <!-- Date -->
        <div class="d-flex align-center text-caption text-medium-emphasis">
          <v-icon size="small" class="me-1">mdi-clock-outline</v-icon>
          {{ formatDate(news.date) }}
        </div>
        
        <v-spacer></v-spacer>
        
        <!-- Read More Button -->
        <v-btn 
          v-if="showReadMore"
          :to="{ name: 'article', params: { slug: news.id } }"
          variant="text"
          color="primary"
          size="small"
          append-icon="mdi-arrow-right"
        >
          {{ readMoreText }}
        </v-btn>
        
        <!-- Action Buttons -->
        <div class="d-flex">
          <v-btn
            icon="mdi-bookmark-outline"
            variant="text"
            color="grey"
            size="small"
            @click.stop="toggleBookmark"
          ></v-btn>
          
          <v-btn
            icon="mdi-share-variant"
            variant="text"
            color="grey"
            size="small"
            @click.stop="shareArticle"
          ></v-btn>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'NewsCard',
  props: {
    news: {
      type: Object,
      required: true
    },
    hover: {
      type: Boolean,
      default: true
    },
    rounded: {
      type: String,
      default: 'lg',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
    },
    shadow: {
      type: String,
      default: 'md'
    },
    showCategory: {
      type: Boolean,
      default: true
    },
    showCategoryInImage: {
      type: Boolean,
      default: true
    },
    categoryVariant: {
      type: String,
      default: 'primary'
    },
    showExcerpt: {
      type: Boolean,
      default: true
    },
    excerptLength: {
      type: Number,
      default: 120
    },
    showReadMore: {
      type: Boolean,
      default: false
    },
    readMoreText: {
      type: String,
      default: 'Devamını Oku'
    },
    imageClass: {
      type: String,
      default: ''
    },
    titleClass: {
      type: String,
      default: ''
    },
    excerptClass: {
      type: String,
      default: ''
    },
    imageHeight: {
      type: [Number, String],
      default: 200
    }
  },
  
  computed: {
    elevation() {
      const elevationMap = {
        'none': 0,
        'sm': 1,
        'md': 2,
        'lg': 4,
        'xl': 8
      }
      return elevationMap[this.shadow] || 2
    },
    
    vuetifyRounded() {
      const roundedMap = {
        'none': 0,
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
        'xl': 'xl',
        '2xl': 'xl'
      }
      return roundedMap[this.rounded] || 'lg'
    }
  },
  
  methods: {
    truncateText(text, length) {
      if (!text) return ''
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    
    getCategoryColor() {
      if (!this.news.category) return 'primary'
      
      const categoryColors = {
        'Kara': 'brown',
        'Hava': 'blue',
        'Deniz': 'cyan',
        'Uzay': 'purple',
        'Siber': 'green',
        'Teknoloji': 'orange',
        'Analiz': 'indigo',
        'Projeler': 'teal'
      }
      
      return categoryColors[this.news.category.name] || this.categoryVariant
    },
    
    navigateToArticle() {
      this.$router.push({ name: 'article', params: { slug: this.news.id } })
    },
    
    toggleBookmark() {
      // Bookmark functionality
      console.log('Bookmark toggled for:', this.news.title)
      // Here you would typically dispatch a Vuex action or emit an event
    },
    
    shareArticle() {
      // Share functionality
      if (navigator.share) {
        navigator.share({
          title: this.news.title,
          text: this.news.excerpt,
          url: window.location.origin + this.$router.resolve({ name: 'article', params: { slug: this.news.id } }).href
        })
      } else {
        // Fallback: copy to clipboard
        const url = window.location.origin + this.$router.resolve({ name: 'article', params: { slug: this.news.id } }).href
        navigator.clipboard.writeText(url).then(() => {
          console.log('URL copied to clipboard')
          // You could show a snackbar here
        })
      }
    }
  }
}
</script>

<style scoped>
.news-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.news-card:hover {
  transform: translateY(-4px);
}

.news-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.news-card:hover .news-card-overlay {
  opacity: 1;
}

.hover-color-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Custom responsive image height */
@media (max-width: 960px) {
  .news-card :deep(.v-img) {
    height: 180px !important;
  }
}

@media (max-width: 600px) {
  .news-card :deep(.v-img) {
    height: 160px !important;
  }
}

/* Loading animation for better UX */
.news-card :deep(.v-progress-circular) {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style> 