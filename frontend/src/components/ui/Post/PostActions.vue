<template>
  <div class="flex items-center justify-between px-2 py-3">
    <div class="flex items-center gap-1">
      <ActionButton
        icon="heart"
        :filled="isLiked"
        :color="isLiked ? 'red' : 'gray'"
        :loading="loadingLike"
        @click="$emit('toggleLike')"
      />
      <ActionButton
        icon="comment"
        color="gray"
        @click="$emit('toggleComments')"
      />
      <ActionButton
        icon="share"
        color="gray"
        @click="$emit('sharePost')"
      />
    </div>
    
    <ActionButton
      icon="bookmark"
      :filled="isBookmarked"
      :color="isBookmarked ? 'primary' : 'gray'"
      :loading="loadingBookmark"
      @click="$emit('toggleBookmark')"
    />
  </div>
</template>

<script setup>
import ActionButton from '../../common/ActionButton.vue'

defineProps({
  isLiked: { type: Boolean, default: false },
  isBookmarked: { type: Boolean, default: false },
  loadingLike: { type: Boolean, default: false },
  loadingBookmark: { type: Boolean, default: false }
})

defineEmits(['toggleLike', 'toggleComments', 'sharePost', 'toggleBookmark'])
</script>