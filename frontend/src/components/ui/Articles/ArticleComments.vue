<template>
  <div>
    <h3 class="text-xl font-bold mb-4 text-gray-900">
      Yorumlar {{ commentsCount > 0 ? `(${commentsCount})` : '' }}
    </h3>
    
    <div v-if="comments && comments.length > 0" class="space-y-4">
      <div 
        v-for="comment in comments" 
        :key="comment.id" 
        class="border-b border-gray-100 pb-4 last:border-b-0"
      >
        <div class="flex items-start">
          <UserAvatar 
            :name="comment.author" 
            size="md" 
            color="gray" 
            class="mr-3" 
          />
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <div class="font-medium text-gray-900">{{ comment.author }}</div>
              <div class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</div>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed">
              {{ comment.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-8 text-gray-500">
      <Icon icon="heroicons:chat-bubble-left-right" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
    </div>
  </div>
</template>

<script setup>
import UserAvatar from '../../common/UserAvatar.vue'

defineProps({
  comments: { type: Array, default: () => [] },
  commentsCount: { type: Number, default: 0 }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Az önce'
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays < 7) return `${diffDays} gün önce`
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>