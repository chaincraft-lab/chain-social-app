<template>
  <div class="flex space-x-3">
    <button
      v-for="platform in platforms"
      :key="platform.name"
      @click="share(platform)"
      :class="[
        'p-2 rounded-lg transition-colors duration-200',
        'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
      ]"
      :title="t('common.shareOn', { platform: platform.name })"
    >
      <span class="sr-only">{{ platform.name }}</span>
      
      <Icon :icon="getIconName(platform.name)" class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  platforms: { 
    type: Array, 
    default: () => ['facebook', 'twitter', 'linkedin', 'whatsapp'] 
  }
})

const platforms = computed(() => {
  const platformMap = {
    facebook: { name: 'Facebook' },
    twitter: { name: 'Twitter' },
    linkedin: { name: 'LinkedIn' },
    whatsapp: { name: 'WhatsApp' }
  }
  
  return props.platforms.map(name => platformMap[name]).filter(Boolean)
})

const getIconName = (platformName) => {
  const iconMap = {
    'Facebook': 'mdi:facebook',
    'Twitter': 'mdi:twitter',
    'LinkedIn': 'mdi:linkedin',
    'WhatsApp': 'mdi:whatsapp'
  }
  return iconMap[platformName] || 'mdi:share'
}

const share = (platform) => {
  const encodedUrl = encodeURIComponent(props.url)
  const encodedTitle = encodeURIComponent(props.title)
  const encodedDescription = encodeURIComponent(props.description)
  
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`
  }
  
  const url = shareUrls[platform.name.toLowerCase()]
  if (url) {
    window.open(url, '_blank', 'width=600,height=400')
  }
}
</script>