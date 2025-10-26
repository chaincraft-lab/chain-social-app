<template>
  <div class="relative">
    <!-- Profile Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg theme-bg-tertiary hover:theme-bg-secondary transition-colors theme-text-primary"
    >
      <div
        class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center"
      >
        <Icon icon="heroicons:user" class="w-5 h-5 text-white" />
      </div>
      <span v-if="showName" class="text-sm font-medium hidden md:block">
        {{ user?.name || t('navigation.user') }}
      </span>
      <Icon
        v-if="showName"
        icon="heroicons:chevron-down"
        class="w-4 h-4 hidden md:block"
      />
    </button>

    <!-- Profile Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute right-0 top-full mt-2 theme-card rounded-lg shadow-lg py-2 z-[10000]"
      @mouseleave="hideDropdown"
    >
      <!-- User Info -->
      <div v-if="showUserInfo" class="px-4 py-3 border-b theme-border-primary">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center"
          >
            <Icon icon="heroicons:user" class="w-6 h-6 text-white" />
          </div>
          <div>
            <p class="text-sm font-medium theme-text-primary">
              {{ user?.name || t('navigation.user') }}
            </p>
            <p class="text-xs theme-text-muted">
              {{ user?.email }}
            </p>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="py-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="hideDropdown"
          class="flex items-center px-4 py-2 text-sm theme-text-secondary hover:theme-bg-secondary transition-colors"
        >
          <Icon :icon="item.icon" class="w-4 h-4 mr-3" />
          {{ item.label }}
        </router-link>
      </div>

      <!-- Logout -->
      <div class="border-t theme-border-primary py-1">
        <button
          @click="$emit('logout')"
          class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Icon
            icon="heroicons:arrow-right-on-rectangle"
            class="w-4 h-4 mr-3"
          />
          {{ t('navigation.logout') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  user: { type: Object, default: () => ({}) },
  showName: { type: Boolean, default: true },
  showUserInfo: { type: Boolean, default: true },
  menuItems: {
    type: Array,
    default: () => []
  },
});

const defaultMenuItems = computed(() => [
  {
    path: "/profile",
    label: t('navigation.profile'),
    icon: "heroicons:user",
  },
  {
    path: "/bookmarks",
    label: t('navigation.bookmarks'),
    icon: "heroicons:bookmark",
  },
  {
    path: "/likes",
    label: t('navigation.likes'),
    icon: "heroicons:heart",
  },
]);

const menuItems = computed(() => props.menuItems.length > 0 ? props.menuItems : defaultMenuItems.value);

defineEmits(["logout"]);

const showDropdown = ref(false);
let dropdownTimeout = null;

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const hideDropdown = () => {
  dropdownTimeout = setTimeout(() => {
    showDropdown.value = false;
  }, 150);
};
</script>