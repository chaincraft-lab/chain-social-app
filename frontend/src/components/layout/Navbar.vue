<template>
  <nav class="shadow-lg sticky top-0 theme-navbar" style="z-index: 9998">
    <div class="container mx-auto px-4">
      <!-- Top Bar -->
      <div class="flex items-center justify-between py-3" style="border-bottom: 1px solid var(--color-navbar-border)">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="Logo" class="h-10" />
        </router-link>

        <!-- Search and Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="hidden md:block">
            <SearchBox
              v-model="searchQuery"
              placeholder="Haber ara..."
              @search="handleSearch"
            />
          </div>

          <!-- Authentication Section -->
          <div class="flex items-center space-x-3">
            <!-- Authenticated User -->
            <UserProfile
              v-if="isAuthenticated"
              :user="currentUser"
              @logout="handleLogout"
            />

            <!-- Non-authenticated User -->
            <AuthButton
              v-else
              @login="showAuthDialog = true"
            />
          </div>

          <!-- Theme Toggle -->
          <ThemeToggle class="hidden md:block" />

          <!-- Language Selector -->
          <LanguageSelector
            class="hidden md:block"
            :languages="languages"
            :current-language="currentLanguage"
            @language-changed="selectLanguage"
          />

          <!-- Mobile Menu Button -->
          <MobileMenuButton
            :is-open="isMobileMenuOpen"
            @toggle="isMobileMenuOpen = !isMobileMenuOpen"
          />

          <!-- Social Icons -->
          <div class="hidden md:block">
            <SocialLinks
              :social-links="[
                { name: 'twitter', url: '#' },
                { name: 'instagram', url: '#' },
                { name: 'facebook', url: '#' }
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Main Navigation -->
      <div class="relative">
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center justify-between py-3">
          <ul class="flex items-center space-x-6">
            <li
              v-for="(menuItem, index) in menu"
              :key="index"
              class="relative group"
            >
              <!-- Menu Item with Hover -->
              <div
                class="text-light hover:text-secondary font-medium flex items-center cursor-pointer menu-item-hover"
                @mouseenter="showDropdown(index)"
                @mouseleave="hideDropdown(index)"
              >
                <span>{{ menuItem.title }}</span>
                <Icon
                  icon="heroicons:chevron-down"
                  class="h-4 w-4 ml-1 transition-transform"
                  :class="{ 'rotate-180': activeDropdown === index }"
                />

                <!-- Regular Dropdown Menu -->
                <div
                  v-if="!menuItem.hasNestedDropdown && activeDropdown === index"
                  class="absolute left-0 top-full mt-2 w-56 bg-altmenu text-light rounded-md py-2 dropdown-shadow"
                  style="z-index: 9999"
                  @mouseenter="showDropdown(index)"
                  @mouseleave="hideDropdown(index)"
                >
                  <a
                    v-for="(subtitle, subIndex) in menuItem.subtitles"
                    :key="subIndex"
                    href="#"
                    @click.prevent="handleMenuClick(subtitle)"
                    class="block px-4 py-2 text-sm text-light hover:bg-altmenu-700 hover:text-secondary transition-colors"
                  >
                    {{ subtitle }}
                  </a>
                </div>

                <!-- Nested Dropdown Menu for Defense Forces -->
                <div
                  v-if="menuItem.hasNestedDropdown && activeDropdown === index"
                  class="absolute left-0 top-full mt-2 w-72 bg-altmenu text-light rounded-md py-2 dropdown-shadow"
                  style="z-index: 9999"
                  @mouseenter="showDropdown(index)"
                  @mouseleave="hideDropdown(index)"
                >
                  <div
                    v-for="(
                      nestedCategory, nestedIndex
                    ) in menuItem.nestedCategories"
                    :key="nestedIndex"
                    class="relative group/nested"
                    @mouseenter="showNestedDropdown(nestedIndex)"
                    @mouseleave="hideNestedDropdown(nestedIndex)"
                  >
                    <div
                      class="flex items-center justify-between px-4 py-2 text-sm text-light hover:bg-altmenu-700 hover:text-secondary cursor-pointer transition-colors"
                    >
                      <div class="flex items-center">
                        <Icon
                          icon="heroicons:shield-check"
                          class="w-4 h-4 mr-2"
                        />
                        <span>{{ nestedCategory.title }}</span>
                      </div>
                      <Icon
                        icon="heroicons:chevron-right"
                        class="h-3 w-3"
                      />
                    </div>

                    <!-- Sub-sub Dropdown -->
                    <div
                      v-if="activeNestedDropdown === nestedIndex"
                      class="absolute left-full top-0 ml-1 w-56 bg-altmenu-700 text-light rounded-md py-2 nested-dropdown-shadow"
                      style="z-index: 10000"
                      @mouseenter="showNestedDropdown(nestedIndex)"
                      @mouseleave="hideNestedDropdown(nestedIndex)"
                    >
                      <a
                        v-for="(subtitle, subIndex) in nestedCategory.subtitles"
                        :key="subIndex"
                        href="#"
                        @click.prevent="handleMenuClick(subtitle)"
                        class="block px-4 py-2 text-sm text-light hover:bg-altmenu-600 hover:text-secondary transition-colors"
                      >
                        {{ subtitle }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div class="flex items-center">
            <DateDisplay />
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div
          v-show="isMobileMenuOpen"
          class="md:hidden fixed inset-0 z-50 flex flex-col theme-bg-primary theme-text-primary mobile-menu-container"
        >
          <!-- Mobile Menu Header -->
          <div
            class="flex items-center justify-between px-4 py-3 theme-border-primary border-b"
          >
            <router-link
              to="/"
              class="flex items-center"
              @click="isMobileMenuOpen = false"
            >
              <img src="@/assets/logo.png" alt="Logo" class="h-8" />
            </router-link>
            <button
              @click="isMobileMenuOpen = false"
              class="p-2 theme-text-primary focus:outline-none rounded-full hover:theme-bg-secondary"
            >
              <Icon
                icon="heroicons:x-mark"
                class="w-6 h-6"
              />
            </button>
          </div>

          <!-- Mobile Search -->
          <div class="relative px-4 py-3 theme-border-primary border-b">
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <SearchBox
                  v-model="mobileSearchQuery"
                  placeholder="Haber ara..."
                  input-class="w-full theme-bg-secondary theme-text-primary"
                  @search="handleMobileSearch"
                />
              </div>

              <!-- Mobile Auth Section -->
              <div class="flex items-center space-x-2">
                <!-- Authenticated User Mobile -->
                <button
                  v-if="isAuthenticated"
                  @click="toggleMobileProfileMenu"
                  class="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
                >
                  <Icon
                    icon="heroicons:user"
                    class="w-6 h-6 text-white"
                  />
                </button>

                <!-- Non-authenticated User Mobile -->
                <AuthButton
                  v-else
                  button-text="Giriş"
                  @login="showAuthDialog = true"
                />
              </div>

              <!-- Theme Toggle Mobile -->
              <ThemeToggle />

              <!-- Mobil Dil Seçimi Butonu -->
              <button
                @click="toggleLanguageDropdown"
                class="flex-shrink-0 p-2 theme-border-secondary border rounded-full theme-text-primary hover:theme-bg-secondary transition-colors"
              >
                <Icon
                  icon="heroicons:globe-alt"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <!-- Mobile Menu Content -->
          <div class="flex-1 overflow-y-auto">
            <ul class="px-2 py-2 space-y-1">
              <li
                v-for="(menuItem, index) in menu"
                :key="index"
                class="rounded-lg overflow-hidden"
              >
                <div class="theme-bg-secondary rounded-lg mb-1">
                  <button
                    @click="toggleMobileSubmenu(index)"
                    class="flex items-center justify-between w-full text-left theme-text-primary hover:text-primary font-medium py-3 px-4 rounded-lg"
                    :class="{
                      'bg-primary text-white': mobileActiveSubmenu === index,
                    }"
                  >
                    <div class="flex items-center">
                      <span>{{ menuItem.title }}</span>
                    </div>
                    <Icon
                      icon="heroicons:chevron-down"
                      class="h-5 w-5 transition-transform duration-200"
                      :class="{
                        'transform rotate-180': mobileActiveSubmenu === index,
                      }"
                    />
                  </button>

                  <div
                    v-show="mobileActiveSubmenu === index"
                    class="theme-bg-tertiary rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out"
                    :style="{
                      maxHeight:
                        mobileActiveSubmenu === index
                          ? `${menuItem.subtitles.length * 40 + 16}px`
                          : '0px',
                    }"
                  >
                    <div class="grid grid-cols-2 gap-1 p-2">
                      <a
                        v-for="(subtitle, subIndex) in menuItem.subtitles"
                        :key="subIndex"
                        href="#"
                        @click.prevent="handleMobileMenuClick(subtitle)"
                        class="block text-sm theme-text-secondary hover:text-primary py-2 px-3 rounded-md hover:theme-bg-secondary"
                      >
                        {{ subtitle }}
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Mobile Footer -->
          <div class="px-4 py-3 theme-border-primary border-t">
            <!-- Mobile Profile Section for Authenticated Users -->
            <MobileProfileMenu
              v-if="isAuthenticated"
              :is-visible="showMobileProfileMenu"
              :user="currentUser"
              @close="closeMobileMenu"
              @logout="handleLogout"
            />

            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium theme-text-secondary">{{
                currentDate
              }}</span>
              <SocialLinks
                :social-links="[
                  { name: 'twitter', url: '#' },
                  { name: 'instagram', url: '#' },
                  { name: 'facebook', url: '#' }
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Auth Dialog -->
    <AuthDialog v-model="showAuthDialog" @success="handleAuthSuccess" />
  </nav>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { MENU_ITEMS, LANGUAGE_OPTIONS } from "@/constants";
