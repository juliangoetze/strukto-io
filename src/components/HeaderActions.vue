<template>
  <div class="actions-container">
    <BaseIcon name="trash" size="28px" scale-on-hover @click="resetStruct" />
    <BaseIcon name="export" size="28px" scale-on-hover @click="exportStruct" />
    <UseDark v-slot="{ isDark, toggleDark }">
      <Transition name="toggle" mode="out-in">
        <div v-if="isDark">
          <BaseIcon name="lightMode" size="28px" scale-on-hover @click="toggleDark()" />
        </div>
        <div v-else>
          <BaseIcon name="darkMode" size="28px" scale-on-hover @click="toggleDark()" />
        </div>
      </Transition>
    </UseDark>
  </div>
</template>
<script setup lang="ts">
import { UseDark } from '@vueuse/components'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import BaseIcon from '@/components/BaseIcon.vue'
import { useGlobalStore } from '@/stores/globalStore'

function resetStruct() {
  const store = useGlobalStore()
  store.root = null
  localStorage.removeItem('lastRoot')
}

function exportStruct() {
  const element = document.getElementById('root-element') as HTMLElement
  html2canvas(element).then((canvas) => {
    let format = 'p' as 'p' | 'l'
    if (canvas.width > canvas.height) format = 'l'
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF(format, 'px', [canvas.width, canvas.height])
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height, '', 'FAST', 0)
    pdf.save(`struktogramm-${new Date().toLocaleDateString().replace(/\./g, '-')}.pdf`)
  })
}
</script>
<style scoped>
.actions-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.25rem;
}
</style>
