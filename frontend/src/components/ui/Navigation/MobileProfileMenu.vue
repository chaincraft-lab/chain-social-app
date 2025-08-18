<template>
  <div
    v-if="isVisible"
    class="mb-4 p-3 bg-dark-800 rounded-lg"
  >
    <div class="flex items-center mb-3">
      <svg
        class="w-8 h-8 mr-3 text-primary"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9H21ZM9 7.5L3 7V9H9L9 7.5ZM12 7C13.86 7 15.45 8.41 15.82 10.24L22 12V14H21V20C21 21.1 20.1 22 19 22H17C15.9 22 15 21.1 15 20V14H9V20C9 21.1 8.1 22 7 22H5C3.9 22 3 21.1 3 20V14H2V12L8.18 10.24C8.55 8.41 10.14 7 12 7Z"
        />
      </svg>
      <div>
        <p class="text-sm font-medium text-light">
          {{ user?.name || "Kullanıcı" }}
        </p>
        <p class="text-xs text-light/70">{{ user?.email }}</p>
      </div>
    </div>
    <div class="space-y-2">
      <router-link
        v-for="menuItem in menuItems"
        :key="menuItem.to"
        :to="menuItem.to"
        @click="$emit('close')"
        class="flex items-center w-full text-left px-3 py-2 text-sm text-light hover:bg-dark-600 rounded-md transition-colors"
        :class="{ 'text-red-400': menuItem.type === 'danger' }"
      >
        <component :is="menuItem.icon" class="w-4 h-4 mr-2" />
        {{ menuItem.label }}
      </router-link>
      <button
        @click="$emit('logout')"
        class="flex items-center w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-dark-600 rounded-md transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
        Çıkış Yap
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isVisible: { type: Boolean, default: false },
  user: { type: Object, default: () => ({}) },
  menuItems: {
    type: Array,
    default: () => [
      {
        to: '/profile',
        label: 'Profilim',
        icon: 'ProfileIcon'
      },
      {
        to: '/bookmarks',
        label: 'Kaydettiklerim',
        icon: 'BookmarkIcon'
      },
      {
        to: '/likes',
        label: 'Beğendiklerim',
        icon: 'HeartIcon'
      }
    ]
  }
})

defineEmits(['close', 'logout'])
</script>

<script>
// Icon components as functional components
const ProfileIcon = {
  template: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>`
}

const BookmarkIcon = {
  template: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
  </svg>`
}

const HeartIcon = {
  template: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>`
}

export default {
  components: {
    ProfileIcon,
    BookmarkIcon,
    HeartIcon
  }
}
</script>