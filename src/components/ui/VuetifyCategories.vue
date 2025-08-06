<template>
  <v-card
    v-if="showCategories"
    class="mb-4 rounded-lg elevation-1"
  >
    <v-card-title class="text-subtitle-1 font-weight-medium text-dark">
      Kategoriler
    </v-card-title>

    <v-divider></v-divider>

    <v-list density="dense" nav>
      <v-list-item
        v-for="category in categories"
        :key="category.id"
        :to="{ name: 'category', params: { slug: category.slug } }"
        link
        active-class="text-primary font-weight-medium"
      >
        <v-list-item-title>{{ category.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';
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
</script>
