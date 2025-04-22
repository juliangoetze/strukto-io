<template>
  <div class="content-container">
    <div class="empty-text">
      {{ displayText }}
    </div>
    <img :src="url" :alt="alt" class="empty-image" />
  </div>
</template>
<script setup lang="ts">
type Props = {
  url: string
  displayText: string
  alt?: string
}

const props = defineProps<Props>()
</script>
<style scoped>
.content-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.empty-text {
  font-size: var(--fs-editor-canvas-heading);
}
.empty-image {
  height: clamp(2rem, 40vh, 20rem);
}
</style>
