<template>
  <button
    @click="toggleTheme"
    class="theme-toggle-btn flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300"
    :class="themeButtonClass"
    :title="isDarkMode ? 'Light Mode\'a geç' : 'Dark Mode\'a geç'"
    :aria-label="isDarkMode ? 'Light Mode\'a geç' : 'Dark Mode\'a geç'"
  >
    <!-- Light mode icon (güneş) -->
    <Icon
      v-if="!isDarkMode"
      icon="heroicons:sun"
      class="w-5 h-5 transition-transform duration-300 hover:rotate-90"
    />

    <!-- Dark mode icon (ay) -->
    <Icon
      v-else
      icon="heroicons:moon"
      class="w-5 h-5 transition-transform duration-300 hover:rotate-12"
    />

    <!-- Hover effect circle -->
    <div
      class="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 z-0"
      :class="hoverEffectClass"
    ></div>
  </button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ThemeToggle',
  computed: {
    ...mapGetters('theme', ['isDarkMode']),
    
    themeButtonClass() {
      return this.isDarkMode
        ? 'text-yellow-300 bg-gray-800 border border-gray-700 hover:bg-gray-700'
        : 'text-orange-500 bg-yellow-50 border border-orange-200 hover:bg-orange-50'
    },
    
    hoverEffectClass() {
      return this.isDarkMode
        ? 'bg-yellow-300/10 group-hover:opacity-100'
        : 'bg-orange-500/10 group-hover:opacity-100'
    }
  },
  methods: {
    ...mapActions('theme', ['toggleTheme'])
  }
}
</script>

<style scoped>
.theme-toggle-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.theme-toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

/* Icon animasyonları */
.theme-toggle-btn svg {
  position: relative;
  z-index: 2;
  display: block;
  margin: auto;
}

/* Light mode stilleri */
.theme-toggle-btn.light-mode {
  background: linear-gradient(135deg, #fff7ed, #fed7aa);
  border: 1px solid #fb923c;
  color: #ea580c;
}

.theme-toggle-btn.light-mode:hover {
  background: linear-gradient(135deg, #ffedd5, #fdba74);
  box-shadow: 0 4px 16px rgba(251, 146, 60, 0.3);
}

/* Dark mode stilleri */
.theme-toggle-btn.dark-mode {
  background: linear-gradient(135deg, #1f2937, #374151);
  border: 1px solid #4b5563;
  color: #fde047;
}

.theme-toggle-btn.dark-mode:hover {
  background: linear-gradient(135deg, #374151, #4b5563);
  box-shadow: 0 4px 16px rgba(253, 224, 71, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .theme-toggle-btn {
    width: 40px;
    height: 40px;
  }
  
  .theme-toggle-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>