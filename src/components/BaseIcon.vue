<template>
  <component
    :is="iconComponents[name.toLowerCase()]"
    class="icon"
    :class="{ scale: scaleOnHover }"
    :width="size"
    :height="size"
    viewBox="0 0 50 50"
    preserveAspectRatio="none"
    v-bind="attrs"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, useAttrs } from 'vue'

type Props = { name: string; size: string; color?: string; scaleOnHover?: boolean }

const props = defineProps<Props>()
const attrs = useAttrs()

const color = computed(() => {
  if (!props.color) return 'var(--color-text-active'
  return props.color
})

const iconRoutes = import.meta.glob('../assets/icons/*.vue')
const iconComponents: Record<string, unknown> = {}

// defining all available Icon Components as async Components
Object.keys(iconRoutes).forEach((key) => {
  const name = (key.match('../assets/icons/Icon(.*?).vue') as RegExpMatchArray)[1].toLowerCase()
  iconComponents[name] = defineAsyncComponent(() => iconRoutes[key]() as any)
})
</script>

<style scoped>
.icon {
  cursor: pointer;
  fill: v-bind(color);
}

.scale {
  transition: transform ease 0.01s;
}
.scale:hover {
  transform: scale(1.1);
}
.scale:active {
  transform: scale(1.01);
}
</style>
