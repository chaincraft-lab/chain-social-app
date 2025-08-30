<template>
  <UserContentListPage :config="bookmarksConfig" />
</template>

<script setup>
import UserContentListPage from '@/components/pages/UserContentListPage.vue'
import { bookmarkService } from '@/services'

const bookmarksConfig = {
  type: 'bookmarks',
  title: 'Kaydettiklerim',
  description: 'Kaydettiğin makaleler burada görünür',
  icon: 'mdi-bookmark',
  iconClass: 'text-primary',
  statsIcon: 'mdi-bookmark-multiple',
  statsText: 'kayıtlı makale',
  dateIcon: 'mdi-calendar-plus',
  actionText: 'kaydedildi',
  removeIcon: 'mdi-bookmark-remove',
  removeButtonTitle: 'Kayıtlardan kaldır',
  sortOptions: [
    { value: 'newest', label: 'En Yeni' },
    { value: 'oldest', label: 'En Eski' },
    { value: 'title', label: 'Başlık (A-Z)' }
  ],
  emptyState: {
    icon: 'mdi-bookmark-outline',
    title: 'Henüz kayıtlı makalen yok',
    description: 'Beğendiğin makaleleri kaydetmek için makale sayfasında yer imi butonuna tıklayabilirsin.'
  },
  service: {
    getMyItems: (params) => bookmarkService.getMyBookmarks(params),
    toggleItem: (articleId) => bookmarkService.toggleBookmark(articleId)
  },
  errorMessage: 'Kayıtlı makaleler yüklenirken hata oluştu',
  successMessage: 'Makale kayıtlardan kaldırıldı',
  removeErrorMessage: 'Kayıt kaldırılırken hata oluştu'
}
</script>