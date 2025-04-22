<template>
  <div class="svg-container">
    <svg :height="height + 2" :width="width" xmlns="http://www.w3.org/2000/svg">
      <line
        stroke="var(--color-text-active)"
        stroke-width="2"
        x1="0"
        :x2="width"
        :y1="type == 'descending' ? 0 : height"
        :y2="type == 'descending' ? height : 0"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
type LineType = 'ascending' | 'descending'
type Alignment = 'left' | 'right'
type Props = { width: number; height: number; type: LineType; alignment: Alignment }

const props = defineProps<Props>()

const left = computed(() => {
  return props.alignment == 'left' ? '0' : 'initial'
})

const right = computed(() => {
  return props.alignment == 'left' ? '100%' : '0'
})
</script>

<style>
.svg-container {
  position: absolute;
  top: 0;
  bottom: 100%;
  left: v-bind(left);
  right: v-bind(right);
}
</style>
