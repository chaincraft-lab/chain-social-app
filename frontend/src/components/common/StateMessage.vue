<template>
  <div class="state-message" :class="stateClass">
    <div class="state-card">
      <div class="state-icon">
        <v-icon :size="iconSize" :color="iconColor">{{ icon || defaultIcon }}</v-icon>
      </div>
      <h3 class="state-title">{{ title }}</h3>
      <p class="state-text" v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "StateMessage",
  props: {
    type: {
      type: String,
      default: "success", // 'success', 'empty', 'error', 'info'
      validator: (value) =>
        ["success", "empty", "error", "info"].includes(value),
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    showButton: {
      type: Boolean,
      default: false,
    },
    buttonText: {
      type: String,
      default: "Ana Sayfaya Dön",
    },
    buttonIcon: {
      type: String,
      default: "mdi-home",
    },
    buttonAction: {
      type: Function,
      default: null,
    },
  },
  computed: {
    stateClass() {
      return `state-message--${this.type}`;
    },
    iconSize() {
      return this.type === "empty" ? 64 : 36;
    },
    iconColor() {
      switch (this.type) {
        case "success":
          return "success";
        case "error":
          return "error";
        case "info":
          return "info";
        case "empty":
        default:
          return "grey-lighten-1";
      }
    },
    buttonColor() {
      switch (this.type) {
        case "success":
          return "success";
        case "error":
          return "error";
        case "info":
          return "primary";
        case "empty":
        default:
          return "primary";
      }
    },
    buttonVariant() {
      return this.type === "success" ? "elevated" : "outlined";
    },
    defaultIcon() {
      switch (this.type) {
        case "success":
          return "mdi-check-circle";
        case "empty":
          return "mdi-inbox-outline";
        case "error":
          return "mdi-alert-circle";
        case "info":
          return "mdi-information";
        default:
          return "mdi-check-circle";
      }
    },
  },
  methods: {
    handleButtonClick() {
      if (this.buttonAction) {
        this.buttonAction();
      } else {
        this.$router.push("/");
      }
    },
  },
  mounted() {
    // Set default icon if none provided
    if (!this.icon) {
      this.$emit("update:icon", this.defaultIcon);
    }
  },
};
</script>

<style scoped>
.state-message {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.state-card {
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px;
  transition: all 0.3s ease;
  animation: bounceIn 0.6s ease-out;
}

/* Success state (green) */
.state-message--success .state-card {
  background: transparent;
  border: none;
}

/* Empty state (neutral) */
.state-message--empty .state-card {
  background: transparent;
  border: none;
}

/* Error state (red) */
.state-message--error .state-card {
  background: transparent;
  border: none;
}

/* Info state (blue) */
.state-message--info .state-card {
  background: transparent;
  border: none;
}

.state-icon {
  margin-bottom: 1.5rem;
}

.state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.state-text {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .state-card {
    padding: 2rem 1rem;
    margin: 0 1rem;
  }

  .state-title {
    font-size: 1.25rem;
  }

  .state-text {
    font-size: 0.9rem;
  }
}

/* Animation */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>