<template>
  <UserContentListPage :config="bookmarksConfig" />
</template>

<script setup>
import UserContentListPage from '@/components/pages/UserContentListPage.vue'
import { bookmarkService } from '@/services'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const bookmarksConfig = {
  type: 'bookmarks',
  title: t('pages.bookmarks.title'),
  description: t('pages.bookmarks.description'),
  icon: 'mdi-bookmark',
  iconClass: 'text-primary',
  statsIcon: 'mdi-bookmark-multiple',
  statsText: t('pages.bookmarks.statsText'),
  dateIcon: 'mdi-calendar-plus',
  actionText: t('pages.bookmarks.actionText'),
  removeIcon: 'mdi-bookmark-remove',
  removeButtonTitle: t('pages.bookmarks.removeButtonTitle'),
  sortOptions: [
    { value: 'newest', label: t('common.sorting.newest') },
    { value: 'oldest', label: t('common.sorting.oldest') },
    { value: 'title', label: t('common.sorting.titleAZ') }
  ],
  emptyState: {
    icon: 'mdi-bookmark-outline',
    title: t('pages.bookmarks.emptyTitle'),
    description: t('pages.bookmarks.emptyDescription')
  },
  service: {
    getMyItems: (params) => bookmarkService.getMyBookmarks(params),
    toggleItem: (articleId) => bookmarkService.toggleBookmark(articleId)
  },
  errorMessage: t('pages.bookmarks.errorMessage'),
  successMessage: t('pages.bookmarks.successMessage'),
  removeErrorMessage: t('pages.bookmarks.removeErrorMessage')
}
</script>