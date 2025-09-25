<template>
  <div class="profile-page">
    <h1 class="text-text-primary">Profil Sayfası Test</h1>
    <p class="text-text-secondary">Bu basit bir test sayfasıdır.</p>
  </div>
</template>

<script>
export default {
  name: 'ProfilePageSimple',
  mounted() {
    console.log('ProfilePageSimple mounted')
  }
}
</script>

<style scoped>
.profile-page {
  padding: 2rem;
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>