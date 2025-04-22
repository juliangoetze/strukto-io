<template>
  <header>
    <div class="header-container">
      <AppHeader />
    </div>
  </header>
  <main>
    <div class="main-container"><AppCanvas /></div>
  </main>
  <footer class="footer-container">
    <AppFooter />
  </footer>
</template>

<script setup lang="ts">
import AppCanvas from './components/AppCanvas.vue'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap');
</style>

<style scoped>
.header-container {
  --margin-top: 1rem;
  --height: fit-content;

  position: fixed;
  top: var(--margin-top);
  left: var(--padding-horizontal);
  right: var(--padding-horizontal);
  max-height: var(--height);
}

.footer-container {
  --height: fit-content;
  --margin-bottom: 1.5rem;

  position: fixed;
  left: var(--padding-horizontal);
  right: var(--padding-horizontal);
  bottom: var(--margin-bottom);
}

.main-container {
  --margin-vertical: clamp(4rem, 15vh, 5rem);

  position: fixed;
  left: var(--padding-horizontal);
  right: var(--padding-horizontal);
  top: var(--margin-vertical);
  bottom: var(--margin-vertical);
}
</style>
