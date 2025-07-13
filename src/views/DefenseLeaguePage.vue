<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Savunma Güç Ligleri</h1>
    <p class="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
      Dünya genelindeki ülkelerin savunma güçlerinin karşılaştırmalı sıralaması. Bu veriler, ülkelerin askeri kapasitelerini, teknolojik altyapılarını ve savunma sanayii gelişmişliklerini yansıtmaktadır.
    </p>

    <!-- Sekme Butonları -->
    <div class="tabs flex flex-wrap justify-center gap-3 mb-8">
      <button 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-button" 
        :class="[activeTab === tab.id ? 'active bg-primary text-white' : 'bg-gray-200 text-gray-800', 
                'px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-gray-300 shadow-md transform hover:-translate-y-1']"
        @click="setActiveTab(tab.id)"
      >
        <span class="mr-2">{{ tab.icon }}</span>{{ tab.name }}
      </button>
    </div>

    <!-- Sekme İçerikleri -->
    <div 
      v-for="tab in tabs" 
      :key="tab.id"
      :id="tab.id" 
      class="tab-content p-6 bg-gray-50 rounded-lg shadow-inner animate-fade-in"
      :class="{ 'hidden': activeTab !== tab.id }"
    >
      <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-3">
        {{ tab.icon }} {{ tab.name }}
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead class="bg-dark text-light">
            <tr>
              <th class="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Sıra</th>
              <th class="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Ülke</th>
              <th class="py-3 px-4 text-center text-sm font-medium uppercase tracking-wider">Bayrak</th>
              <th class="py-3 px-4 text-right text-sm font-medium uppercase tracking-wider">Puan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(country, index) in tab.countries" :key="country.name" :class="index % 2 === 0 ? 'bg-white text-gray-800' : 'bg-gray-50 text-gray-800'">
              <td class="py-3 px-4 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-4 text-left font-medium">{{ country.name }}</td>
              <td class="py-3 px-4 text-center">{{ country.flag }}</td>
              <td class="py-3 px-4 text-right font-bold">{{ country.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <canvas :id="`${tab.id}-chart`" class="mt-8 w-full h-80 bg-white rounded-lg shadow-lg p-4"></canvas>
    </div>

    <!-- Etkinlik Geri Sayım ve Sponsor Alanı -->
    <div class="mt-12 grid md:grid-cols-2 gap-4 lg:gap-8">
      <!-- Etkinlik Geri Sayım -->
      <div class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div class="bg-gradient-to-r from-primary to-primary-dark p-3 text-white">
          <h3 class="text-lg font-bold">Yaklaşan Savunma Fuarı</h3>
        </div>
        <div class="p-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div class="mb-3 sm:mb-0">
              <h4 class="font-bold text-lg text-gray-800">IDEF 2024</h4>
              <div class="flex items-center mt-1 text-gray-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>İstanbul, Türkiye</span>
              </div>
              <div class="flex items-center mt-1 text-gray-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>25-28 Aralık 2024</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <div class="bg-gradient-to-b from-dark to-dark-700 text-light px-2 py-1 rounded-lg text-center w-16 shadow-md">
                <span class="block text-lg font-bold">{{ countdown.days }}</span>
                <span class="text-xs uppercase tracking-wider">Gün</span>
              </div>
              <div class="bg-gradient-to-b from-dark to-dark-700 text-light px-2 py-1 rounded-lg text-center w-16 shadow-md">
                <span class="block text-lg font-bold">{{ countdown.hours }}</span>
                <span class="text-xs uppercase tracking-wider">Saat</span>
              </div>
              <div class="bg-gradient-to-b from-dark to-dark-700 text-light px-2 py-1 rounded-lg text-center w-16 shadow-md">
                <span class="block text-lg font-bold">{{ countdown.minutes }}</span>
                <span class="text-xs uppercase tracking-wider">Dk</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div class="text-sm text-gray-500 mb-2 sm:mb-0">
              <span class="inline-block px-2 py-1 bg-gray-100 rounded-full mr-1">Savunma</span>
              <span class="inline-block px-2 py-1 bg-gray-100 rounded-full">Teknoloji</span>
            </div>
            <router-link to="/etkinlikler" class="inline-flex items-center px-3 py-1 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors shadow-md text-sm w-full sm:w-auto justify-center">
              <span>Tüm Etkinlikler</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Sponsor Alanı -->
      <div class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div class="bg-gradient-to-r from-dark to-dark-700 p-3 text-white">
          <h3 class="text-lg font-bold">Sponsorlar</h3>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-3 gap-2 mb-4">
            <div class="bg-gray-50 p-2 rounded-lg flex items-center justify-center h-16 sm:h-20 border border-gray-200 hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <img src="@/assets/logo.png" alt="Sponsor 1" class="max-h-12 max-w-full" />
            </div>
            <div class="bg-gray-50 p-2 rounded-lg flex items-center justify-center h-16 sm:h-20 border border-gray-200 hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <img src="@/assets/logo.png" alt="Sponsor 2" class="max-h-12 max-w-full" />
            </div>
            <div class="bg-gray-50 p-2 rounded-lg flex items-center justify-center h-16 sm:h-20 border border-gray-200 hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <img src="@/assets/logo.png" alt="Sponsor 3" class="max-h-12 max-w-full" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span class="text-xs text-gray-500">Sponsorlarımıza teşekkür ederiz</span>
            <router-link to="/sponsorlar" class="text-primary hover:text-primary-dark transition-colors font-medium flex items-center text-sm">
              <span>Tüm Sponsorlar</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import { useRoute } from 'vue-router';

export default {
  name: 'DefenseLeaguePage',
  setup() {
    const route = useRoute();
    const activeTab = ref('kara');
    const charts = ref({});
    const eventDate = new Date('2024-12-31T00:00:00');
    const countdown = ref({ days: 0, hours: 0, minutes: 0 });
    let countdownInterval = null;

    const tabs = [
      {
        id: 'kara',
        name: 'Kara Güvenlik Ligi',
        icon: '🟫',
        countries: [
          { name: 'Türkiye', flag: '🇹🇷', score: 92 },
          { name: 'ABD', flag: '🇺🇸', score: 95 },
          { name: 'Rusya', flag: '🇷🇺', score: 89 },
          { name: 'Çin', flag: '🇨🇳', score: 87 },
          { name: 'İsrail', flag: '🇮🇱', score: 86 },
          { name: 'Almanya', flag: '🇩🇪', score: 84 },
          { name: 'Fransa', flag: '🇫🇷', score: 82 },
          { name: 'Birleşik Krallık', flag: '🇬🇧', score: 80 },
          { name: 'Hindistan', flag: '🇮🇳', score: 78 },
          { name: 'Güney Kore', flag: '🇰🇷', score: 77 },
          { name: 'İtalya', flag: '🇮🇹', score: 75 },
          { name: 'Japonya', flag: '🇯🇵', score: 74 },
          { name: 'Ukrayna', flag: '🇺🇦', score: 72 },
          { name: 'İran', flag: '🇮🇷', score: 70 },
          { name: 'Brezilya', flag: '🇧🇷', score: 68 }
        ]
      },
      {
        id: 'hava',
        name: 'Hava Güvenlik Ligi',
        icon: '🟦',
        countries: [
          { name: 'ABD', flag: '🇺🇸', score: 98 },
          { name: 'Rusya', flag: '🇷🇺', score: 90 },
          { name: 'Çin', flag: '🇨🇳', score: 88 },
          { name: 'İsrail', flag: '🇮🇱', score: 87 },
          { name: 'Türkiye', flag: '🇹🇷', score: 85 },
          { name: 'Fransa', flag: '🇫🇷', score: 84 },
          { name: 'Birleşik Krallık', flag: '🇬🇧', score: 82 },
          { name: 'Almanya', flag: '🇩🇪', score: 80 },
          { name: 'Hindistan', flag: '🇮🇳', score: 78 },
          { name: 'Japonya', flag: '🇯🇵', score: 76 },
          { name: 'İtalya', flag: '🇮🇹', score: 74 },
          { name: 'Güney Kore', flag: '🇰🇷', score: 73 },
          { name: 'İsveç', flag: '🇸🇪', score: 71 },
          { name: 'Kanada', flag: '🇨🇦', score: 69 },
          { name: 'Avustralya', flag: '🇦🇺', score: 67 }
        ]
      },
      {
        id: 'deniz',
        name: 'Deniz Güvenlik Ligi',
        icon: '🟦',
        countries: [
          { name: 'ABD', flag: '🇺🇸', score: 97 },
          { name: 'Çin', flag: '🇨🇳', score: 91 },
          { name: 'Rusya', flag: '🇷🇺', score: 88 },
          { name: 'Birleşik Krallık', flag: '🇬🇧', score: 86 },
          { name: 'Japonya', flag: '🇯🇵', score: 84 },
          { name: 'Fransa', flag: '🇫🇷', score: 83 },
          { name: 'Hindistan', flag: '🇮🇳', score: 80 },
          { name: 'Güney Kore', flag: '🇰🇷', score: 78 },
          { name: 'Türkiye', flag: '🇹🇷', score: 76 },
          { name: 'İtalya', flag: '🇮🇹', score: 75 },
          { name: 'Almanya', flag: '🇩🇪', score: 73 },
          { name: 'Avustralya', flag: '🇦🇺', score: 71 },
          { name: 'İspanya', flag: '🇪🇸', score: 70 },
          { name: 'Hollanda', flag: '🇳🇱', score: 68 },
          { name: 'Kanada', flag: '🇨🇦', score: 66 }
        ]
      },
      {
        id: 'siber',
        name: 'Siber Güvenlik Ligi',
        icon: '🟧',
        countries: [
          { name: 'ABD', flag: '🇺🇸', score: 96 },
          { name: 'İsrail', flag: '🇮🇱', score: 94 },
          { name: 'Birleşik Krallık', flag: '🇬🇧', score: 90 },
          { name: 'Çin', flag: '🇨🇳', score: 89 },
          { name: 'Rusya', flag: '🇷🇺', score: 87 },
          { name: 'Güney Kore', flag: '🇰🇷', score: 85 },
          { name: 'Almanya', flag: '🇩🇪', score: 83 },
          { name: 'Fransa', flag: '🇫🇷', score: 81 },
          { name: 'Japonya', flag: '🇯🇵', score: 79 },
          { name: 'Estonya', flag: '🇪🇪', score: 77 },
          { name: 'Kanada', flag: '🇨🇦', score: 76 },
          { name: 'Türkiye', flag: '🇹🇷', score: 75 },
          { name: 'Avustralya', flag: '🇦🇺', score: 73 },
          { name: 'Finlandiya', flag: '🇫🇮', score: 72 },
          { name: 'Singapur', flag: '🇸🇬', score: 70 }
        ]
      },
      {
        id: 'uzay',
        name: 'Uzay Güvenlik Ligi',
        icon: '🌌',
        countries: [
          { name: 'ABD', flag: '🇺🇸', score: 98 },
          { name: 'Çin', flag: '🇨🇳', score: 92 },
          { name: 'Rusya', flag: '🇷🇺', score: 90 },
          { name: 'Hindistan', flag: '🇮🇳', score: 82 },
          { name: 'Fransa', flag: '🇫🇷', score: 80 },
          { name: 'Japonya', flag: '🇯🇵', score: 78 },
          { name: 'İsrail', flag: '🇮🇱', score: 76 },
          { name: 'Birleşik Krallık', flag: '🇬🇧', score: 75 },
          { name: 'Almanya', flag: '🇩🇪', score: 73 },
          { name: 'İtalya', flag: '🇮🇹', score: 70 },
          { name: 'Kanada', flag: '🇨🇦', score: 68 },
          { name: 'Güney Kore', flag: '🇰🇷', score: 66 },
          { name: 'Türkiye', flag: '🇹🇷', score: 65 },
          { name: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', score: 62 },
          { name: 'Brezilya', flag: '🇧🇷', score: 60 }
        ]
      }
    ];

    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDate - now;
      
      if (diff <= 0) {
        countdown.value = { days: 0, hours: 0, minutes: 0 };
        clearInterval(countdownInterval);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      countdown.value = { days, hours, minutes };
    };

    const setActiveTab = (tabId) => {
      activeTab.value = tabId;
      setTimeout(() => {
        createChart(tabId);
      }, 100);
    };

    const createChart = (tabId) => {
      const tab = tabs.find(t => t.id === tabId);
      if (!tab) return;

      const ctx = document.getElementById(`${tabId}-chart`);
      if (!ctx) return;
      
      // Destroy existing chart if it exists
      if (charts.value[tabId]) {
        charts.value[tabId].destroy();
      }
      
      // Sort countries by score for the chart
      const sortedCountries = [...tab.countries].sort((a, b) => a.score - b.score);
      
      charts.value[tabId] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedCountries.map(country => `${country.flag} ${country.name}`),
          datasets: [{
            label: 'Güvenlik Puanı',
            data: sortedCountries.map(country => country.score),
            backgroundColor: tabId === 'kara' ? '#8B4513' : 
                            tabId === 'hava' ? '#4682B4' : 
                            tabId === 'deniz' ? '#1E90FF' : 
                            tabId === 'siber' ? '#FF8C00' : '#483D8B',
            borderColor: '#2c3e50',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: `${tab.name} Sıralaması`,
              font: {
                size: 16
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Puan'
              }
            }
          }
        }
      });
    };

    onMounted(() => {
      // Check if there's a category in the route params
      if (route.params.category) {
        const category = route.params.category;
        const tab = tabs.find(t => slugify(t.name) === category || t.id === category);
        if (tab) {
          activeTab.value = tab.id;
        }
      }
      
      // Initialize the first tab chart
      setTimeout(() => {
        createChart(activeTab.value);
      }, 100);
      
      // Start countdown
      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 60000); // Update every minute
    });

    // Watch for route changes to update the active tab
    watch(() => route.params.category, (newCategory) => {
      if (newCategory) {
        const tab = tabs.find(t => slugify(t.name) === newCategory || t.id === newCategory);
        if (tab) {
          setActiveTab(tab.id);
        }
      }
    });

    onUnmounted(() => {
      // Clean up charts and intervals
      Object.values(charts.value).forEach(chart => {
        if (chart) chart.destroy();
      });
      
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    });

    // Add slugify function
    const slugify = (text) => {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    };

    return {
      activeTab,
      tabs,
      countdown,
      setActiveTab
    };
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tab-button.active {
  position: relative;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--color-primary);
}

/* Modern kart stilleri */
.bg-white {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bg-white:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}

.bg-gray-50:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

/* Geri sayım animasyonu */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.bg-gradient-to-b {
  animation: pulse 2s infinite;
  animation-delay: calc(var(--animation-delay, 0) * 0.5s);
}

.bg-gradient-to-b:nth-child(1) {
  --animation-delay: 0;
}

.bg-gradient-to-b:nth-child(2) {
  --animation-delay: 1;
}

.bg-gradient-to-b:nth-child(3) {
  --animation-delay: 2;
}
</style> 