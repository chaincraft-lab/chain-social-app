<template>
  <div class="profile-avatar-upload">
    <!-- Upload Area -->
    <div 
      @drop.prevent="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      class="border-2 border-dashed theme-border-primary rounded-lg p-6 text-center transition-colors"
      :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': dragOver }"
      @dragenter="dragOver = true"
      @dragleave="dragOver = false"
    >
      <div v-if="!selectedFile && !previewUrl">
        <Icon icon="heroicons:cloud-arrow-up" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p class="text-lg font-medium theme-text-primary mb-2">Fotoğraf Yükle</p>
        <p class="text-sm theme-text-secondary mb-4">
          Dosyayı buraya sürükleyin veya seçmek için tıklayın
        </p>
        <button 
          @click="$refs.fileInput.click()"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Dosya Seç
        </button>
        <input 
          ref="fileInput"
          type="file" 
          accept="image/*" 
          @change="handleFileSelect"
          class="hidden"
        />
      </div>
      
      <!-- Preview -->
      <div v-else class="space-y-4">
        <div class="relative inline-block">
          <img 
            :src="previewUrl" 
            alt="Preview"
            class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button 
            @click="removeFile"
            class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <Icon icon="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
        
        <div>
          <p class="font-medium theme-text-primary">{{ selectedFile?.name }}</p>
          <p class="text-sm theme-text-secondary">{{ formatFileSize(selectedFile?.size) }}</p>
        </div>
      </div>
    </div>
    
    <!-- File Requirements -->
    <div class="mt-4 p-3 theme-bg-secondary rounded-lg">
      <h4 class="font-medium theme-text-primary mb-2">Dosya Gereksinimleri:</h4>
      <ul class="text-sm theme-text-secondary space-y-1">
        <li>• Desteklenen formatlar: JPG, PNG, GIF</li>
        <li>• Maksimum dosya boyutu: 5MB</li>
        <li>• Önerilen boyut: 400x400 piksel</li>
        <li>• Kare formatı en iyi sonucu verir</li>
      </ul>
    </div>
    
    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
      <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
        <Icon icon="heroicons:exclamation-circle" class="w-5 h-5" />
        <span class="text-sm">{{ error }}</span>
      </div>
    </div>
    
    <!-- Upload Progress -->
    <div v-if="uploading" class="mt-4">
      <div class="flex items-center gap-2 mb-2">
        <Icon icon="heroicons:arrow-up-tray" class="w-5 h-5 text-blue-500" />
        <span class="text-sm theme-text-primary">Yükleniyor...</span>
        <span class="text-sm theme-text-secondary">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-blue-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-3 mt-6">
      <button 
        @click="uploadFile"
        :disabled="!selectedFile || uploading"
        class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {{ uploading ? 'Yükleniyor...' : 'Fotoğrafı Kaydet' }}
      </button>
      
      <button 
        @click="$emit('cancel')"
        class="flex-1 theme-bg-secondary hover:theme-bg-primary theme-text-secondary hover:theme-text-primary font-medium py-2 px-4 rounded-lg transition-colors"
      >
        İptal
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

// Emits
const emit = defineEmits(['upload-success', 'cancel'])

// State
const selectedFile = ref(null)
const previewUrl = ref('')
const dragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')

// Methods
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  processFile(file)
}

const handleDrop = (event) => {
  dragOver.value = false
  const file = event.dataTransfer.files[0]
  processFile(file)
}

const processFile = (file) => {
  error.value = ''
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Lütfen bir resim dosyası seçin'
    return
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Dosya boyutu 5MB\'dan küçük olmalıdır'
    return
  }
  
  selectedFile.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeFile = () => {
  selectedFile.value = null
  previewUrl.value = ''
  error.value = ''
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  uploading.value = true
  uploadProgress.value = 0
  error.value = ''
  
  try {
    // Simulate upload progress
    const interval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 100) {
        clearInterval(interval)
      }
    }, 200)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock uploaded URL
    const mockUrl = URL.createObjectURL(selectedFile.value)
    
    emit('upload-success', mockUrl)
  } catch (err) {
    error.value = 'Dosya yüklenirken bir hata oluştu'
    console.error('Upload error:', err)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>

<style scoped>
.profile-avatar-upload {
  max-width: 400px;
  margin: 0 auto;
}
</style>