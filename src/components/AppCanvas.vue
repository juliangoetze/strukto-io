<template>
  <div class="canvas-sidebar">
    <CanvasSidebarItem :type="'if-else'" />
    <CanvasSidebarItem :type="'do-while'" />
    <CanvasSidebarItem :type="'while-do'" />
    <CanvasSidebarItem :type="'statement'" />
    <CanvasSidebarItem :type="'method-block'" />
    <CanvasSidebarItem :type="'switch-case'" />
  </div>
  <div class="canvas-zoom-bar">
    <BaseIcon name="ZoomIn" viewBox="0 96 960 960" size="35px" scale-on-hover @click="changeScale(0.1)" />
    <BaseIcon name="ZoomOut" viewBox="0 96 960 960" size="35px" scale-on-hover @click="changeScale(-0.1)" />
  </div>
  <div class="canvas" :class="{ 'childzone-shown': showDropHighlights }">
    <Transition name="bubble" mode="out-in">
      <BaseEmptyContent
        v-if="store.root == null && !store.activeDragging"
        url="svg/drag.svg"
        display-text="Drag a node inside to get started!"
      />
      <CanvasItemChildzone
        v-else
        v-model:root="store.root"
        :parent-id="store.root?.id || 'source'"
        class="childzone"
        :class="{ 'full-height': store.activeDragging && store.root == null }"
        :has-height="true"
        :colored="store.activeDragging"
        @child-dropped="handleChildDropped"
      >
        <CanvasGenericChild
          v-if="store.root"
          id="root-element"
          :key="store.root?.id"
          v-model:root="store.root"
          :delete-parent="() => (store.root = store.root?.childAfter || null)"
          @delete-clicked="store.root = store.root?.childAfter || null"
          @child-changed="handleChildChanged($event)"
        />
      </CanvasItemChildzone>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

import BaseEmptyContent from '@/components/BaseEmptyContent.vue'
import CanvasItemChildzone from '@/components/CanvasItemChildzone.vue'
import CanvasSidebarItem from '@/components/CanvasSidebarItem.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { Node } from '@/types/nodes'
import { shiftAfterNode } from '@/util/nodeMovements'

import BaseIcon from './BaseIcon.vue'
import CanvasGenericChild from './CanvasGenericChild.vue'

const store = useGlobalStore()

const transitionIn = computed(() => {
  if (store.root == null && !store.activeDragging) return 'bounce-in 0.1s'
  else return '0.0s'
})

const transitionOut = computed(() => {
  if (store.root == null && !store.activeDragging) return 'bounce-out 0.1s'
  else return '0.0s'
})

const contentScale = ref(1)
const contentScaleStyle = computed(() => {
  return `scale(${contentScale.value})`
})

const showDropHighlights = computed(() => {
  return store.root == null && store.activeDragging
})

function handleChildDropped(e: Node) {
  store.root = e
}

function changeScale(value: number) {
  if (value <= 0 && contentScale.value <= 0.1) return
  contentScale.value += value
}

function handleChildChanged(newChildRoot: Node) {
  if (!store.root) return
  const newNode = shiftAfterNode(store.root, newChildRoot)
  store.root = newNode
}

watch(
  () => store.root,
  (newVal) => {
    localStorage.setItem('lastRoot', JSON.stringify(newVal))
  },
  { deep: true }
)

onMounted(() => {
  if (localStorage.getItem('lastRoot')) {
    store.root = JSON.parse(localStorage.getItem('lastRoot')!)
  }
})
</script>
<style scoped>
.canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  height: 100%;
  border-radius: 25px;
  box-shadow: var(--box-shadow-200);

  background-color: var(--editor-canvas-background);
}

.canvas-sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: calc(var(--padding-horizontal) / (-4));

  position: absolute;
  top: 0;
  bottom: 0;
}
.canvas-zoom-bar {
  display: flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: 0.5rem;
  right: 1rem;
  z-index: 50000;
}

.childzone {
  padding: 1rem 1rem;
  width: fit-content;
  flex-basis: auto;

  display: flex;
  flex-direction: column;

  align-items: center;
  overflow: scroll;
}
.childzone-shown {
  background-color: rgba(var(--color-primary-500), 0.1);
}

.childzone-dragover {
  background-color: rgba(var(--color-primary-500), 0.3);
}
#root-element {
  transform-origin: top center;
  transform: v-bind(contentScaleStyle);
}
.full-height {
  min-height: 100%;
}

.bubble-enter-active {
  animation: v-bind(transitionIn);
}
.bubble-leave-active {
  animation: v-bind(transitionOut);
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  100% {
    transform: scale(0);
  }
  0% {
    transform: scale(1);
  }
}
</style>
