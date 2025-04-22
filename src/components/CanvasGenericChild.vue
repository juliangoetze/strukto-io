<template>
  <component :is="childNode" v-if="root" v-model:root="root" @child-changed="emit('child-changed', $event)" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import CanvasItemDoWhile from '@/components/CanvasItemDoWhile.vue'
import CanvasItemIfElse from '@/components/CanvasItemIfElse.vue'
import CanvasItemMethodBlock from '@/components/CanvasItemMethodBlock.vue'
import CanvasItemStatement from '@/components/CanvasItemStatement.vue'
import CanvasItemSwitchCase from '@/components/CanvasItemSwitchCase.vue'
import CanvasItemWhileDo from '@/components/CanvasItemWhileDo.vue'
import { Node } from '@/types/nodes'

type Props = { root: Node | null }

const props = defineProps<Props>()
const emit = defineEmits(['update:root', 'child-changed'])

const root = computed({
  get: () => props.root,
  set: (value: Node | null) => emit('update:root', value),
})

// root wird durchgereicht, der type wird von der childZone gesetzt
// root ist zu beginn null, wenn es durchgereicht wird, wird aber dann von der Komponente initialisiert

const canvasItems = {
  'do-while': CanvasItemDoWhile,
  'method-block': CanvasItemMethodBlock,
  statement: CanvasItemStatement,
  'switch-case': CanvasItemSwitchCase,
  'while-do': CanvasItemWhileDo,
  'if-else': CanvasItemIfElse,
}

const childNode = computed(() => {
  if (!root.value) return
  return canvasItems[root.value.type]
})
</script>
