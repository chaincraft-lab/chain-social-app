<template>
  <UserContentListPage :config="likesConfig" />
</template>

<script setup>
import UserContentListPage from '@/components/pages/UserContentListPage.vue'
import { likeService } from '@/services'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const likesConfig = {
  type: 'likes',
  title: t('pages.likes.title'),
  description: t('pages.likes.emptyTitle'),
  icon: 'mdi-heart',
  iconClass: 'text-red-500',
  statsIcon: 'mdi-heart-multiple',
  statsText: t('pages.likes.statsText'),
  dateIcon: 'mdi-calendar-heart',
  actionText: t('pages.likes.actionText'),
  removeIcon: 'mdi-heart-remove',
  removeButtonTitle: t('pages.likes.removeButtonTitle'),
  sortOptions: [
    { value: 'newest', label: t('common.sorting.newest') },
    { value: 'oldest', label: t('common.sorting.oldest') },
    { value: 'title', label: t('common.sorting.titleAZ') },
    { value: 'popular', label: t('common.sorting.popular') }
  ],
  emptyState: {
    icon: 'mdi-heart-outline',
    title: t('pages.likes.emptyTitle'),
    description: t('pages.likes.emptyDescription')
  },
  service: {
    getMyItems: (params) => likeService.getMyLikes(params),
    toggleItem: (articleId) => likeService.toggleLike(articleId)
  },
  errorMessage: t('pages.likes.errorMessage'),
  successMessage: t('pages.likes.successMessage'),
  removeErrorMessage: t('pages.likes.removeErrorMessage')
}
</script>