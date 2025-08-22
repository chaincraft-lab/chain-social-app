<template>
  <aside class="w-full">
    <CategoriesList
      v-if="showCategories"
      :categories="categories"
    />

    <!-- Popular News Component -->
    <PopularNews :show-popular="showPopular" />


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

export default {
  name: "SiteSidebar",
  components: {
    CategoriesList,
    PopularNews,
    PopularTags,
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

 