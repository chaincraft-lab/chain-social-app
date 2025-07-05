<template>
  <aside>
    <!-- Advertisement -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div class="p-2 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Reklam
      </div>
      <div class="p-4 flex justify-center">
        <div class="bg-gray-200 w-full h-64 flex items-center justify-center text-gray-500">
          300x250 Reklam Alanı
        </div>
      </div>
    </div>
    
    <!-- Live Data -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div class="p-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Döviz Kurları
      </div>
      <div class="p-4">
        <div class="flex justify-between items-center mb-2 pb-2 border-b">
          <span class="font-medium">USD/TRY</span>
          <span class="text-green-600">32.45 ₺</span>
        </div>
        <div class="flex justify-between items-center mb-2 pb-2 border-b">
          <span class="font-medium">EUR/TRY</span>
          <span class="text-green-600">35.12 ₺</span>
        </div>
        <div class="flex justify-between items-center mb-2 pb-2 border-b">
          <span class="font-medium">GBP/TRY</span>
          <span class="text-red-600">41.08 ₺</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="font-medium">Altın (gr)</span>
          <span class="text-green-600">2,150.75 ₺</span>
        </div>
      </div>
    </div>
    
    <!-- Weather -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div class="p-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Hava Durumu
      </div>
      <div class="p-4 text-center">
        <div class="text-lg font-bold mb-1">İstanbul</div>
        <div class="text-3xl font-bold mb-2">23°C</div>
        <div class="text-sm text-gray-600">Parçalı Bulutlu</div>
      </div>
    </div>
    
    <!-- Newsletter -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-2 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Bülten
      </div>
      <div class="p-4">
        <p class="text-sm mb-3">Günlük haberleri e-posta kutunuza alın</p>
        <form @submit.prevent="subscribeNewsletter">
          <input 
            type="email" 
            v-model="email"
            placeholder="E-posta adresiniz" 
            class="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
          <button 
            type="submit" 
            class="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Abone Ol
          </button>
        </form>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'RightSidebar',
  setup() {
    const email = ref('')
    
    const subscribeNewsletter = () => {
      // This would be an API call in a real app
      alert(`${email.value} adresine bülten aboneliği başarıyla oluşturuldu!`)
      email.value = ''
    }
    
    return {
      email,
      subscribeNewsletter
    }
  }
}
</script> 