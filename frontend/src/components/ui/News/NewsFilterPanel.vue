<template>
  <div class="news-filter-container">
    <!-- Title and Filter Button -->
    <div class="feed-header flex justify-between items-center mb-6 px-2">
      <h1 class="text-2xl font-bold theme-text-primary m-0">{{ title }}</h1>
      
      <!-- Filter Button -->
      <button
        @click="isOpen = !isOpen"
        class="flex items-center gap-2 px-4 py-2 theme-bg-primary theme-border rounded-lg hover:theme-bg-secondary transition-all"
      >
        <Icon icon="heroicons:funnel" class="w-5 h-5" />
        <span class="font-medium">Filtrele</span>
        <Icon 
          :icon="isOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
          class="w-4 h-4 transition-transform" 
        />
      </button>
    </div>

    <!-- Filter Panel -->
  <Transition name="filter-panel">
    <div 
      v-if="isOpen" 
      class="news-filter-panel theme-bg-primary theme-border rounded-xl p-6 mb-6"
    >
    <!-- Search Box -->
    <div class="search-section mb-6">
      <div class="relative">
        <Icon icon="heroicons:magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Haber ara..."
          class="w-full pl-12 pr-4 py-3 theme-bg-secondary theme-text-primary theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          @keyup.enter="handleSearch"
        />
        <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <button
            v-if="!searchQuery"
            @click="handleSearch"
            class="theme-text-muted hover:theme-text-primary"
          >
            <Icon icon="heroicons:arrow-right" class="w-5 h-5" />
          </button>
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="theme-text-muted hover:theme-text-primary"
          >
            <Icon icon="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="filter-controls mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold theme-text-primary">Filtrele</h3>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="text-sm theme-text-accent hover:underline"
        >
          Tümünü Temizle
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Category Filter -->
        <div class="filter-group">
          <label class="filter-label">Kategori</label>
          <select
            v-model="selectedCategory"
            class="filter-select"
            @change="handleCategoryChange"
          >
            <option value="">Tüm Kategoriler</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.slug"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Tags Filter -->
        <div class="filter-group">
          <label class="filter-label">Etiket</label>
          <select
            v-model="selectedTag"
            class="filter-select"
            @change="handleTagChange"
          >
            <option value="">Tüm Etiketler</option>
            <option
              v-for="tag in popularTags"
              :key="tag.id"
              :value="tag.slug"
            >
              {{ tag.name }}
            </option>
          </select>
        </div>

        <!-- Date Filter -->
        <div class="filter-group">
          <label class="filter-label">Tarih</label>
          <select
            v-model="selectedDateRange"
            class="filter-select"
            @change="handleDateChange"
          >
            <option value="">Tüm Zamanlar</option>
            <option value="today">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results Info and Sort -->
    <div class="results-section">
      <div class="flex items-center justify-between">
        <div class="results-info theme-text-secondary text-sm">
          {{ resultsCount }} haber bulundu
        </div>
        <div class="sort-controls">
          <label class="text-sm theme-text-secondary mr-2">Sırala:</label>
          <select
            v-model="selectedSort"
            class="sort-select text-sm"
            @change="handleSortChange"
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="popular">En Popüler</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Active Filters Tags -->
    <div v-if="hasActiveFilters" class="active-filters mt-4">
      <div class="flex flex-wrap gap-2">
        <span
          v-if="selectedCategory"
          class="filter-tag"
        >
          Kategori: {{ getCategoryName(selectedCategory) }}
          <button @click="selectedCategory = ''" class="ml-2">
            <Icon icon="heroicons:x-mark" class="w-3 h-3" />
          </button>
        </span>
        <span
          v-if="selectedTag"
          class="filter-tag"
        >
          Etiket: {{ getTagName(selectedTag) }}
          <button @click="selectedTag = ''" class="ml-2">
            <Icon icon="heroicons:x-mark" class="w-3 h-3" />
          </button>
        </span>
        <span
          v-if="selectedDateRange"
          class="filter-tag"
        >
          Tarih: {{ getDateRangeName(selectedDateRange) }}
          <button @click="selectedDateRange = ''" class="ml-2">
            <Icon icon="heroicons:x-mark" class="w-3 h-3" />
          </button>
        </span>
      </div>
    </div>
    </div>
  </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Props
const props = defineProps({
  title: { type: String, default: 'Son Haberler' },
  resultsCount: { type: Number, default: 0 }
})

// Emits
const emit = defineEmits(['filter-change'])

// State
const isOpen = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')
const selectedDateRange = ref('')
const selectedSort = ref('newest')

// Computed
const categories = computed(() => store.state.categories.categories)
const popularTags = computed(() => store.state.tags.popularTags)

const hasActiveFilters = computed(() => {
  return selectedCategory.value || selectedTag.value || selectedDateRange.value || searchQuery.value
})

// Methods
const handleSearch = () => {
  emitFilterChange()
}

const clearSearch = () => {
  searchQuery.value = ''
  emitFilterChange()
}

const handleCategoryChange = () => {
  emitFilterChange()
}

const handleTagChange = () => {
  emitFilterChange()
}

const handleDateChange = () => {
  emitFilterChange()
}

const handleSortChange = () => {
  emitFilterChange()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedTag.value = ''
  selectedDateRange.value = ''
  selectedSort.value = 'newest'
  emitFilterChange()
}

const emitFilterChange = () => {
  emit('filter-change', {
    search: searchQuery.value,
    category: selectedCategory.value,
    tag: selectedTag.value,
    dateRange: selectedDateRange.value,
    sort: selectedSort.value
  })
}

const getCategoryName = (slug) => {
  const category = categories.value.find(c => c.slug === slug)
  return category ? category.name : slug
}

const getTagName = (slug) => {
  const tag = popularTags.value.find(t => t.slug === slug)
  return tag ? tag.name : slug
}

const getDateRangeName = (range) => {
  const ranges = {
    today: 'Bugün',
    week: 'Bu Hafta',
    month: 'Bu Ay',
    year: 'Bu Yıl'
  }
  return ranges[range] || range
}

// Load initial data
onMounted(async () => {
  if (!categories.value.length) {
    await store.dispatch('categories/fetchCategories')
  }
  if (!popularTags.value.length) {
    await store.dispatch('tags/fetchPopularTags')
  }
})
</script>

<style scoped>
.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.filter-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  border: 1px solid;
}

.filter-select:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.sort-select {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  outline: none;
  transition: all 0.2s;
  border: 1px solid;
}

.sort-select:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--color-primary);
  color: white;
}

.filter-tag button {
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.filter-tag button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Filter Panel Animations */
.filter-panel-enter-active,
.filter-panel-leave-active {
  transition: all 0.3s ease-out;
  transform-origin: top;
}

.filter-panel-enter-from {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}

.filter-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .feed-header {
    flex-direction: column !important;
    gap: 1rem;
    align-items: flex-start !important;
  }

  .feed-header h1 {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 480px) {
  .feed-header {
    padding: 0 0.25rem !important;
  }
}
</style>