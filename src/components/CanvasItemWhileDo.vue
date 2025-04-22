<template>
  <div v-if="root" class="item-container">
    <CanvasItemContentWrapper v-model:root="root" :delete-item="deleteParent" @delete-clicked="emit('delete-clicked')">
      <CanvasItemChildzone
        :parent-id="root.id"
        :root="null"
        :has-height="expandChildzones"
        :colored="expandChildzones"
        class="item-childzone"
        @child-dropped="handleChildDropped"
      />
      <div class="while-item-content">
        <div ref="itemArgumentRef" class="item-argument">
          <BaseTextInput v-model:text="root.textCondition" :max-width="`${width - 2}px`" />
        </div>
        <CanvasItemChildzone
          v-model:root="root.child"
          :parent-id="root.id"
          :has-height="true"
          :colored="expandChildzones"
          class="item-childzone while-childzone"
        >
          <CanvasGenericChild
            v-if="root.child?.type"
            :key="root.child?.id"
            v-model:root="root.child"
            :delete-parent="() => (root!.child = root?.child?.childAfter || null)"
            @delete-clicked="root.child = root?.child?.childAfter || null"
            @child-changed="handleChildChanged($event, 'child')"
          />
        </CanvasItemChildzone>
      </div>
    </CanvasItemContentWrapper>
    <CanvasItemChildzone
      v-model:root="root.childAfter"
      :parent-id="root.id"
      :has-height="expandChildzones || root.childAfter != null"
      :colored="expandChildzones"
      class="item-childzone after-childzone"
    >
      <CanvasGenericChild
        v-if="root.childAfter?.type"
        :key="root.childAfter?.id"
        v-model:root="root.childAfter"
        :before-child-id="root.id"
        :delete-parent="() => (root!.childAfter = root?.childAfter?.childAfter || null)"
        @delete-clicked="root.childAfter = root?.childAfter?.childAfter || null"
        @child-changed="handleChildChanged($event, 'childAfter')"
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
import { Node, WhileDo } from '@/types/nodes'
import { whileDoInit } from '@/util/nodeInits'
import { shiftAfterNode } from '@/util/nodeMovements'

type Props = { root: Node | null; deleteParent: () => void; beforeChildId?: string }
type ChildLocation = 'childAfter' | 'child'

const props = defineProps<Props>()
const emit = defineEmits(['delete-clicked', 'update:root', 'child-changed'])
const store = useGlobalStore()
const itemArgumentRef = ref(null)
const { width } = useElementSize(itemArgumentRef)
let parents: string[] = inject('parents') || []
parents = parents.filter((id) => id != props.beforeChildId)

const root = computed({
  get: () => props.root as WhileDo | null,
  set: (value: Node | null) => emit('update:root', value),
})

const expandChildzones = computed(() => {
  if (!store.activeDragging) return false
  if (store.draggingElementId == root.value?.id) return false
  if (parents.includes(store.draggingElementId)) return false
  return true
})

if (!root.value) root.value = whileDoInit()

function handleChildDropped(e: Node) {
  emit('child-changed', e)
}

function handleChildChanged(newChildRoot: Node, childLocation: ChildLocation) {
  if (!root.value) return
  const newNode = shiftAfterNode(root.value[childLocation], newChildRoot)
  root.value[childLocation] = newNode

  switch (childLocation) {
    case 'childAfter':
      root.value.childAfter = newChildRoot
      break
    case 'child':
      root.value.child = newChildRoot
      break
  }
}
provide('parents', [...parents, root.value?.id])
</script>
<style scoped>
.item-container {
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  height: fit-content;
  width: fit-content;
  min-width: var(--min-width-editor-item);
}
.while-item-content {
  min-width: 100%;
  padding-left: 1.5rem;
  border: 2px solid var(--color-text-active);
}

.item-childzone {
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-self: flex-end;
}

.item-childzone.while-childzone {
  border: 2px solid var(--color-text-active);
}
.item-argument {
  min-height: var(--min-height-editor-argument);
  height: fit-content;
}
</style>
