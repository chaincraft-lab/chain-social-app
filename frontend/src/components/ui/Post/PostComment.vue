<template>
  <div v-if="showComments || commentsCount > 0">
    <!-- Comments Preview -->
    <div v-if="commentsCount > 0 && !showComments" class="px-4 pb-3">
      <button
        @click="$emit('toggleComments')"
        class="text-sm text-gray-500 hover:underline"
      >
        {{ commentsCount }} yorumun tümünü gör
      </button>
    </div>

    <!-- Comments List -->
    <div v-if="showComments" class="border-t border-gray-200 px-4 py-3">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex items-start gap-3 mb-3"
      >
        <UserAvatar :name="comment.author" size="sm" color="gray" />
        <div class="flex-1 text-sm">
          <span class="font-semibold text-gray-900">{{ comment.author }}</span>
          <span class="text-gray-900 ml-1">{{ comment.text }}</span>
        </div>
      </div>

      <!-- Add Comment -->
      <div class="mt-3 pt-3 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <input
            v-model="newComment"
            type="text"
            placeholder="Yorum ekle..."
            class="flex-1 text-sm border-none outline-none placeholder-gray-500"
            @keyup.enter="handleAddComment"
          />
          <button
            v-if="newComment.trim()"
            @click="handleAddComment"
            class="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserAvatar from '../../common/UserAvatar.vue'

const props = defineProps({
  comments: { type: Array, default: () => [] },
  commentsCount: { type: Number, default: 0 },
  showComments: { type: Boolean, default: false }
})

const emit = defineEmits(['toggleComments', 'addComment'])

const newComment = ref('')

const handleAddComment = () => {
  if (newComment.value.trim()) {
    emit('addComment', newComment.value.trim())
    newComment.value = ''
  }
}
</script>