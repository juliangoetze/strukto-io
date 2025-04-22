<template>
  <div class="logo">
    <SvgLogoIcon class="icon" color="var(--color-text-active)" @click="emit('clicked')" />
    <h1 @click="emit('clicked')">Strukto.io</h1>
  </div>
</template>

<script setup lang="ts">
import SvgLogoIcon from '@/assets/icons/IconLogo.vue'

const emit = defineEmits(['clicked'])
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Advent+Pro:wght@100;400&display=swap');

h1 {
  font-family: 'Advent Pro', sans-serif;
  font-size: var(--fs-600);
  font-weight: 400;
  text-shadow: var(--text-shadow-100);
  color: var(--color-text-active);
  cursor: pointer;
}

.logo {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.icon {
  height: 4rem;
  width: 4rem;
  cursor: pointer;
}
</style>
