<template>
  <div class="flex justify-center py-12">
    <div class="rounded-2xl p-12 max-w-md text-center animate-bounce-in">
      <!-- Icon -->
      <div class="mb-6">
        <div :class="[
          'mx-auto rounded-full flex items-center justify-center',
          iconSizeClass,
          iconBgClass
        ]">
          <!-- Success Icon -->
          <svg v-if="(icon || defaultIcon) === 'mdi-check-circle'" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          
          <!-- Empty/Inbox Icon -->
          <svg v-else-if="(icon || defaultIcon) === 'mdi-inbox-outline'" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          
          <!-- Error Icon -->
          <svg v-else-if="(icon || defaultIcon) === 'mdi-alert-circle'" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          
          <!-- Info Icon -->
          <svg v-else-if="(icon || defaultIcon) === 'mdi-information'" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          
          <!-- Search Icon -->
          <svg v-else-if="(icon || defaultIcon) === 'mdi-magnify'" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          
          <!-- Search Remove Icon -->
          <svg v-else-if="(icon || defaultIcon) === 'mdi-magnify-remove-outline'" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
          </svg>
          
          <!-- Default fallback icon -->
          <svg v-else :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
      
      <!-- Title -->
      <h3 :class="['text-2xl font-semibold mb-3 leading-tight', titleColorClass]">
        {{ title }}
      </h3>
      
      <!-- Message -->
      <p v-if="message" :class="['text-base leading-relaxed m-0', textColorClass]">
        {{ message }}
      </p>
      
      <!-- Button (if needed) -->
      <button
        v-if="showButton"
        @click="handleButtonClick"
        :class="[
          'mt-6 px-6 py-3 rounded-lg font-medium transition-colors',
          buttonClass
        ]"
      >
        {{ buttonText }}
      </button>
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
    iconSizeClass() {
      return this.type === "empty" ? "w-16 h-16" : "w-12 h-12";
    },
    iconBgClass() {
      switch (this.type) {
        case "success":
          return "bg-green-100";
        case "error":
          return "bg-red-100";
        case "info":
          return "bg-blue-100";
        case "empty":
        default:
          return "bg-gray-100";
      }
    },
    iconColorClass() {
      switch (this.type) {
        case "success":
          return "w-8 h-8 text-green-600";
        case "error":
          return "w-8 h-8 text-red-600";
        case "info":
          return "w-8 h-8 text-blue-600";
        case "empty":
        default:
          return this.type === "empty" ? "w-10 h-10 text-gray-400" : "w-8 h-8 text-gray-400";
      }
    },
    titleColorClass() {
      switch (this.type) {
        case "success":
          return "text-green-800";
        case "error":
          return "text-red-800";
        case "info":
          return "text-blue-800";
        case "empty":
        default:
          return "text-gray-800";
      }
    },
    textColorClass() {
      switch (this.type) {
        case "success":
          return "text-green-600";
        case "error":
          return "text-red-600";
        case "info":
          return "text-blue-600";
        case "empty":
        default:
          return "text-gray-600";
      }
    },
    buttonClass() {
      switch (this.type) {
        case "success":
          return "bg-green-500 text-white hover:bg-green-600";
        case "error":
          return "border border-red-500 text-red-500 hover:bg-red-50";
        case "info":
          return "border border-blue-500 text-blue-500 hover:bg-blue-50";
        case "empty":
        default:
          return "border border-primary text-primary hover:bg-primary/10";
      }
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
/* Mobile responsive */
@media (max-width: 768px) {
  .p-12 {
    padding: 2rem 1rem;
  }
  
  .py-12 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .text-2xl {
    font-size: 1.25rem;
  }

  .text-base {
    font-size: 0.9rem;
  }
}

/* Custom animation */
.animate-bounce-in {
  animation: bounceIn 0.6s ease-out;
}

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