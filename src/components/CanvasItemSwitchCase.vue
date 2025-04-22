<template>
  <div v-if="root" class="content-wrapper">
    <CanvasItemContentWrapper
      v-model:root="root"
      :delete-item="deleteParent"
      :parent-style="itemContentStyle"
      @delete-clicked="emit('delete-clicked')"
    >
      <!-- Erste Reihe der Grid ab hier -->
      <CanvasItemChildzone
        :parent-id="root.id"
        :root="null"
        :has-height="expandChildzones"
        :colored="expandChildzones"
        class="item-childzone before-child"
        @child-dropped="handleChildDropped"
      />
      <div
        v-for="(item, index) in root.cases"
        :key="index"
        class="case-triangle"
        :style="{
          gridColumn: `${index + 1} / ${index + 1}`,
          '--divider-height': `${caseTriangleBorderHeights[index]}px`,
        }"
        :class="{ 'first-column-element': index == 0 }"
      >
        <SvgLine
          v-if="index == 0"
          alignment="left"
          type="descending"
          :height="elseTriangleSize.height.value"
          :width="(elseStatementSize.width.value + 2) * root.cases.length - 2"
        />
      </div>
      <div ref="elseTriangle" class="else-triangle">
        <SvgLine
          alignment="left"
          :height="elseTriangleSize.height.value"
          :width="elseStatementSize.width.value + 2"
          type="ascending"
        />
      </div>
      <div class="case-argument" :style="{ '--margin-left': `-${elseStatementSize.width.value / 2}px` }">
        <BaseTextInput
          ref="caseArgument"
          v-model:text="root.textCondition"
          :max-width="`${elseStatementSize.width.value - 10}px`"
        />
      </div>

      <!-- Zweite Reihe der Grid ab hier -->
      <div
        v-for="(item, index) in root.cases"
        :key="index"
        :style="{ gridColumn: `${index + 1} / ${index + 1}` }"
        class="case-statement"
        :class="{ 'first-column-element': index == 0 }"
      >
        <BaseTextInput
          v-if="root.cases[index]"
          v-model:text="root.cases[index].caseText"
          :max-width="`${elseStatementSize.width.value - 5}px`"
        />
      </div>
      <div ref="elseStatement" class="else-statement">
        <BaseTextInput v-model:text="root.elseCase.caseText" :max-width="`${elseStatementSize.width.value - 5}px`" />
      </div>
      <!-- Case Childs -->
      <!-- Else Child -->
      <CanvasItemChildzone
        v-for="(item, index) in root.cases"
        :key="index"
        v-model:root="root.cases[index].caseChild"
        :parent-id="root.id"
        :has-height="true"
        :colored="expandChildzones"
        class="item-childzone case-childzone"
        :class="{ 'first-column-element': index == 0 }"
        :style="{ gridColumn: `${index + 1} / ${index + 1}`, gridRow: 4 }"
      >
        <CanvasGenericChild
          v-if="root.cases[index]?.caseChild?.type != null"
          :key="root.cases[index].caseChild?.id"
          v-model:root="root.cases[index].caseChild"
          :delete-parent="() => (root!.cases[index].caseChild = root?.cases[index].caseChild?.childAfter || null)"
          @delete-clicked="root.cases[index].caseChild = root?.cases[index].caseChild?.childAfter || null"
          @child-changed="handleChildChanged($event, 'cases', index)"
        />
      </CanvasItemChildzone>
      <CanvasItemChildzone
        v-model:root="root.elseCase.caseChild"
        :parent-id="root.id"
        class="item-childzone else-childzone"
        :colored="expandChildzones"
        :has-height="true"
      >
        <CanvasGenericChild
          v-if="root.elseCase.caseChild?.type"
          :key="root.elseCase.caseChild?.id"
          v-model:root="root.elseCase.caseChild"
          :delete-parent="() => (root!.elseCase.caseChild = root?.elseCase?.caseChild?.childAfter || null)"
          @delete-clicked="root.elseCase.caseChild = root?.elseCase?.caseChild?.childAfter || null"
          @child-changed="handleChildChanged($event, 'elseCase', -1)"
        />
      </CanvasItemChildzone>
      <template #buttons>
        <BaseButton icon-name="mdi:add" icon-size="25px" @click="addCase"> Case </BaseButton>
        <BaseButton icon-name="mdi:minus" icon-size="25px" @click="removeCase"> Case </BaseButton>
      </template>
    </CanvasItemContentWrapper>
    <CanvasItemChildzone
      v-model:root="root.childAfter"
      :parent-id="root.id"
      class="after-child"
      :colored="expandChildzones"
      :has-height="expandChildzones || root.childAfter != null"
    >
      <CanvasGenericChild
        v-if="root.childAfter?.type"
        :key="root.childAfter?.id"
        v-model:root="root.childAfter"
        :before-child-id="root.id"
        :delete-parent="() => (root!.childAfter = root?.childAfter?.childAfter || null)"
        @delete-clicked="root.childAfter = root?.childAfter?.childAfter || null"
        @child-changed="handleChildChanged($event, 'childAfter', -1)"
      />
    </CanvasItemChildzone>
  </div>
</template>
<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, inject, provide, reactive, ref } from 'vue'

