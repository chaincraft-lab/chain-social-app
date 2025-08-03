<template>
  <BaseCard 
    :hover="hover" 
    :rounded="rounded" 
    :shadow="shadow"
    class="h-full flex flex-col"
  >
    <template #image>
      <div class="relative">
        <router-link :to="{ name: 'article', params: { slug: news.id } }">
          <div :class="['aspect-w-16 aspect-h-9', imageClass]">
            <img 
              :src="news.image" 
              :alt="news.title"
              class="w-full h-full object-cover"
            />
          </div>
        </router-link>
        <BaseBadge 
          v-if="showCategory && news.category" 
          :variant="categoryVariant" 
          size="sm" 
          rounded="md"
          class="absolute bottom-2 left-2"
        >
          {{ news.category.name }}
        </BaseBadge>
      </div>
    </template>
    
    <div class="flex flex-col flex-grow p-4">
      <div v-if="showCategory && news.category && !showCategoryInImage" class="mb-1">
        <router-link 
          :to="{ name: 'category', params: { slug: news.category.slug } }"
          class="text-xs font-medium text-primary hover:text-secondary transition-colors"
        >
          {{ news.category.name }}
        </router-link>
      </div>
      
      <router-link :to="{ name: 'article', params: { slug: news.id } }" class="block mb-2">
        <h3 :class="['font-bold text-light hover:text-secondary transition-colors', titleClass]">
          {{ news.title }}
        </h3>
      </router-link>
      
      <p v-if="showExcerpt" :class="['text-light/80', excerptClass]">
        {{ truncateText(news.excerpt, excerptLength) }}
      </p>
      
      <div class="mt-auto pt-3 flex items-center justify-between text-xs text-light/60">
        <div>
          {{ formatDate(news.date) }}
        </div>
        
        <div v-if="showReadMore">
          <router-link 
            :to="{ name: 'article', params: { slug: news.id } }"
            class="text-primary hover:text-secondary transition-colors font-medium"
          >
            {{ readMoreText }}
          </router-link>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '../ui/BaseCard.vue'
import BaseBadge from '../ui/BaseBadge.vue'

export default {
  name: 'NewsCard',
  components: {
    BaseCard,
    BaseBadge
  },
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
      default: 'lg'
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
      default: 'text-lg'
    },
    excerptClass: {
      type: String,
      default: 'text-sm'
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
    }
  }
}
</script> 