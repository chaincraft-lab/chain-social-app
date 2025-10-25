<template>
  <div class="text-center mb-8">
    <div class="flex items-center justify-center mb-4">
      <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
        <Icon icon="heroicons:newspaper" class="w-6 h-6 text-white" />
      </div>
    </div>
    <h2 class="text-2xl font-bold theme-text-primary mb-2">{{ title || $t('auth.header.title') }}</h2>
    <p class="theme-text-secondary text-sm">{{ subtitle || $t('auth.header.subtitle') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})
</script>