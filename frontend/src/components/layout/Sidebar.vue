<template>
  <aside class="w-full">
    <!-- Show Sub-Categories if in category page -->
    <SubCategoriesList
      v-if="showSubCategories && currentCategorySlug && categories && categories.length > 0"
      :sub-categories="subCategories"
      :current-category="currentCategory"
      :is-loading="isLoadingSubCategories"
      @back="goBackToMain"
    />

    <!-- Loading state for sub-categories -->
    <div v-else-if="showSubCategories && currentCategorySlug && (!categories || categories.length === 0)" 
         class="bg-gray-800 rounded-lg shadow-lg mb-4 p-4">
      <div class="text-center text-gray-400">{{ $t('common.ui.categoriesLoading') }}</div>
    </div>

    <!-- Show Main Categories otherwise -->
    <CategoriesList
      v-else-if="showCategories"
      :categories="categories"
    />

    <!-- Popular News Component - Moved to Stories -->
    <!-- <PopularNews 
       :show-popular="showPopular" 
       title-size="sm"
       :max-title-length="60"
     /> --> 

    <!-- Defense Info Cards (Right Sidebar Only) -->
    <template v-if="position === 'right'">
      <!-- Weather Card -->
      <!-- <WeatherWidget 
        v-if="showWeather"
        city="Ankara"
        :latitude="39.9334"
        :longitude="32.8597"
        :auto-refresh="true"
        :refresh-interval="300000"
      /> -->
      
      <!-- Crypto Protocols Widget -->
      <CryptoProtocolsWidget 
        v-if="showCryptoProtocols"
        :auto-refresh="true"
        :refresh-interval="300000"
      />
      
      
      <!-- Market Widget -->
      <MarketWidget 
        v-if="showMarket"
        base-currency="TRY"
        :auto-refresh="true"
        :refresh-interval="300000"
      />
      
      <!-- Additional Defense Cards can be added here -->
      <slot name="defense-cards"></slot>
    </template>

    <!-- Popular Tags Component -->
    <!-- <PopularTags :show-tags="showTags" /> -->

    <slot></slot>
  </aside>
</template>

<script>
import { mapState } from "vuex";
import CategoriesList from "../ui/CategoriesList.vue";
import SubCategoriesList from "../ui/Categories/SubCategoriesList.vue";
import PopularNews from "../ui/PopularNews.vue";
// import PopularTags from "../ui/PopularTags.vue";
import WeatherWidget from "../widgets/WeatherWidget.vue";
import MarketWidget from "../widgets/MarketWidget.vue";
import CryptoProtocolsWidget from "../widgets/CryptoProtocolsWidget.vue";

