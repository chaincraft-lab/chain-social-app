<template>
  <div
    v-if="isVisible"
    class="mb-4 p-3 bg-dark-800 rounded-lg"
  >
    <div class="flex items-center mb-3">
      <Icon
        icon="heroicons:user"
        class="w-8 h-8 mr-3 text-primary"
      />
      <div>
        <p class="text-sm font-medium text-light">
          {{ user?.name || t('navigation.user') }}
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
        <Icon :icon="menuItem.iconName" class="w-4 h-4 mr-2" />
        {{ menuItem.label }}
      </router-link>
      <button
        @click="$emit('logout')"
        class="flex items-center w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-dark-600 rounded-md transition-colors"
      >
        <Icon icon="heroicons:arrow-right-end-on-rectangle" class="w-4 h-4 mr-2" />
        {{ t('navigation.logout') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  user: { type: Object, default: () => ({}) },
  menuItems: {
    type: Array,
    default: () => []
  }
})

const defaultMenuItems = computed(() => [
  {
    to: '/profile',
    label: t('navigation.profile'),
    iconName: 'heroicons:user'
  },
  {
    to: '/bookmarks',
    label: t('navigation.bookmarks'),
    iconName: 'heroicons:bookmark'
  },
  {
    to: '/likes',
    label: t('navigation.likes'),
    iconName: 'heroicons:heart'
  }
])

const menuItems = computed(() => props.menuItems.length > 0 ? props.menuItems : defaultMenuItems.value)

defineEmits(['close', 'logout'])
</script>

