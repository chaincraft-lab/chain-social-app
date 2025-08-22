<template>
  <button
    @click="$emit('login')"
    class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
    style="background-color: var(--color-auth-bg); color: var(--color-auth-text)"
    @mouseover="$event.target.style.backgroundColor = 'var(--color-auth-hover)'"
    @mouseout="$event.target.style.backgroundColor = 'var(--color-auth-bg)'"
  >
    <Icon icon="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
    <span>{{ buttonText }}</span>
  </button>
</template>

<script setup>
defineProps({
  buttonText: { type: String, default: 'Giriş Yap' }
})

defineEmits(['login'])
</script>