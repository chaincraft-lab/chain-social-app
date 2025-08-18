<template>
  <div class="relative">
    <!-- Profile Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
    >
      <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
        <svg
          class="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <span v-if="showName" class="text-sm font-medium hidden md:block">
        {{ user?.name || "Kullanıcı" }}
      </span>
      <svg
        v-if="showName"
        class="w-4 h-4 hidden md:block"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Profile Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      @mouseleave="hideDropdown"
    >
      <!-- User Info -->
      <div v-if="showUserInfo" class="px-4 py-3 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ user?.name || "Kullanıcı" }}
            </p>
            <p class="text-xs text-gray-500">
              {{ user?.email }}
            </p>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="py-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="hideDropdown"
          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg
            class="w-4 h-4 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="item.icon"
            />
          </svg>
          {{ item.label }}
        </router-link>
      </div>

      <!-- Logout -->
      <div class="border-t border-gray-200 py-1">
        <button
          @click="$emit('logout')"
          class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg
            class="w-4 h-4 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Çıkış Yap
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  user: { type: Object, default: () => ({}) },
  showName: { type: Boolean, default: true },
  showUserInfo: { type: Boolean, default: true },
  menuItems: {
    type: Array,
    default: () => [
      {
        path: '/profile',
        label: 'Profilim',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      },
      {
        path: '/bookmarks',
        label: 'Kaydettiklerim',
        icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
      },
      {
        path: '/likes',
        label: 'Beğendiklerim',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
      }
    ]
  }
})

defineEmits(['logout'])

const showDropdown = ref(false)
let dropdownTimeout = null

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const hideDropdown = () => {
  dropdownTimeout = setTimeout(() => {
    showDropdown.value = false
  }, 150)
}
</script>