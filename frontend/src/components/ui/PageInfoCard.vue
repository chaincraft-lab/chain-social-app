<template>
  <div class="info-card" :style="cardStyle">
    <div class="info-content">
      <h1 class="info-title" :style="titleStyle">{{ title }}</h1>
      <p class="info-subtitle">{{ subtitle }}</p>
    </div>
    <div class="info-badge" :style="badgeStyle">
      <span class="badge-number" :style="numberStyle">{{ count }}</span>
      <span class="badge-label" :style="labelStyle">{{ countLabel }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageInfoCard',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    countLabel: {
      type: String,
      default: 'haber'
    },
    theme: {
      type: String,
      default: 'primary', // 'primary' (red) or 'secondary' (purple)
      validator: (value) => ['primary', 'secondary'].includes(value)
    }
  },
  computed: {
    themeColors() {
      return this.theme === 'primary' 
        ? {
            color: '#800000',
            rgb: '128, 0, 0'
          }
        : {
            color: '#6a1b9a', 
            rgb: '106, 27, 154'
          }
    },
    cardStyle() {
      return {
        background: `rgba(${this.themeColors.rgb}, 0.02)`,
        borderColor: `rgba(${this.themeColors.rgb}, 0.08)`,
        '--hover-bg': `rgba(${this.themeColors.rgb}, 0.04)`,
        '--hover-border': `rgba(${this.themeColors.rgb}, 0.12)`
      }
    },
    titleStyle() {
      return {
        color: this.themeColors.color
      }
    },
    badgeStyle() {
      return {
        background: `rgba(${this.themeColors.rgb}, 0.08)`,
        borderColor: `rgba(${this.themeColors.rgb}, 0.12)`
      }
    },
    numberStyle() {
      return {
        color: this.themeColors.color
      }
    },
    labelStyle() {
      return {
        color: `rgba(${this.themeColors.rgb}, 0.7)`
      }
    }
  }
}
</script>

<style scoped>
.info-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.info-card:hover {
  background: var(--hover-bg) !important;
  border-color: var(--hover-border) !important;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.info-subtitle {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
  font-weight: 400;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid;
}

.badge-number {
  font-size: 1.1rem;
  font-weight: 600;
}

.badge-label {
  font-size: 0.85rem;
  font-weight: 500;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .info-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }
  
  .info-title {
    font-size: 1.25rem;
  }
  
  .info-badge {
    align-self: flex-start;
  }
}
</style>