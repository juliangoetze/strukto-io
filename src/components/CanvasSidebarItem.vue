<template>
  <UseDark v-slot="{ isDark }">
    <div class="sidebar-item-container">
      <div
        ref="elementToMove"
        class="item"
        draggable="true"
        @dragend="handleDragEnd"
        @dragstart="handleDragStart"
        @touchstart.prevent="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend.prevent="handleTouchEnd"
      >
        <img
          draggable="false"
          class="item-icon"
          :src="`svg/shapes/${props.type + '-' + (isDark ? 'dark' : 'light')}.svg`"
          alt=""
        />
      </div>
      <div ref="itemTitle" class="item-title">
        {{ props.type }}
      </div>
    </div>
  </UseDark>
</template>

<script setup lang="ts">
import { UseDark } from '@vueuse/components'
import { computed, ref } from 'vue'

import { useGlobalStore } from '@/stores/globalStore'
import { Node, NodeType } from '@/types/nodes'
import { discriminatedNodeInit } from '@/util/nodeInits'

type Props = {
  type: NodeType
  level?: number
}

const globalStore = useGlobalStore()

const props = withDefaults(defineProps<Props>(), { level: 0 })
const elementToMove = ref<HTMLElement>()
const itemTitle = ref<HTMLElement>()

const zIndex = computed(() => {
  return 10000 + props.level
})

let initialX = ''
let initialY = ''

function handleDragStart(event: DragEvent) {
  const nodeData: Node = discriminatedNodeInit(props.type)
  event.dataTransfer?.setData('text/plain', JSON.stringify(nodeData))
  globalStore.activeDragging = true
  globalStore.draggingElementId = 'initial'
}

function handleDragEnd() {
  globalStore.activeDragging = false
  globalStore.draggingElementId = ''
}

function handleTouchStart() {
  if (!elementToMove.value) return

  initialX = elementToMove.value.style.left
  initialY = elementToMove.value.style.top

  elementToMove.value.style.position = 'fixed'

  if (!itemTitle.value) return
  itemTitle.value.classList.add('hidden')
}

function handleTouchMove(event: TouchEvent) {
  if (!elementToMove.value) return
  elementToMove.value.style.transitionDuration = 'initial'

  const touchLocation = event.targetTouches[0]
  elementToMove.value.style.left = touchLocation.pageX - 56 + 'px'
  elementToMove.value.style.top = touchLocation.pageY - 32 + 'px'
}

function handleTouchEnd() {
  if (!elementToMove.value) return

  elementToMove.value.style.transitionDuration = '300ms'
  elementToMove.value.style.position = ''
  elementToMove.value.style.left = initialX
  elementToMove.value.style.top = initialY

  if (!itemTitle.value) return
  itemTitle.value.classList.remove('')
}
</script>
<style scoped>
.sidebar-item-container {
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}
.item {
  z-index: v-bind(zIndex);
  width: 7rem;
  height: 4rem;
  border-radius: 0.7rem;
  cursor: pointer;

  box-shadow: var(--box-shadow-400);
  transition-property: left, top, width, height;
  transition-timing-function: ease-out;
  transition-duration: 200ms;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: var(--editor-tool-background);
}

.item:hover {
  border: 3px solid rgb(var(--color-primary-500));
  box-shadow: var(--box-shadow-600);

  width: 8.75rem;
  height: 5rem;
}

.item-title {
  align-self: center;
  font-size: var(--fs-editor-tool-item);
}

.item-icon {
  max-width: 80%;
  max-height: 80%;
}
.hidden {
  display: none;
}
</style>
