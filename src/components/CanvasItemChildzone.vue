<template>
  <div
    v-show="hasHeight"
    :id="root?.id || parentId"
    class="container"
    :class="{
      container__colored: colored && !isHovered && !root?.type,
      'container__colored-dark': colored && isHovered && !root?.type,
    }"
    @drop.prevent="handleDrop"
    @dragenter.prevent="isHovered = true"
    @dragover.prevent
    @mouseleave="isHovered = false"
    @dragleave="isHovered = false"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useGlobalStore } from '@/stores/globalStore'
import { Node } from '@/types/nodes'

type Props = { hasHeight: boolean; colored: boolean; root: Node | null; minHeight?: string; parentId?: string }

const props = withDefaults(defineProps<Props>(), {
  minHeight: 'var(--min-height-editor-childzone)',
  parentId: '',
})
const emit = defineEmits(['child-dropped', 'update:root', 'mouseleave'])
const store = useGlobalStore()

const root = computed({
  get: () => props.root,
  set: (value: Node | null) => emit('update:root', value),
})

const isHovered = ref(false)

function handleDrop(event: DragEvent) {
  if (!props.colored) return
  if (root.value?.id) return
  store.lastDroppedParentId = props.parentId
  if (store.draggingElementId == (root.value?.id || props.parentId)) return

  const stringRoot = event.dataTransfer?.getData('text/plain')

  if (!stringRoot) return
  const droppedChildRoot = JSON.parse(stringRoot) as Node

  emit('child-dropped', droppedChildRoot)
  root.value = droppedChildRoot
}
</script>
<style scoped>
.container {
  display: flex;

  min-height: v-bind(minHeight);
  min-width: 100%;
}
.container__colored {
  background-color: rgba(var(--color-primary-500), 0.1);
}

.container__colored-dark {
  background-color: rgba(var(--color-primary-500), 0.2);
}
</style>
