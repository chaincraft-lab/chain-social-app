<template>
  <div class="flex items-center space-x-3">
    <a
      v-for="social in socialLinks"
      :key="social.name"
      :href="social.url"
      :aria-label="social.name"
      class="text-gray-400 hover:text-gray-300 transition-colors"
    >
      <Icon :icon="getIconName(social.name)" class="w-5 h-5" />
    </a>
  </div>
</template>

<script setup>
defineProps({
  socialLinks: {
    type: Array,
    default: () => [
      { name: 'twitter', url: '#' },
      { name: 'instagram', url: '#' },
      { name: 'facebook', url: '#' }
    ]
  }
})

const getIconName = (socialName) => {
  const iconMap = {
    twitter: 'mdi:twitter',
    instagram: 'mdi:instagram',
    facebook: 'mdi:facebook',
    youtube: 'mdi:youtube',
    linkedin: 'mdi:linkedin'
  }
  return iconMap[socialName] || 'mdi:link'
}
</script>