import BaseButton from '@/components/BaseButton.vue'
import BaseTextInput from '@/components/BaseTextInput.vue'
import CanvasGenericChild from '@/components/CanvasGenericChild.vue'
import CanvasItemChildzone from '@/components/CanvasItemChildzone.vue'
import CanvasItemContentWrapper from '@/components/CanvasItemContentWrapper.vue'
import SvgLine from '@/components/SvgLine.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { Node, SwitchCase } from '@/types/nodes'
import { switchCaseInit } from '@/util/nodeInits'
import { shiftAfterNode } from '@/util/nodeMovements'
// index des items in data-id oderso mitgeben, und in ::after pseudo element verwenden

type Props = { root: Node | null; deleteParent: () => void; beforeChildId?: string }
type ChildLocation = 'cases' | 'elseCase' | 'childAfter'

const props = defineProps<Props>()
const emit = defineEmits(['delete-clicked', 'update:root', 'child-changed'])
const store = useGlobalStore()
let parents: string[] = inject('parents') || []
parents = parents.filter((id) => id != props.beforeChildId)

const root = computed({
  get: () => props.root as SwitchCase | null,
  set: (value: Node | null) => emit('update:root', value),
})

const expandChildzones = computed(() => {
  if (!store.activeDragging) return false
  if (store.draggingElementId == root.value?.id) return false
  if (parents.includes(store.draggingElementId)) return false
  return true
})

if (!root.value) root.value = switchCaseInit()

const elseStatement = ref<HTMLElement>()
const caseArgument = ref<HTMLElement>()
const elseTriangle = ref<HTMLElement>()

const elseStatementSize = useElementSize(elseStatement)
const caseArgumentSize = useElementSize(caseArgument)
const elseTriangleSize = useElementSize(elseTriangle)

const caseTriangleBorderHeights = computed(() => {
  const heights: number[] = []
  if (!root.value) return heights
  const casesAmount = root.value.cases.length
  root.value.cases.forEach((element, index) => {
    const borderHeight = ((index + 1) / casesAmount) * (elseTriangleSize.height.value + 2)

    heights.unshift(borderHeight)
  })
  return heights
})

const templateRowStyle = computed(() => {
  return `min-content ${caseArgumentSize.height.value + 50}px min-content min-content min-content`
})

const templateColumnStyle = computed(() => {
  if (!root.value?.cases) return ''
  return `repeat(${root.value.cases.length + 1}, 1fr)`
})

const itemWidthStyle = computed(() => {
  if (!root.value) return '0px'
  return ` calc(${root.value.cases.length + 1} * var(--min-width-block-item)) `
})

const itemContentStyle = reactive({
  display: 'grid',
  position: 'relative',
  'grid-template-columns': templateColumnStyle,
  'grid-template-rows': templateRowStyle,
  'min-width': itemWidthStyle,
})

function addCase() {
  if (!root.value) return
  root.value.cases.push({ caseText: 'Condition', caseChild: null })
}

function removeCase() {
  if (!root.value) return
  if (root.value.cases.length > 1) root.value.cases.pop()
}

function handleChildDropped(e: Node) {
  emit('child-changed', e)
}

function handleChildChanged(newChildRoot: Node, childLocation: ChildLocation, index: number) {
  if (!root.value) return
  let newNode = null

  switch (childLocation) {
    case 'cases':
      newNode = shiftAfterNode(root.value.cases[index].caseChild as Node, newChildRoot)
      root.value.cases[index].caseChild = newNode
      break
    case 'elseCase':
      newNode = shiftAfterNode(root.value.elseCase.caseChild as Node, newChildRoot)
      root.value.elseCase.caseChild = newNode
      break
    case 'childAfter':
      newNode = shiftAfterNode(root.value.childAfter as Node, newChildRoot)
      root.value.childAfter = newNode
      break
  }
}
provide('parents', [...parents, root.value?.id])
</script>
<style scoped>
.content-wrapper {
  flex-grow: 1;
  width: max-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
}
.item-childzone {
  min-width: var(--min-width-editor-childzone);
}

.case-childzone {
  border-right: 2px solid var(--color-text-active);
  border-bottom: 2px solid var(--color-text-active);
}
.else-childzone {
  grid-row: 4;
  border-right: 2px solid var(--color-text-active);
  border-bottom: 2px solid var(--color-text-active);
}
.first-column-element {
  border-left: 2px solid var(--color-text-active);
}
.case-triangle {
  grid-row: 2;
  position: relative;
  display: flex;
  align-items: flex-end;
  border-top: 2px solid var(--color-text-active);
}
.case-triangle::before {
  content: '';

  position: absolute;
  left: -2px;
  bottom: 0;
  width: 2px;
  height: var(--divider-height);

  background-color: var(--color-text-active);
}

.else-triangle {
  grid-row: 2;
  margin-left: -2px;
  position: relative;
  grid-column-end: -1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-right: 2px solid var(--color-text-active);
  border-top: 2px solid var(--color-text-active);
}
.case-statement {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  grid-row: 3;
  border-bottom: 2px solid var(--color-text-active);
  border-right: 2px solid var(--color-text-active);
}
.else-statement {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  grid-row: 3;
  grid-column-end: -1;
  border-bottom: 2px solid var(--color-text-active);
  border-right: 2px solid var(--color-text-active);
  border-right: 2px solid var(--color-text-active);
}

.before-child {
  grid-row: 1;
  grid-column-start: 1;
  grid-column-end: -1;
}
.case-argument {
  margin-left: var(--margin-left);
  grid-row: 2;
  grid-column-end: -1;
}
</style>
