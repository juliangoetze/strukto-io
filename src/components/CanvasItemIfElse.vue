<template>
  <div v-if="root" class="canvas-item-container">
    <CanvasItemContentWrapper v-model:root="root" :delete-item="deleteParent" @delete-clicked="emit('delete-clicked')">
      <CanvasItemChildzone
        :parent-id="root.id"
        :root="null"
        :has-height="expandChildzones"
        :colored="expandChildzones"
        class="item-childzone"
        @child-dropped="handleChildDropped"
      />
      <UseElementSize v-slot="{ width, height }">
        <div class="argument-container" data-colored="true">
          <div class="argument-if-display">
            <SvgLine alignment="left" :width="width / 2" :height="height - 2" type="descending" />
            <BaseTextInputVue v-model:text="ifStatement" :max-width="`${width / 3 - 2}px`" :editable="false" />
          </div>
          <div class="argument">
            <BaseTextInputVue v-model:text="root.textCondition" class="if-input" :max-width="`${width / 3 - 2}px`" />
          </div>
          <div class="argument-else-display">
            <SvgLine alignment="right" :width="width / 2" :height="height - 2" type="ascending" />
            <BaseTextInputVue v-model:text="elseStatement" :max-width="`${width / 3 - 2}px`" :editable="false" />
          </div>
        </div>
      </UseElementSize>
      <div class="childzone-container">
        <CanvasItemChildzone
          v-model:root="root.childIf"
          :parent-id="root.id"
          class="childzone-if"
          :has-height="true"
          :colored="expandChildzones"
        >
          <CanvasGenericChild
            v-if="root.childIf?.type"
            :key="root.childIf?.id"
            v-model:root="root.childIf"
            :delete-parent="() => (root!.childIf = root?.childIf?.childAfter || null)"
            @delete-clicked="root.childIf = root?.childIf?.childAfter || null"
            @child-changed="handleChildChanged($event, 'childAfter')"
          />
        </CanvasItemChildzone>
        <div class="childzone-middle-border" />
        <CanvasItemChildzone
          v-model:root="root.childElse"
          :parent-id="root.id"
          class="childzone-else"
          :has-height="true"
          :colored="expandChildzones"
        >
          <CanvasGenericChild
            v-if="root.childElse?.type"
            :key="root.childElse?.id"
            v-model:root="root.childElse"
            :delete-parent="() => (root!.childElse = root?.childElse?.childAfter || null)"
            @delete-clicked="root.childElse = root?.childElse?.childAfter || null"
            @child-changed="handleChildChanged($event, 'childElse')"
          />
        </CanvasItemChildzone>
      </div>
    </CanvasItemContentWrapper>
    <CanvasItemChildzone
      v-model:root="root.childAfter"
      :parent-id="root.id"
      class="childzone-after"
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
        @child-changed="handleChildChanged($event, 'childAfter')"
      />
    </CanvasItemChildzone>
  </div>
</template>

<script setup lang="ts">
import { UseElementSize } from '@vueuse/components'
import { computed, inject, provide, ref } from 'vue'

import BaseTextInputVue from '@/components/BaseTextInput.vue'
import CanvasGenericChild from '@/components/CanvasGenericChild.vue'
import CanvasItemChildzone from '@/components/CanvasItemChildzone.vue'
import CanvasItemContentWrapper from '@/components/CanvasItemContentWrapper.vue'
import SvgLine from '@/components/SvgLine.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { IfElse, Node } from '@/types/nodes'
import { ifElseInit } from '@/util/nodeInits'
import { shiftAfterNode } from '@/util/nodeMovements'

type Props = { root: Node | null; deleteParent: () => void; beforeChildId?: string }
type ChildLocation = 'childAfter' | 'childIf' | 'childElse'

const props = defineProps<Props>()
const emit = defineEmits(['update:root', 'child-changed', 'delete-clicked'])
const store = useGlobalStore()

let parents: string[] = inject('parents') || []
parents = parents.filter((id) => id != props.beforeChildId)

const root = computed({
  get: () => props.root as IfElse | null,
  set: (value: Node | null) => emit('update:root', value),
})

const expandChildzones = computed(() => {
  if (!store.activeDragging) return false
  if (store.draggingElementId == root.value?.id) return false
  if (parents.includes(store.draggingElementId)) return false
  return true
})

// IfElse Component initializes itself
if (!root.value) root.value = ifElseInit()

const ifStatement = ref('True')
const elseStatement = ref('False')

function handleChildChanged(newChildRoot: Node, childLocation: ChildLocation) {
  if (!root.value) return

  const newNode = shiftAfterNode(root.value[childLocation], newChildRoot)
  root.value[childLocation] = newNode

  switch (childLocation) {
    case 'childAfter':
      root.value.childAfter = newChildRoot
      break
    case 'childElse':
      root.value.childElse = newChildRoot
      break
    case 'childIf':
      root.value.childIf = newChildRoot
  }
}

function handleChildDropped(e: Node) {
  emit('child-changed', e)
}
provide('parents', [...parents, root.value?.id])
</script>

<style scoped>
.canvas-item-container {
  flex-grow: 1;
  position: relative;

  display: flex;
  flex-direction: column;

  min-width: var(--min-height-editor-item);
  height: fit-content;
  width: fit-content;

  background-color: var(--editor-canvas-background);
}
.argument-container {
  position: relative;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  min-height: var(--min-height-editor-argument);
  height: fit-content;

  border: 2px solid var(--color-text-active);
}
.argument {
  padding-bottom: 100%;
  display: flex;
  align-content: center;
  justify-content: center;

  height: fit-content;

  font-size: var(--fs-editor-canvas-item);
}
.argument-if-display {
  position: relative;
  grid-column: 1/1;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  font-size: var(--fs-editor-canvas-item);
}
.argument-else-display {
  position: relative;
  grid-column: 3/3;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  font-size: var(--fs-editor-canvas-item);
}

.childzone-container {
  display: grid;
  grid-template-columns: 1.5fr 2px 1.5fr;

  height: fit-content;
  justify-content: center;

  min-width: max-content;
  min-height: var(--min-height-editor-childzone);

  border-bottom: 2px solid var(--color-text-active);
}
.childzone-if {
  grid-column: 1 / 1;

  border-left: 2px solid var(--color-text-active);
}

.childzone-dragover {
  background-color: rgba(var(--color-primary-500), 0.3);
}

.childzone-else {
  grid-row: 1 / 1;
  grid-column: 3 / 3;

  border-right: 2px solid var(--color-text-active);
}
.childzone-after {
  grid-column: 1/2;
  grid-row: 2/2;
}

.childzone-middle-border {
  grid-column: 2/2;
  background-color: var(--color-text-active);
}
.if-else-item {
  transition: transform 0.1s ease;
}
.item--hover {
  transform: scale(1.1);
  box-shadow: var(--box-shadow-200);
}
</style>
