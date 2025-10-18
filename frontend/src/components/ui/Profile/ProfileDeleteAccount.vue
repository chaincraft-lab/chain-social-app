<template>
  <div class="profile-delete-account p-6">
    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-red-600 flex items-center gap-2 mb-2">
        <Icon icon="heroicons:trash" class="w-6 h-6" />
        Hesabı Sil
      </h2>
      <p class="theme-text-secondary">Bu işlem geri alınamaz. Lütfen dikkatli olun.</p>
    </div>

    <!-- Warning Box -->
    <div class="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-700">
      <div class="flex items-start gap-4">
        <Icon icon="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
        <div>
          <h3 class="text-lg font-bold text-red-700 dark:text-red-300 mb-2">Dikkat!</h3>
          <p class="text-red-600 dark:text-red-400 mb-4">
            Hesabınızı silmek <strong>kalıcı</strong> bir işlemdir ve <strong>geri alınamaz</strong>. 
            Bu işlemi gerçekleştirdiğinizde:
          </p>
          
          <ul class="space-y-2 text-red-600 dark:text-red-400">
            <li class="flex items-center gap-2">
              <Icon icon="heroicons:x-circle" class="w-4 h-4 flex-shrink-0" />
              <span>Tüm kişisel bilgileriniz silinecek</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="heroicons:x-circle" class="w-4 h-4 flex-shrink-0" />
              <span>Beğendiğiniz ve kaydettiğiniz haberler kaybolacak</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="heroicons:x-circle" class="w-4 h-4 flex-shrink-0" />
              <span>Yapmış olduğunuz yorumlar silinecek</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="heroicons:x-circle" class="w-4 h-4 flex-shrink-0" />
              <span>Hesabınıza bir daha erişemeyeceksiniz</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="heroicons:x-circle" class="w-4 h-4 flex-shrink-0" />
              <span>Bu e-posta adresiyle yeniden kayıt olmanız gerekecek</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Alternative Options -->
    <div class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <h4 class="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
        <Icon icon="heroicons:lightbulb" class="w-5 h-5" />
        Hesabı silmek yerine düşünebileceğiniz alternatifler:
      </h4>
      
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <Icon icon="heroicons:pause-circle" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-blue-700 dark:text-blue-300">Hesabı Geçici Olarak Devre Dışı Bırak</p>
            <p class="text-sm text-blue-600 dark:text-blue-400">Verileriniz korunur, istediğiniz zaman geri dönebilirsiniz</p>
          </div>
        </div>
        
        <div class="flex items-start gap-3">
          <Icon icon="heroicons:bell-slash" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-blue-700 dark:text-blue-300">Bildirimleri Kapat</p>
            <p class="text-sm text-blue-600 dark:text-blue-400">E-posta ve diğer bildirimlerden vazgeçin</p>
          </div>
        </div>
        
        <div class="flex items-start gap-3">
          <Icon icon="heroicons:eye-slash" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-blue-700 dark:text-blue-300">Gizlilik Ayarlarını Güncelleyin</p>
            <p class="text-sm text-blue-600 dark:text-blue-400">Profilinizi gizli yapın ve aktivitelerinizi sakla</p>
          </div>
        </div>
      </div>
      
      <div class="mt-4 flex flex-wrap gap-2">
        <button 
          @click="navigateToSettings"
          class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
        >
          Ayarlara Git
        </button>
        <button 
          @click="contactSupport"
          class="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm px-4 py-2 rounded-md transition-colors"
        >
          Destek İle İletişime Geç
        </button>
      </div>
    </div>

    <!-- Delete Account Form -->
    <div v-if="!showConfirmation" class="space-y-6">
      <h3 class="text-lg font-semibold theme-text-primary mb-4">
        Yine de hesabınızı silmek istiyorsanız:
      </h3>
      
      <form @submit.prevent="showDeleteConfirmation" class="space-y-4">
        <!-- Reason for Deletion -->
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            Hesabı silme nedeniniz nedir? (İsteğe bağlı)
          </label>
          <select
            v-model="deleteForm.reason"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Bir neden seçin</option>
            <option value="not-using">Artık kullanmıyorum</option>
            <option value="privacy">Gizlilik endişeleri</option>
            <option value="too-many-emails">Çok fazla e-posta alıyorum</option>
            <option value="found-alternative">Alternatif buldum</option>
            <option value="technical-issues">Teknik sorunlar</option>
            <option value="other">Diğer</option>
          </select>
        </div>
        
        <!-- Additional Comments -->
        <div v-if="deleteForm.reason === 'other'">
          <label class="block text-sm font-medium theme-text-primary mb-2">
            Açıklama
          </label>
          <textarea
            v-model="deleteForm.comments"
            rows="3"
            class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            placeholder="Lütfen açıklayın..."
            maxlength="500"
          ></textarea>
        </div>
        
        <!-- Password Confirmation -->
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            Şifrenizi girin *
          </label>
          <div class="relative">
            <input
              v-model="deleteForm.password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
              placeholder="Mevcut şifreniz"
              required
              :class="{ 'border-red-500': errors.password }"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon 
                :icon="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
                class="w-5 h-5" 
              />
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>
        
        <!-- Confirmation Checkbox -->
        <div>
          <label class="flex items-start gap-3">
            <input
              v-model="deleteForm.confirmDeletion"
              type="checkbox"
              class="w-4 h-4 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 mt-1"
              required
            />
            <span class="text-sm theme-text-primary">
              Hesabımı silmek istediğimi ve bu işlemin <strong>geri alınamaz</strong> olduğunu anlıyorum. 
              Tüm verilerimin kalıcı olarak silineceğini kabul ediyorum.
            </span>
          </label>
        </div>
        
        <button
          type="submit"
          :disabled="!deleteForm.password || !deleteForm.confirmDeletion"
          class="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Hesabı Silme İşlemini Başlat
        </button>
      </form>
    </div>

    <!-- Final Confirmation -->
    <div v-else class="space-y-6">
      <div class="text-center">
        <Icon icon="heroicons:exclamation-triangle" class="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-red-600 mb-2">Son Onay</h3>
        <p class="theme-text-secondary mb-6">
          Bu işlem geri alınamaz. Hesabınızı silmek için aşağıdaki metni yazın:
        </p>
        
        <div class="mb-6">
          <p class="text-lg font-mono font-bold theme-text-primary mb-3 p-3 theme-bg-secondary rounded border-2 border-dashed theme-border-primary">
            HESABIMI SİL
          </p>
          
          <input
            v-model="confirmationText"
            type="text"
            class="w-full max-w-md mx-auto px-4 py-3 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center font-mono"
            placeholder="Yukarıdaki metni yazın"
            @paste.prevent
          />
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="cancelDeletion"
            class="px-6 py-3 theme-bg-secondary hover:theme-bg-primary theme-text-secondary hover:theme-text-primary font-medium rounded-lg transition-colors"
          >
            İptal Et
          </button>
          
          <button
            @click="handleDeleteAccount"
            :disabled="confirmationText !== 'HESABIMI SİL' || isDeleting"
            class="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Icon 
              v-if="isDeleting" 
              icon="heroicons:arrow-path" 
              class="w-5 h-5 animate-spin" 
            />
            <span>{{ isDeleting ? 'Hesap Siliniyor...' : 'HESABI KALİCİ OLARAK SİL' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

// Emits
const emit = defineEmits(['delete-account'])

// State
const showConfirmation = ref(false)
const showPassword = ref(false)
const isDeleting = ref(false)
const confirmationText = ref('')

const deleteForm = ref({
  reason: '',
  comments: '',
  password: '',
  confirmDeletion: false
})

const errors = ref({
  password: ''
})

// Methods
const navigateToSettings = () => {
  // Navigate to user settings
  console.log('Navigate to settings')
  // this.$router.push('/profile/user-info')
}

const contactSupport = () => {
  // Open support contact
  console.log('Contact support')
  window.open('mailto:support@example.com?subject=Hesap Silme Desteği')
}

const showDeleteConfirmation = () => {
  if (!deleteForm.value.password) {
    errors.value.password = 'Şifre gereklidir'
    return
  }
  
  if (!deleteForm.value.confirmDeletion) {
    return
  }
  
  errors.value.password = ''
  showConfirmation.value = true
}

const cancelDeletion = () => {
  showConfirmation.value = false
  confirmationText.value = ''
}

const handleDeleteAccount = async () => {
  if (confirmationText.value !== 'HESABIMI SİL') {
    return
  }
  
  isDeleting.value = true
  
  try {
    await emit('delete-account', {
      password: deleteForm.value.password,
      reason: deleteForm.value.reason,
      comments: deleteForm.value.comments
    })
  } catch (error) {
    console.error('Account deletion failed:', error)
    alert('Hesap silme işlemi başarısız oldu. Lütfen tekrar deneyin.')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .profile-delete-account {
    padding: 1rem;
  }
}
</style>