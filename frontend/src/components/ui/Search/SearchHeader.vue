<template>
  <div class="search-header mb-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
          <Icon icon="heroicons:magnifying-glass" class="w-5 h-5 text-primary" />
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
          {{ title }}
        </h1>
      </div>
      
      <!-- Search Input -->
      <div class="search-input-container mb-4">
        <form @submit.prevent="$emit('search')">
          <div class="relative">
            <input 
              :value="query"
              @input="$emit('update:query', $event.target.value)"
              type="text" 
              :placeholder="placeholder" 
              class="w-full py-4 pl-12 pr-20 text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              @keyup.enter="$emit('search')"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-4">
              <Icon icon="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
            </div>
            <button 
              type="submit"
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary hover:text-primary/80 transition-colors"
            >
              <span class="text-sm font-medium bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors">
                Ara
              </span>
            </button>
          </div>
        </form>
      </div>
      
      <!-- Search Info -->
      <div class="search-info text-gray-600 text-sm">
        <span v-if="query && totalResults !== null">
          "<strong class="text-gray-900">{{ query }}</strong>" için <strong class="text-primary">{{ totalResults }}</strong> sonuç bulundu
        </span>
        <span v-else-if="query">
          "<strong class="text-gray-900">{{ query }}</strong>" aranıyor...
        </span>
        <span v-else>
          {{ emptyMessage }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Arama Sonuçları'
  },
  query: {
    type: String,
    default: ''
  },
  totalResults: {
    type: Number,
    default: null
  },
  placeholder: {
    type: String,
    default: 'Haber ara...'
  },
  emptyMessage: {
    type: String,
    default: 'Aramak istediğiniz kelimeyi yukarı giriniz.'
  }
})

defineEmits(['update:query', 'search'])
</script>

<style scoped>
.search-header {
  margin-bottom: 1rem;
}

.search-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.search-input-container {
  position: relative;
}

.search-input :deep(.v-field__input) {
  font-size: 16px;
  padding: 12px 16px;
}

.search-btn {
  margin-right: -8px;
}

.search-info {
  color: rgba(0, 0, 0, 0.7);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .search-header {
    margin-bottom: 0.5rem;
  }
  
  .search-card {
    margin: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .search-card {
    margin: 0 0.25rem;
  }
}
</style>