import AuthDialog from "@/components/auth/AuthDialog.vue";
import SearchBox from "@/components/ui/Navigation/SearchBox.vue";
import UserProfile from "@/components/ui/Navigation/UserProfile.vue";
import LanguageSelector from "@/components/ui/Navigation/LanguageSelector.vue";
import SocialLinks from "@/components/ui/Navigation/SocialLinks.vue";
import DateDisplay from "@/components/ui/Navigation/DateDisplay.vue";
import AuthButton from "@/components/ui/Navigation/AuthButton.vue";
import MobileMenuButton from "@/components/ui/Navigation/MobileMenuButton.vue";
import MobileProfileMenu from "@/components/ui/Navigation/MobileProfileMenu.vue";
import ThemeToggle from "@/components/ui/Navigation/ThemeToggle.vue";

export default {
  name: "SiteNavbar",
  components: {
    AuthDialog,
    SearchBox,
    UserProfile,
    LanguageSelector,
    SocialLinks,
    DateDisplay,
    AuthButton,
    MobileMenuButton,
    MobileProfileMenu,
    ThemeToggle,
  },
  data() {
    return {
      isMobileMenuOpen: false,
      currentDate: "",
      currentDay: "",
      currentDateFormatted: "",
      activeDropdown: null,
      activeNestedDropdown: null,
      mobileActiveSubmenu: null,
      currentLanguage: "Türkçe",
      showLanguageDropdown: false,
      showProfileDropdown: false,
      showAuthDialog: false,
      showMobileProfileMenu: false,
      menu: MENU_ITEMS,
      languages: LANGUAGE_OPTIONS,
      dropdownTimeout: null,
      nestedDropdownTimeout: null,
      languageDropdownTimeout: null,
      profileDropdownTimeout: null,
      searchQuery: "",
      mobileSearchQuery: "",
    };
  },
  computed: {
    ...mapState("categories", ["categories"]),
    ...mapGetters("user", ["isAuthenticated", "getCurrentUser"]),
    currentUser() {
      return this.getCurrentUser;
    },
  },
  mounted() {
    this.updateCurrentDate();

    // Update date every minute
    setInterval(this.updateCurrentDate, 60000);

    // Close mobile menu on route change
    this.$router.afterEach(() => {
      this.isMobileMenuOpen = false;
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", this.closeDropdownOnClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdownOnClickOutside);
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          name: "search",
          query: { q: this.searchQuery.trim() },
        });
      }
    },

    handleMobileSearch() {
      if (this.mobileSearchQuery.trim()) {
        this.isMobileMenuOpen = false; // Close mobile menu
        this.$router.push({
          name: "search",
          query: { q: this.mobileSearchQuery.trim() },
        });
      }
    },

    updateCurrentDate() {
      const now = new Date();
      const dayOptions = { weekday: "long" };
      const dateOptions = { year: "numeric", month: "short", day: "numeric" };

      this.currentDay = now.toLocaleDateString("tr-TR", dayOptions);
      this.currentDateFormatted = now.toLocaleDateString("tr-TR", dateOptions);
      this.currentDate = now.toLocaleDateString("tr-TR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    showDropdown(index) {
      clearTimeout(this.dropdownTimeout);
      this.activeDropdown = index;
    },
    hideDropdown(index) {
      this.dropdownTimeout = setTimeout(() => {
        if (this.activeDropdown === index) {
          this.activeDropdown = null;
          this.activeNestedDropdown = null;
        }
      }, 150);
    },
    showNestedDropdown(index) {
      clearTimeout(this.nestedDropdownTimeout);
      this.activeNestedDropdown = index;
    },
    hideNestedDropdown(index) {
      this.nestedDropdownTimeout = setTimeout(() => {
        if (this.activeNestedDropdown === index) {
          this.activeNestedDropdown = null;
        }
      }, 150);
    },
    toggleMobileSubmenu(index) {
      if (this.mobileActiveSubmenu === index) {
        this.mobileActiveSubmenu = null;
      } else {
        this.mobileActiveSubmenu = index;
      }
    },
    closeDropdownOnClickOutside(event) {
      if (!event.target.closest(".group")) {
        this.activeDropdown = null;
        this.activeNestedDropdown = null;
      }
    },
    toggleLanguageDropdown() {
      this.showLanguageDropdown = !this.showLanguageDropdown;
    },
    hideLanguageDropdown() {
      this.languageDropdownTimeout = setTimeout(() => {
        this.showLanguageDropdown = false;
      }, 150);
    },
    selectLanguage(language) {
      this.currentLanguage = language.name;
      this.showLanguageDropdown = false;
      clearTimeout(this.languageDropdownTimeout);
      // Here you would typically handle language change logic
      console.log("Language changed to:", language.name);
    },
    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    },
    handleMenuClick(menuTitle) {
      // Üst menü linklerine tıklandığında - şimdilik hiçbir şey yapmıyor
      console.log("Menü tıklandı:", menuTitle);
      // Gelecekte buraya özel sayfa routing'i eklenebilir
    },
    handleMobileMenuClick(menuTitle) {
      // Mobil menü linklerine tıklandığında
      this.isMobileMenuOpen = false;
      this.handleMenuClick(menuTitle);
    },

    // Auth Methods
    ...mapActions("user", ["login", "logout"]),

    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },

    hideProfileDropdown() {
      this.profileDropdownTimeout = setTimeout(() => {
        this.showProfileDropdown = false;
      }, 150);
    },

    toggleMobileProfileMenu() {
      this.showMobileProfileMenu = !this.showMobileProfileMenu;
    },

    closeMobileMenu() {
      this.isMobileMenuOpen = false;
      this.showMobileProfileMenu = false;
    },

    handleAuthSuccess(type) {
      // Auth dialog'dan başarılı giriş/kayıt bilgisi geldiğinde
      console.log("Auth success:", type);
      // Başarılı giriş bildirimi gösterilebilir
    },

    async handleLogout() {
      try {
        await this.logout();
        this.showProfileDropdown = false;
        this.showMobileProfileMenu = false;
        this.closeMobileMenu();
        // Çıkış bildirimi eklenebilir
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },
};
</script>

