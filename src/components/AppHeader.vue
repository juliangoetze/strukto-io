<template>
  <div class="container">
    <AppLogo class="app-logo header-item" @clicked="openHomepage" />
    <HeaderNav class="header-nav header-item" />
    <HeaderActions class="header-item" />
  </div>
</template>

<script setup lang="ts">
import HeaderActions from '@/components/HeaderActions.vue'
import HeaderNav from '@/components/HeaderNav.vue'
import AppLogo from '@/components/AppLogo.vue'

function openHomepage() {
  window.open('https://strukto.io', '_blank')
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-logo {
  font-size: var(--fs-logo);
}

.header-item {
  flex: 1;
}
</style>
