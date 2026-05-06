<script setup lang="ts">
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/leetCode">LeetCodeExample</RouterLink>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>

header {
  position: sticky;
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