<style>
.slide-in-up {
  animation: slideInUp 0.3s ease-out forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobil menü animasyonları */
.md\:hidden {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mobile-menu-container {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.bg-dark-800 {
  background-color: rgba(26, 32, 44, 0.8);
}

.bg-dark-700 {
  background-color: rgba(45, 55, 72, 0.8);
}

.bg-dark-600 {
  background-color: rgba(74, 85, 104, 0.8);
}

/* Alt menü animasyonu */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Mobil menü kaydırma stili */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) rgba(45, 55, 72, 0.5);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(45, 55, 72, 0.5);
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
  border-radius: 10px;
}

/* Dropdown Animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Nested Dropdown Animations */
.nested-dropdown-enter-active,
.nested-dropdown-leave-active {
  transition: all 0.15s ease-out;
}

.nested-dropdown-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.nested-dropdown-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Hover Effects */
.menu-item-hover {
  transition: all 0.2s ease-in-out;
}

.menu-item-hover:hover {
  transform: translateY(-1px);
}

/* Dropdown Shadows */
.dropdown-shadow {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nested-dropdown-shadow {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12), 0 3px 5px rgba(0, 0, 0, 0.08);
}

/* Z-index Classes */
.dropdown-menu {
  z-index: 9999 !important;
}

.nested-dropdown-menu {
  z-index: 10000 !important;
}

.navbar-container {
  z-index: 9998 !important;
}

/* Language Button */
.language-btn {
  border-color: rgba(255, 255, 255, 0.3) !important;
  transition: all 0.3s ease !important;
}

.language-btn:hover {
  border-color: rgba(255, 255, 255, 0.6) !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Date Display */
.date-container {
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.1),
    rgba(25, 118, 210, 0.05)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;
}

.date-container:hover {
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.15),
    rgba(25, 118, 210, 0.08)
  );
  border-color: rgba(25, 118, 210, 0.3);
  transform: translateY(-1px);
}

/* Profile Button */
.profile-btn {
  border-color: rgba(255, 255, 255, 0.3) !important;
  transition: all 0.3s ease !important;
}

.profile-btn:hover {
  border-color: rgba(255, 255, 255, 0.6) !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>