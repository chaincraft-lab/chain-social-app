<template>
  <div class="flex items-center justify-between p-4">
    <div class="flex items-center gap-3">
      <UserAvatar :name="authorName" size="md" color="primary" />
      <div class="flex flex-col">
        <div class="text-sm font-semibold text-gray-900">{{ authorName }}</div>
        <div class="text-xs text-gray-500">{{ formattedDate }}</div>
      </div>
    </div>
    <ActionButton icon="dots" size="sm" @click="$emit('menuClick')" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import UserAvatar from '../../common/UserAvatar.vue'
import ActionButton from '../../common/ActionButton.vue'

const props = defineProps({
  author: { type: Object, required: true },
  date: { type: [String, Date], required: true }
})

defineEmits(['menuClick'])

const authorName = computed(() => {
  if (props.author?.name) {
    return props.author.name
  }
  if (props.author?.firstName && props.author?.lastName) {
    return `${props.author.firstName} ${props.author.lastName}`
  }
  return 'Editör'
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  const date = new Date(props.date)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Az önce'
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays < 7) return `${diffDays} gün önce`
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short'
  })
})
</script>