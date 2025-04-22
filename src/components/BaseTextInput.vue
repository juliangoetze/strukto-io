<template>
  <div class="container">
    <div
      v-if="!isEditing || !editable"
      class="text-container"
      :style="{ cursor: editable ? 'pointer' : '' }"
      @click="handleTextClick"
    >
      {{ text }}
    </div>
    <div v-else class="input-container">
      <input
        ref="textInput"
        v-model="text"
        type="text"
        class="text-input"
        @keyup.enter="handleEnter"
        @focusout="handleEnter"
        @keypress.escape="handleEscape"
        @keyup.esc="handleEscape"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineEmits, nextTick, ref } from 'vue'

import { useGlobalStore } from '@/stores/globalStore'

type Props = {
  text?: string
  maxWidth?: string
  editable?: boolean
  textAlign?: string
}

const props = withDefaults(defineProps<Props>(), { text: '', maxWidth: 'auto', editable: true, textAlign: 'center' })
const emit = defineEmits(['update:text'])

const isEditing = ref(false)
const textInput = ref<HTMLElement>()
const store = useGlobalStore()
let savedTextValue = new String(props.text)

const text = computed({
  get() {
    return props.text
  },
  set(value: string) {
    emit('update:text', value)
  },
})

function handleTextClick() {
  if (!props.editable) return
  isEditing.value = true
  store.activeEditing = true
  nextTick(() => {
    if (!textInput.value) return
    textInput.value.focus()
  })
}

function handleEnter() {
  isEditing.value = false
  store.activeEditing = false
  if (text.value == '') {
    text.value = 'Condition'
  }
  savedTextValue = new String(text.value)
}

function handleEscape() {
  isEditing.value = false
  store.activeEditing = false
  text.value = savedTextValue.toString()
}
</script>
<style scoped>
.input-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text-container {
  text-align: v-bind(textAlign);
  overflow-wrap: break-word;
  max-width: v-bind(maxWidth);
}

.container {
  position: relative;
  z-index: 2000;
  font-size: var(--fs-400);
}

.text-input {
  border: 2px solid var(--color-primary);
  outline: 0;
  border-radius: 0.3rem;
  transition: transform 0.2s ease;
  box-shadow: var(--box-shadow-100);
  width: v-bind(maxWidth);
}
.text-input:focus {
  border: 2px solid var(--color-primary);
  outline: 0 !important;
}
</style>
