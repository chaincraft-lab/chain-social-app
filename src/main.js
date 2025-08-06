import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/main.css'
import store from './store'
import vuetify from './plugins/vuetify'

// Import layouts and pages
import MainLayout from './layouts/MainLayout.vue'
import HomePage from './views/HomePage.vue'
import CategoryPage from './views/CategoryPage.vue'
import ArticlePage from './views/ArticlePage.vue'
import DefenseLeaguePage from './views/DefenseLeaguePage.vue'
import ComponentDemo from './views/ComponentDemo.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: HomePage, name: 'home' },
        { path: '/category/:slug', component: CategoryPage, name: 'category' },
        { path: '/article/:slug', component: ArticlePage, name: 'article' },
        { path: '/defense-leagues', component: DefenseLeaguePage, name: 'defense-leagues' },
        { path: '/defense-leagues/:category', component: DefenseLeaguePage, name: 'defense-leagues-category' },
        { path: '/component-demo', component: ComponentDemo, name: 'component-demo' }
      ]
    }
  ]
})

// Create app
const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)
app.mount('#app')
