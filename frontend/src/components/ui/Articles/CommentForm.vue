<template>
  <div class="bg-gray-50 rounded-lg p-6 mb-6">
    <h4 class="text-lg font-semibold mb-4 text-gray-900">Yorum Yap</h4>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="comment" class="sr-only">Yorumunuz</label>
        <textarea 
          id="comment"
          v-model="form.text"
          rows="4" 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Yorumunuzu yazın..."
          required
        ></textarea>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="name" class="sr-only">Adınız</label>
          <input 
            id="name"
            type="text" 
            v-model="form.name"
            placeholder="Adınız" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div>
          <label for="email" class="sr-only">E-posta</label>
          <input 
            id="email"
            type="email" 
            v-model="form.email"
            placeholder="E-posta adresiniz" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        :disabled="isSubmitting"
        class="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        {{ isSubmitting ? 'Gönderiliyor...' : 'Yorum Gönder' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['submit'])

const isSubmitting = ref(false)
const form = reactive({
  text: '',
  name: '',
  email: ''
})

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    await emit('submit', { ...form })
    
    // Reset form
    form.text = ''
    form.name = ''
    form.email = ''
  } catch (error) {
    console.error('Comment submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>