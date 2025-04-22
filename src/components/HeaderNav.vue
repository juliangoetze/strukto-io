<template>
  <div class="nav-container">
    <!-- <a href="#" class="nav-item-inactive">Account</a> -->
    <a href="#" class="nav-item-active"
      ><div>Editor</div>
      <div class="active-item-underline"
    /></a>
    <!-- <a href="#" class="nav-item-inactive">About</a> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  navIndex: number

  navItems: string[]
}

const emit = defineEmits(['update:navIndex'])
</script>

<style scoped>
.nav-container {
  width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 2rem);
}

.nav-item-active {
  font-weight: var(--fw-medium);
  font-size: var(--fs-header-nav-item-active);
  color: var(--color-text-active);
  display: block;
}
.nav-item-inactive {
  font-weight: var(--fw-regular);
  font-size: var(--fs-header-nav-item-inactive);
  color: var(--color-text-inactive);
}

.active-item-underline {
  width: 100%;
  height: 0.2rem;
  border-radius: 0.5rem;
  background-color: rgb(var(--color-primary-500));
}
</style>
