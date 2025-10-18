<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      <div class="nav-content">
        <!-- Left side items -->
        <div class="nav-side">
          <div
            v-for="item in leftItems"
            :key="item.name"
            @click="handleNavClick(item)"
            class="nav-item"
            :class="{ 'nav-item--active': $route.name === item.routeName || isActiveRoute(item) }"
          >
            <Icon 
              :icon="item.icon" 
              class="nav-item__icon"
            />
          </div>
        </div>

        <!-- Center logo button -->
        <router-link
          to="/feed"
          class="nav-center-logo"
          :class="{ 'nav-center-logo--active': $route.name === 'feed' }"
        >
          <div class="nav-center-logo__circle">
            <Icon icon="heroicons:fire" class="nav-center-logo__icon" />
          </div>
        </router-link>

        <!-- Right side items -->
        <div class="nav-side">
          <div
            v-for="item in rightItems"
            :key="item.name"
            @click="handleNavClick(item)"
            class="nav-item"
            :class="{ 'nav-item--active': $route.name === item.routeName || isActiveRoute(item) }"
          >
            <Icon 
              :icon="item.icon" 
              class="nav-item__icon"
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Left side navigation items
const leftItems = [
  {
    name: 'home',
    label: 'Ana Sayfa',
    icon: 'heroicons:home',
    route: '/',
    routeName: 'home'
  },
  {
    name: 'search',
    label: 'Arama',
    icon: 'heroicons:magnifying-glass',
    route: '/search',
    routeName: 'search'
  }
]

// Right side navigation items
const rightItems = [
  {
    name: 'categories',
    label: 'Kategoriler',
    icon: 'heroicons:squares-2x2',
    route: '/categories',
    routeName: 'categories'
  },
  {
    name: 'profile',
    label: 'Profil',
    icon: 'heroicons:user',
    route: '/profile',
    routeName: 'profile'
  }
]

const isActiveRoute = (item) => {
  // Özel route kontrolü
  if (item.name === 'categories' && route.name === 'category') {
    return true
  }
  if (item.name === 'search' && route.name === 'search') {
    return true
  }
  return false
}

const handleNavClick = (item) => {
  if (item.name === 'home') {
    if (route.name === 'home') {
      // Anasayfadaysak sayfanın en üstüne çık
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Anasayfada değilsek anasayfaya git
      router.push(item.route)
    }
  } else {
    // Diğer navigation itemlar için normal router navigation
    router.push(item.route)
  }
}
</script>

<style scoped>
/* Bottom Navigation Container */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: none;
}

@media (max-width: 768px) {
  .bottom-nav {
    display: block;
  }
}

.nav-container {
  padding: 0 16px 16px 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  display: flex;
  justify-content: center;
}

.nav-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 32px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  max-width: 380px;
  width: 100%;
  position: relative;
}

/* Side containers */
.nav-side {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.nav-side:first-child {
  justify-content: flex-start;
}

.nav-side:last-child {
  justify-content: flex-end;
}

/* Regular Navigation Items */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 6px;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  min-width: 44px;
}

.nav-item__icon {
  width: 28px;
  height: 28px;
  color: #6B7280;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-bottom: 2px;
}

.nav-item__label {
  font-size: 10px;
  font-weight: 500;
  color: #6B7280;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  line-height: 1;
  text-align: center;
}

/* Center Logo Button */
.nav-center-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  margin: 0 20px;
}

.nav-center-logo__circle {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 25px rgba(139, 92, 246, 0.4),
    0 3px 10px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.nav-center-logo__circle::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  border-radius: 50%;
  transition: opacity 0.3s ease;
}

.nav-center-logo__icon {
  width: 28px;
  height: 28px;
  color: white;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}

/* Active States */
.nav-item--active .nav-item__icon {
  color: #8B5CF6;
  transform: translateY(-1px) scale(1.1);
}

.nav-item--active .nav-item__label {
  color: #8B5CF6;
  font-weight: 600;
}

.nav-center-logo--active .nav-center-logo__circle {
  transform: scale(1.1);
  box-shadow: 
    0 12px 35px rgba(139, 92, 246, 0.5),
    0 5px 15px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.nav-center-logo--active .nav-center-logo__icon {
  transform: scale(1.1);
}

/* Hover Effects */
@media (hover: hover) {
  .nav-item:hover:not(.nav-item--active) .nav-item__icon {
    color: #4B5563;
    transform: translateY(-1px) scale(1.05);
  }
  
  .nav-item:hover:not(.nav-item--active) .nav-item__label {
    color: #4B5563;
  }

  .nav-center-logo:hover:not(.nav-center-logo--active) .nav-center-logo__circle {
    transform: scale(1.05);
    box-shadow: 
      0 10px 30px rgba(139, 92, 246, 0.45),
      0 4px 12px rgba(139, 92, 246, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  .nav-center-logo:hover .nav-center-logo__circle::before {
    opacity: 0.3;
  }
}

/* Press Effects */
.nav-item:active {
  transform: scale(0.92);
  transition-duration: 0.1s;
}

.nav-center-logo:active {
  transform: scale(0.95);
  transition-duration: 0.1s;
}

/* Focus States */
.nav-item:focus-visible {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
  border-radius: 16px;
}

.nav-center-logo:focus-visible {
  outline: 2px solid #8B5CF6;
  outline-offset: 4px;
  border-radius: 50%;
}

/* Entrance Animation */
.nav-content {
  animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  0% {
    transform: translateY(100%) scale(0.9);
    opacity: 0;
  }
  50% {
    transform: translateY(-8px) scale(1.02);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .nav-content {
    background: rgba(31, 41, 55, 0.95);
    border-color: rgba(75, 85, 99, 0.3);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      0 4px 12px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .nav-item__icon,
  .nav-item__label {
    color: #9CA3AF;
  }

  .nav-item--active .nav-item__icon,
  .nav-item--active .nav-item__label {
    color: #A78BFA;
  }

  .nav-item:hover:not(.nav-item--active) .nav-item__icon,
  .nav-item:hover:not(.nav-item--active) .nav-item__label {
    color: #D1D5DB;
  }
}

/* Responsive */
@media (max-width: 380px) {
  .nav-content {
    max-width: 320px;
    padding: 10px 16px;
  }

  .nav-center-logo__circle {
    width: 48px;
    height: 48px;
  }

  .nav-center-logo__icon {
    width: 24px;
    height: 24px;
  }

  .nav-item {
    min-width: 36px;
  }

  .nav-item__icon {
    width: 24px;
    height: 24px;
  }

  .nav-item__label {
    font-size: 9px;
  }
}
</style>