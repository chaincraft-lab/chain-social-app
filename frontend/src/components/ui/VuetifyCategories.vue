<template>
  <v-card
    v-if="showCategories"
    class="mb-4 rounded-lg elevation-1"
  >
    <v-card-title class="text-subtitle-1 font-weight-medium text-dark d-flex align-center">
      <v-icon size="small" class="mr-2" color="primary">mdi-folder-multiple</v-icon>
      Kategoriler
    </v-card-title>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="category in categories"
        :key="category.id"
        :to="{ name: 'category', params: { slug: category.slug } }"
        link
        active-class="text-primary font-weight-medium"
        class="category-item"
      >
        <v-list-item-title>{{ category.name }}</v-list-item-title>
        <template v-slot:append v-if="category.articleCount">
          <v-chip
            size="x-small"
            color="primary"
            variant="flat"
            class="category-badge"
          >
            {{ category.articleCount }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
/* eslint-disable no-undef */
defineProps({
  showCategories: {
    type: Boolean,
    default: true
  },
  categories: {
    type: Array,
    default: () => []
  }
});
/* eslint-enable no-undef */
</script>

<style scoped>
.category-item:hover {
  background-color: rgba(128, 0, 0, 0.08) !important;
  color: #800000 !important;
}

.category-item:hover .v-list-item-title {
  color: #800000 !important;
  font-weight: 500;
}

.category-item {
  transition: all 0.2s ease;
  border-radius: 8px !important;
  margin: 2px 8px;
}
</style>
