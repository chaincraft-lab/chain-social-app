<template>
  <UserContentListPage :config="likesConfig" />
</template>

<script setup>
import UserContentListPage from '@/components/pages/UserContentListPage.vue'
import { likeService } from '@/services'

const likesConfig = {
  type: 'likes',
  title: 'Beğendiklerim',
  description: 'Beğendiğin makaleler burada görünür',
  icon: 'mdi-heart',
  iconClass: 'text-red-500',
  statsIcon: 'mdi-heart-multiple',
  statsText: 'beğenilen makale',
  dateIcon: 'mdi-calendar-heart',
  actionText: 'beğenildi',
  removeIcon: 'mdi-heart-remove',
  removeButtonTitle: 'Beğeniyi kaldır',
  sortOptions: [
    { value: 'newest', label: 'En Yeni' },
    { value: 'oldest', label: 'En Eski' },
    { value: 'title', label: 'Başlık (A-Z)' },
    { value: 'popular', label: 'En Popüler' }
  ],
  emptyState: {
    icon: 'mdi-heart-outline',
    title: 'Henüz beğendiğin makale yok',
    description: 'Beğendiğin makaleleri burada görebilirsin. Makale sayfasında kalp butonuna tıklayarak makaleleri beğenebilirsin.'
  },
  service: {
    getMyItems: (params) => likeService.getMyLikes(params),
    toggleItem: (articleId) => likeService.toggleLike(articleId)
  },
  errorMessage: 'Beğenilen makaleler yüklenirken hata oluştu',
  successMessage: 'Beğeni kaldırıldı',
  removeErrorMessage: 'Beğeni kaldırılırken hata oluştu'
}
</script>