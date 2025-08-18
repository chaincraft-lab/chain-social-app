<template>
  <button
    @click="$emit('login')"
    class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
    style="background-color: var(--color-auth-bg); color: var(--color-auth-text)"
    @mouseover="$event.target.style.backgroundColor = 'var(--color-auth-hover)'"
    @mouseout="$event.target.style.backgroundColor = 'var(--color-auth-bg)'"
  >
    <svg
      class="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
      />
    </svg>
    <span>{{ buttonText }}</span>
  </button>
</template>

<script setup>
defineProps({
  buttonText: { type: String, default: 'Giriş Yap' }
})

defineEmits(['login'])
</script>