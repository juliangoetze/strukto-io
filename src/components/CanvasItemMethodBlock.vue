<template>
  <div v-if="root" class="method-item-container">
    <CanvasItemContentWrapper v-model:root="root" :delete-item="deleteParent" @delete-clicked="emit('delete-clicked')">
      <CanvasItemChildzone
        :parent-id="root.id"
        :root="null"
        :has-height="expandChildzones"
        :colored="expandChildzones"
        class="item-childzone"
        @child-dropped="handleChildDropped"
      />
      <div ref="statementRef" class="item-statement">
        <BaseTextInput v-if="root" v-model:text="root.textCondition" :max-width="`${width - 4}px`" />
      </div>
    </CanvasItemContentWrapper>
    <CanvasItemChildzone
      v-model:root="root.childAfter"
      :parent-id="root.id"
      class="item-childzone"
      :has-height="expandChildzones || root.childAfter != null"
      :colored="expandChildzones"
    >
      <CanvasGenericChild
        v-if="root.childAfter?.type"
        :key="root.childAfter?.id"
        v-model:root="root.childAfter"
        :before-child-id="root.id"
        :delete-parent="() => (root!.childAfter = root?.childAfter?.childAfter || null)"
        @delete-clicked="root.childAfter = root?.childAfter?.childAfter || null"
        @child-changed="handleChildChanged($event)"
      />
    </CanvasItemChildzone>
  </div>
</template>
<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, inject, provide, ref } from 'vue'

import BaseTextInput from '@/components/BaseTextInput.vue'
import CanvasGenericChild from '@/components/CanvasGenericChild.vue'
import CanvasItemChildzone from '@/components/CanvasItemChildzone.vue'
import CanvasItemContentWrapper from '@/components/CanvasItemContentWrapper.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { MethodBlock, Node } from '@/types/nodes'
import { methodBlockInit } from '@/util/nodeInits'
import { shiftAfterNode } from '@/util/nodeMovements'

type Props = { root: Node | null; deleteParent: () => void; beforeChildId?: string }

const props = defineProps<Props>()
const emit = defineEmits(['delete-clicked', 'update:root', 'child-changed'])
const store = useGlobalStore()
const statementRef = ref(null)
const { width } = useElementSize(statementRef)
let parents: string[] = inject('parents') || []
parents = parents.filter((id) => id != props.beforeChildId)

const root = computed({
  get: () => props.root as MethodBlock | null,
  set: (value: Node | null) => emit('update:root', value),
})

const expandChildzones = computed(() => {
  if (!store.activeDragging) return false
  if (store.draggingElementId == root.value?.id) return false
  if (parents.includes(store.draggingElementId)) return false
  return true
})

if (!root.value) root.value = methodBlockInit()

function handleChildChanged(newChildRoot: Node) {
  if (!root.value) return

  const newNode = shiftAfterNode(root.value['childAfter'], newChildRoot)
  root.value['childAfter'] = newNode
}

function handleChildDropped(e: Node) {
  emit('child-changed', e)
}
provide('parents', [...parents, root.value?.id])
</script>
<style scoped>
.method-item-container {
  flex-grow: 1;

  display: flex;
  flex-direction: column;

  min-width: initial;
  height: fit-content;
  width: fit-content;
}
.item-statement {
  position: relative;

  display: flex;
  justify-content: space-around;
  align-items: center;

  padding-left: 15%;
  padding-right: 15%;

  min-width: var(--min-width-editor-item);
  min-height: var(--min-height-editor-argument);

  border: 2px solid var(--color-text-active);
}
.item-statement::before {
  content: '';
  position: absolute;
  left: 10%;
  border-left: 2px solid var(--color-text-active);
  height: 100%;
}
.item-statement::after {
  content: '';
  position: absolute;
  left: 90%;
  border-left: 2px solid var(--color-text-active);
  height: 100%;
}
</style>
