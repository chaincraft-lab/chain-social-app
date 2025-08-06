<template>
  <v-container fluid class="py-8">
    <!-- Header Section -->
    <div class="text-center mb-12">
      <h1 class="text-h3 font-weight-bold mb-4 text-dark">Savunma Güç Ligleri</h1>
      <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 600px;">
        Dünya genelindeki ülkelerin savunma güçlerinin karşılaştırmalı sıralaması. Bu veriler, ülkelerin askeri kapasitelerini, teknolojik altyapılarını ve savunma sanayii gelişmişliklerini yansıtmaktadır.
      </p>
    </div>

    <!-- Tab Navigation -->
    <v-card class="mb-8" elevation="2" rounded="xl">
      <v-tabs 
        v-model="activeTab" 
        color="primary" 
        center-active
        show-arrows
        class="px-4"
      >
        <v-tab 
          v-for="tab in tabs" 
          :key="tab.id"
          :value="tab.id"
          class="text-none font-weight-medium"
        >
          <v-icon start size="small">{{ tab.icon }}</v-icon>
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </v-card>

    <!-- Tab Content Windows -->
    <v-window v-model="activeTab" class="mt-4">
      <v-window-item 
        v-for="tab in tabs" 
        :key="tab.id"
        :value="tab.id"
      >
        <v-card elevation="3" rounded="xl" class="overflow-hidden">
          <!-- Tab Header -->
          <v-card-title class="d-flex align-center pa-6 bg-gradient">
            <v-icon class="me-3" size="large">{{ tab.icon }}</v-icon>
            <span class="text-h4 font-weight-bold">{{ tab.name }}</span>
          </v-card-title>
          
          <!-- Rankings Table -->
          <v-card-text class="pa-6">
            <v-data-table
              :headers="tableHeaders"
              :items="tab.countries"
              :items-per-page="10"
              class="elevation-1 rounded-lg"
              item-value="name"
            >
              <template v-slot:[`item.rank`]="{ index }">
                <v-chip
                  :color="getRankColor(index + 1)"
                  size="small"
                  class="font-weight-bold"
                >
                  {{ index + 1 }}
                </v-chip>
              </template>
              
              <template v-slot:[`item.flag`]="{ item }">
                <span class="text-h6">{{ item.flag }}</span>
              </template>
              
              <template v-slot:[`item.name`]="{ item }">
                <div class="font-weight-medium">{{ item.name }}</div>
              </template>
              
              <template v-slot:[`item.score`]="{ item }">
                <div class="d-flex align-center">
                  <v-progress-linear
                    :model-value="(item.score / 100) * 100"
                    :color="getScoreColor(item.score)"
                    height="8"
                    rounded
                    class="me-3"
                    style="min-width: 100px;"
                  ></v-progress-linear>
                  <span class="font-weight-bold">{{ item.score }}</span>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
          
          <!-- Chart Section -->
          <v-card-text class="pt-0">
            <v-card class="pa-4" elevation="1" rounded="lg">
              <h3 class="text-h6 mb-4 font-weight-bold text-center">{{ tab.name }} Güç Dağılımı</h3>
              <canvas :id="`${tab.id}-chart`" class="chart-canvas"></canvas>
            </v-card>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Etkinlik Geri Sayım ve Sponsor Alanı -->
    <v-row class="mt-12">
      <!-- Etkinlik Geri Sayım -->
      <v-col cols="12" md="6">
        <v-card elevation="8" rounded="xl" class="overflow-hidden">
          <v-card-title class="pa-4 bg-gradient text-white">
            <v-icon class="me-2">mdi-calendar-star</v-icon>
            Yaklaşan Savunma Fuarı
          </v-card-title>
          
          <v-card-text class="pa-6">
            <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center mb-4">
              <div class="mb-3 mb-sm-0">
                <h4 class="text-h6 font-weight-bold text-grey-darken-3">IDEF 2024</h4>
                <div class="d-flex align-center mt-1 text-medium-emphasis text-body-2">
                  <v-icon size="small" class="me-1">mdi-map-marker</v-icon>
                  <span>İstanbul, Türkiye</span>
                </div>
                <div class="d-flex align-center mt-1 text-medium-emphasis text-body-2">
                  <v-icon size="small" class="me-1">mdi-calendar</v-icon>
                  <span>25-28 Aralık 2024</span>
                </div>
              </div>
              
              <div class="d-flex flex-wrap ga-2 w-100 w-sm-auto justify-start justify-sm-end">
                <v-card 
                  class="text-center countdown-card"
                  color="grey-darken-3"
                  dark
                  width="60"
                  elevation="2"
                  rounded="lg"
                >
                  <v-card-text class="pa-2">
                    <div class="text-h6 font-weight-bold">{{ countdown.days }}</div>
                    <div class="text-caption text-uppercase">Gün</div>
                  </v-card-text>
                </v-card>
                
                <v-card 
                  class="text-center countdown-card"
                  color="grey-darken-3"
                  dark
                  width="60"
                  elevation="2"
                  rounded="lg"
                >
                  <v-card-text class="pa-2">
                    <div class="text-h6 font-weight-bold">{{ countdown.hours }}</div>
                    <div class="text-caption text-uppercase">Saat</div>
                  </v-card-text>
                </v-card>
                
                <v-card 
                  class="text-center countdown-card"
                  color="grey-darken-3"
                  dark
                  width="60"
                  elevation="2"
                  rounded="lg"
                >
                  <v-card-text class="pa-2">
                    <div class="text-h6 font-weight-bold">{{ countdown.minutes }}</div>
                    <div class="text-caption text-uppercase">Dk</div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
            
            <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-2">
              <div class="text-body-2 text-medium-emphasis mb-2 mb-sm-0">
                <v-chip size="small" color="grey-lighten-2" class="me-1">Savunma</v-chip>
                <v-chip size="small" color="grey-lighten-2">Teknoloji</v-chip>
              </div>
              <v-btn
                :to="{ path: '/etkinlikler' }"
                color="secondary"
                variant="flat"
                size="small"
                append-icon="mdi-arrow-right"
                rounded="lg"
                class="w-100 w-sm-auto"
              >
                Tüm Etkinlikler
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Sponsor Alanı -->
      <v-col cols="12" md="6">
        <v-card elevation="8" rounded="xl" class="overflow-hidden">
          <v-card-title class="pa-4 bg-gradient text-white">
            <v-icon class="me-2">mdi-handshake</v-icon>
            Sponsorlar
          </v-card-title>
          
          <v-card-text class="pa-6">
            <v-row class="mb-4">
              <v-col cols="4" v-for="n in 3" :key="n">
                <v-card 
                  class="d-flex align-center justify-center sponsor-card"
                  color="grey-lighten-4"
                  height="80"
                  elevation="1"
                  rounded="lg"
                  hover
                >
                  <v-img 
                    src="@/assets/logo.png" 
                    :alt="`Sponsor ${n}`"
                    max-height="48"
                    contain
                  ></v-img>
                </v-card>
              </v-col>
            </v-row>
            
            <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-2">
              <span class="text-caption text-medium-emphasis">Sponsorlarımıza teşekkür ederiz</span>
              <v-btn
                :to="{ path: '/sponsorlar' }"
                variant="text"
                color="primary"
                size="small"
                append-icon="mdi-chevron-right"
              >
                Tüm Sponsorlar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

    // Data table headers
    const tableHeaders = [
      {
        title: 'Sıra',
        align: 'center',
        sortable: false,
        key: 'rank',
        width: '80px'
      },
      {
        title: 'Bayrak',
        align: 'center',
        sortable: false,
        key: 'flag',
        width: '60px'
      },
      {
        title: 'Ülke',
        align: 'start',
        sortable: true,
        key: 'name'
      },
      {
        title: 'Puan',
        align: 'center',
        sortable: true,
        key: 'score',
        width: '200px'
      }
    ];

    // Get rank color based on position
    const getRankColor = (rank) => {
      if (rank === 1) return 'warning'; // Gold
      if (rank === 2) return 'grey-lighten-1'; // Silver
      if (rank === 3) return 'brown'; // Bronze
      if (rank <= 5) return 'primary';
      if (rank <= 10) return 'secondary';
      return 'grey';
    };

    // Get score color based on value
    const getScoreColor = (score) => {
      if (score >= 90) return 'success';
      if (score >= 80) return 'primary';
      if (score >= 70) return 'warning';
      return 'error';
    };

    return {
      activeTab,
      tabs,
      countdown,
      setActiveTab,
      tableHeaders,
      getRankColor,
      getScoreColor
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

/* Background gradient for tab headers and event cards */
.bg-gradient {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-primary)) 100%);
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient:hover {
  background-position: right center;
}

/* Chart canvas styling */
.chart-canvas {
  width: 100% !important;
  height: 300px !important;
}

/* Countdown card animations */
.countdown-card {
  animation: pulse 2s infinite;
}

.countdown-card:nth-child(1) {
  animation-delay: 0s;
}

.countdown-card:nth-child(2) {
  animation-delay: 0.5s;
}

.countdown-card:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Sponsor card hover effects */
.sponsor-card {
  transition: all 0.3s ease;
}

.sponsor-card:hover {
  transform: scale(1.05);
  border-color: rgb(var(--v-theme-primary));
}

/* Data table responsive styling */
:deep(.v-data-table) {
  border-radius: 12px;
}

:deep(.v-data-table-header__content) {
  font-weight: 600;
}

/* Progress bar styling in table */
:deep(.v-progress-linear) {
  border-radius: 4px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .chart-canvas {
    height: 250px !important;
  }
}
</style> 