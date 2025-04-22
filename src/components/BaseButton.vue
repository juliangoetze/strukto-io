<template>
  <button class="button">
    <div class="container">
      <Icon v-if="iconName" :size="iconSize" :icon="iconName" :color="textColor" />
      <div><slot /></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { computed, withDefaults } from 'vue'

import { Icon } from '@iconify/vue'
import BaseIcon from '@/components/BaseIcon.vue'

const props = withDefaults(defineProps<{ iconName?: string; iconSize?: string }>(), {
  iconName: undefined,
  iconSize: '25px',
})

const isDark = useDark({
  selector: 'html',
})

const textColor = computed(() => {
  if (isDark.value) return 'var(--color-text-active-light)'
  return 'var(--color-text-active-dark)'
})
</script>

<style scoped>
/* reset */
.button {
  border: 0;
}

.button {
  min-height: 25px;
  border-radius: 8px;
  padding: 0.15rem 0.5rem 0.15rem 0.5rem;
  font-size: var(--fs-350);

  box-shadow: var(--box-shadow-200);
  cursor: pointer;

  transition: transform ease 0.01s;
  transition: box-shadow ease 0.01s;
}

.button:hover {
  transform: scale(1.03);
  box-shadow: var(--box-shadow-600);
}

.button:active {
  transform: scale(1.01);
}

html:not(.dark) .button {
  background-color: var(--app-background-color-dark);
  color: var(--color-text-active-dark);
}

html.dark .button {
  background-color: var(--app-background-color-light);
  color: var(--color-text-active-light);
}

.container {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
</style>
