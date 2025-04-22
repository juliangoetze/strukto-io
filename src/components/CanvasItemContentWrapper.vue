<template>
  <div class="container" @mouseover.stop="handleMouseOver" @mouseleave="handleMouseLeave">
    <div
      ref="dragElement"
      :style="parentStyle"
      class="item"
      :draggable="!store.activeEditing"
      :class="{ 'item--hover': isHovered }"
      @dragstart.stop="handleDragStart"
      @dragend.stop="store.activeDragging = false"
    >
      <slot />
    </div>
    <Transition name="expand">
      <div v-if="isHovered" class="actions-wrapper">
        <BaseButton icon-name="mdi:trash" icon-size="25px" @click="emit('delete-clicked')"> Löschen </BaseButton>
        <slot name="buttons" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import BaseButton from '@/components/BaseButton.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { Node } from '@/types/nodes'

const store = useGlobalStore()
const emit = defineEmits(['delete-clicked', 'update:root'])
const props = defineProps<{ root: Node | null; parentStyle?: Record<string, string>; deleteItem: () => void }>()

const dragElement = ref<HTMLElement>()

const root = computed({
  get: () => {
    return props.root
  },
  set: (value) => {
    emit('update:root', value)
  },
})

const isHovered = computed(() => {
  return store.mouseOverElementId == props.root?.id
})

const zIndex = computed(() => {
  if (isHovered.value) return '3000'
  return '1'
})

function handleMouseLeave() {
  if (store.mouseOverElementId == props.root?.id) store.mouseOverElementId = ''
}

function handleDragStart(event: DragEvent) {
  store.activeDragging = true

  if (!root.value) return

  store.draggingElementId = root?.value?.id || ''

  const rootWithoutChildAfter = { ...root.value }
  rootWithoutChildAfter.childAfter = null
  event.dataTransfer?.setData('text/plain', JSON.stringify(rootWithoutChildAfter))
}

function handleMouseOver() {
  store.mouseOverElementId = root.value?.id || ''
}

onMounted(() => {
  if (!dragElement.value) return
  dragElement.value.addEventListener('dragend', () => {
    store.draggingElementId = ''
    if (store.lastDroppedParentId != root.value?.id) {
      setTimeout(() => {
        props.deleteItem()
      }, 1)
    }
  })
})
</script>

<style scoped>
.container {
  width: 100%;
  position: relative;
  z-index: v-bind(zIndex);
}
.item {
  cursor: pointer;
  background-color: var(--editor-canvas-background);
  transition: transform 0.1s ease;
}
.item--hover {
  transform: scale(1.1);
  box-shadow: var(--box-shadow-200);
}
.actions-wrapper {
  position: absolute;
  left: 100%;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem;
  height: 100%;
}
</style>
