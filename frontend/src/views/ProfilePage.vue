<template>
  <div class="profile-page">
    <!-- Profile Content -->
    <div class="profile-content">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <!-- Sidebar Menu -->
          <div class="lg:col-span-1">
            <ProfileSidebar
              :active-section="activeSection"
              @section-change="handleSectionChange"
            />
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-4">
            <div class="profile-main-content">
              <component
                :is="currentComponent"
                :user-info="userInfo"
                :user-stats="userStats"
                @avatar-upload="showAvatarUpload = true"
                @update-user="updateUserInfo"
                @update-stats="updateUserStats"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <ProfileAvatarUpload
      v-if="showAvatarUpload"
      :user-info="userInfo"
      @close="showAvatarUpload = false"
      @avatar-updated="handleAvatarUpdate"
    />
  </div>
</template>

<script>
import ProfileSidebar from "@/components/ui/Profile/ProfileSidebar.vue";
import ProfileOverview from "@/components/ui/Profile/ProfileOverview.vue";
import ProfileLikes from "@/components/ui/Profile/ProfileLikes.vue";
import ProfileBookmarks from "@/components/ui/Profile/ProfileBookmarks.vue";
import ProfileUserInfo from "@/components/ui/Profile/ProfileUserInfo.vue";
import ProfileChangePassword from "@/components/ui/Profile/ProfileChangePassword.vue";
import ProfileDeleteAccount from "@/components/ui/Profile/ProfileDeleteAccount.vue";
import ProfileAvatarUpload from "@/components/ui/Profile/ProfileAvatarUpload.vue";
import { useI18n } from 'vue-i18n';

export default {
  name: "ProfilePage",
  setup() {
    const { t } = useI18n();
    return { t };
  },
  components: {
    ProfileSidebar,
    ProfileOverview,
    ProfileLikes,
    ProfileBookmarks,
    ProfileUserInfo,
    ProfileChangePassword,
    ProfileDeleteAccount,
    ProfileAvatarUpload,
  },
  data() {
    return {
      activeSection: "overview",
      showAvatarUpload: false,
      userInfo: {
        id: 1,
        name: "Batuhan Sekerci",
        email: "batusekerci@gmail.com",
        avatar: null,
        bio: "Teknoloji ve savunma sanayi ile ilgili haberleri takip ediyorum.",
        phone: "+90 555 123 45 67",
        location: "Ankara, Türkiye",
        joinDate: "2023-01-15",
        isVerified: false,
      },
      userStats: {
        likes: 127,
        bookmarks: 45,
        comments: 89,
        shares: 23,
      },
    };
  },
  computed: {
    defaultAvatar() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        this.userInfo.name
      )}&size=128&background=6366f1&color=ffffff`;
    },
    currentComponent() {
      const componentMap = {
        overview: "ProfileOverview",
        likes: "ProfileLikes",
        bookmarks: "ProfileBookmarks",
        "user-info": "ProfileUserInfo",
        "change-password": "ProfileChangePassword",
        "delete-account": "ProfileDeleteAccount",
      };
      return componentMap[this.activeSection] || "ProfileOverview";
    },
  },
  methods: {
    handleSectionChange(section) {
      this.activeSection = section;
      console.log("Section changed to:", section);
    },
    handleAvatarError(event) {
      event.target.src = this.defaultAvatar;
    },
    formatJoinDate(dateString) {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
        }) + " " + this.t('profile.memberSince')
      );
    },
    getSectionName(section) {
      const sections = {
        overview: this.t('profile.sidebar.overview'),
        likes: this.t('profile.sidebar.likes'),
        bookmarks: this.t('profile.sidebar.bookmarks'),
        "user-info": this.t('profile.sidebar.userInfo'),
        "change-password": this.t('profile.sidebar.changePassword'),
        "delete-account": this.t('profile.sidebar.deleteAccount'),
      };
      return sections[section] || this.t('profile.unknownSection');
    },
    updateUserInfo(updatedInfo) {
      this.userInfo = { ...this.userInfo, ...updatedInfo };
      console.log("User info updated:", updatedInfo);
    },
    updateUserStats(updatedStats) {
      this.userStats = { ...this.userStats, ...updatedStats };
      console.log("User stats updated:", updatedStats);
    },
    handleAvatarUpdate(newAvatarUrl) {
      this.userInfo.avatar = newAvatarUrl;
      this.showAvatarUpload = false;
      console.log("Avatar updated:", newAvatarUrl);
    },
  },
  mounted() {
    console.log("ProfilePage mounted successfully!");
  },
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.profile-content {
  flex: 1;
  background: var(--color-bg-secondary);
  transition: background-color 0.3s ease;
}

.profile-main-content {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.75rem;
  box-shadow: 0 7px 14px 0 rgba(65, 69, 88, 0.1),
    0 3px 6px 0 rgba(0, 0, 0, 0.07);
  min-height: 600px;
  transition: all 0.3s ease;
}


@media (max-width: 1024px) {
  .profile-content .grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>