export default {
  name: "SiteSidebar",
  components: {
    CategoriesList,
    SubCategoriesList,
    PopularNews,
    // PopularTags,
    WeatherWidget,
    MarketWidget,
    CryptoProtocolsWidget,
  },
  props: {
    showCategories: {
      type: Boolean,
      default: true,
    },
    showPopular: {
      type: Boolean,
      default: true,
    },
    showAds: {
      type: Boolean,
      default: true,
    },
    showTags: {
      type: Boolean,
      default: true,
    },
    showNewsletter: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: "right",
      validator: (value) => ["left", "right"].includes(value),
    },
    showWeather: {
      type: Boolean,
      default: true,
    },
    showMarket: {
      type: Boolean,
      default: true,
    },
    showCryptoProtocols: {
      type: Boolean,
      default: true,
    },
    showSubCategories: {
      type: Boolean,
      default: false,
    },
    currentCategorySlug: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      email: "",
    };
  },
  computed: {
    ...mapState("categories", ["categories"]),
    ...mapState("advertisements", ["advertisements"]),
    currentCategory() {
      if (!this.currentCategorySlug || !this.categories || !Array.isArray(this.categories)) return null;
      return this.categories.find(cat => cat && cat.slug === this.currentCategorySlug) || null;
    },
    subCategories() {
      if (!this.currentCategorySlug) return [];
      return this.getSubCategoriesForCategory(this.currentCategorySlug);
    },
    isLoadingSubCategories() {
      return false; // For now, we'll use mock data
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      });
    },
    subscribeNewsletter() {
      // Burada e-posta aboneliği işlemi yapılacak
      alert(`${this.email} adresi bültene kaydedildi!`);
      this.email = "";
    },
    getSubCategoriesForCategory(categorySlug) {
      // Mock sub-categories data based on parent category
      const subCategoriesMap = {
        'arbitrum': [
          { id: 1, name: 'DeFi Protocols', slug: 'defi-protocols', color: '#ff6b6b', articleCount: 45 },
          { id: 2, name: 'Gaming', slug: 'gaming', color: '#4ecdc4', articleCount: 32 },
          { id: 3, name: 'NFT Projects', slug: 'nft-projects', color: '#45b7d1', articleCount: 28 },
          { id: 4, name: 'Infrastructure', slug: 'infrastructure', color: '#96ceb4', articleCount: 21 },
          { id: 5, name: 'Bridges', slug: 'bridges', color: '#ffeaa7', articleCount: 15 }
        ],
        'ethereum': [
          { id: 6, name: 'Smart Contracts', slug: 'smart-contracts', color: '#a29bfe', articleCount: 67 },
          { id: 7, name: 'DeFi', slug: 'defi', color: '#fd79a8', articleCount: 89 },
          { id: 8, name: 'NFT Marketplace', slug: 'nft-marketplace', color: '#fdcb6e', articleCount: 43 },
          { id: 9, name: 'Staking', slug: 'staking', color: '#e17055', articleCount: 56 },
          { id: 10, name: 'Layer 2', slug: 'layer2', color: '#00b894', articleCount: 34 }
        ],
        'polygon': [
          { id: 11, name: 'zkEVM', slug: 'zkevm', color: '#6c5ce7', articleCount: 29 },
          { id: 12, name: 'Gaming Ecosystem', slug: 'gaming-ecosystem', color: '#fd79a8', articleCount: 41 },
          { id: 13, name: 'DeFi Protocols', slug: 'polygon-defi', color: '#00cec9', articleCount: 38 },
          { id: 14, name: 'Enterprise', slug: 'enterprise', color: '#fdcb6e', articleCount: 22 },
          { id: 15, name: 'Sustainability', slug: 'sustainability', color: '#55a3ff', articleCount: 17 }
        ],
        'solana': [
          { id: 16, name: 'DeFi Protocols', slug: 'solana-defi', color: '#ff7675', articleCount: 52 },
          { id: 17, name: 'NFT Collections', slug: 'nft-collections', color: '#74b9ff', articleCount: 48 },
          { id: 18, name: 'Mobile', slug: 'mobile', color: '#00b894', articleCount: 26 },
          { id: 19, name: 'Gaming', slug: 'solana-gaming', color: '#fdcb6e', articleCount: 31 },
          { id: 20, name: 'Infrastructure', slug: 'solana-infrastructure', color: '#e17055', articleCount: 19 }
        ],
        'uniswap': [
          { id: 21, name: 'V4 Development', slug: 'v4-development', color: '#ff006e', articleCount: 18 },
          { id: 22, name: 'Liquidity Mining', slug: 'liquidity-mining', color: '#8338ec', articleCount: 24 },
          { id: 23, name: 'Governance', slug: 'governance', color: '#3a86ff', articleCount: 16 },
          { id: 24, name: 'Analytics', slug: 'analytics', color: '#06ffa5', articleCount: 12 },
          { id: 25, name: 'Integrations', slug: 'integrations', color: '#ffbe0b', articleCount: 14 }
        ],
        'aave': [
          { id: 26, name: 'Lending Protocols', slug: 'lending-protocols', color: '#b744c8', articleCount: 35 },
          { id: 27, name: 'GHO Stablecoin', slug: 'gho-stablecoin', color: '#f72585', articleCount: 22 },
          { id: 28, name: 'Risk Management', slug: 'risk-management', color: '#4895ef', articleCount: 19 },
          { id: 29, name: 'Multi-chain', slug: 'multi-chain', color: '#43aa8b', articleCount: 28 },
          { id: 30, name: 'Safety Module', slug: 'safety-module', color: '#f9844a', articleCount: 13 }
        ]
      };
      
      return subCategoriesMap[categorySlug] || [];
    },
    goBackToMain() {
      this.$router.push({ name: 'home' });
    }
  },
};
</script>

 