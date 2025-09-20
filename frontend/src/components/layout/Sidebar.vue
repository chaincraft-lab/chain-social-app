<template>
  <aside class="w-full">
    <CategoriesList
      v-if="showCategories"
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
      <WeatherWidget 
        v-if="showWeather"
        city="Ankara"
        :latitude="39.9334"
        :longitude="32.8597"
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
    <PopularTags :show-tags="showTags" />

    <slot></slot>
  </aside>
</template>

<script>
import { mapState } from "vuex";
import CategoriesList from "../ui/CategoriesList.vue";
import PopularNews from "../ui/PopularNews.vue";
import PopularTags from "../ui/PopularTags.vue";
import WeatherWidget from "../widgets/WeatherWidget.vue";
import MarketWidget from "../widgets/MarketWidget.vue";

export default {
  name: "SiteSidebar",
  components: {
    CategoriesList,
    PopularNews,
    PopularTags,
    WeatherWidget,
    MarketWidget,
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
  },
  data() {
    return {
      email: "",
    };
  },
  computed: {
    ...mapState("categories", ["categories"]),
    ...mapState("advertisements", ["advertisements"])
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
  },
};
</script>

 