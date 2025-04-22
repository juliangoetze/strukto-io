import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue'

import { Node } from '@/types/nodes'

type News = {
  headline: string
  story: string
  date: Date
}

export const useGlobalStore = defineStore('globalStore', () => {
  const root: Ref<Node | null> = ref(null)
  const activeDragging = false
  const activeEditing = ref(false)
  const mouseOverElementId = ''
  const draggingElementId = ''
  const lastDroppedParentId = ''

  const news: News[] = [
    {
      headline: '💽 🎉 Bessere Speicherung',
      story:
        'Dein Struktogramm wird nun persistent gespeichert, sodass beim Neuladen des Browsers keine Daten verloren gehen.',
      date: new Date('2024-03-20'),
    },
    {
      headline: '🪲👋  Verschieben repariert',
      story: 'Durch ein Update war das verschieben von Elementen nicht mehr möglich. Dieser Fehler wurde behoben.',
      date: new Date('2024-04-12'),
    },
    {
      headline: '🎆  Export repariert',
      story: 'Durch ein Package-Update hat der Export oft die Struktogramme abgeschnitten. Danke an den Hinweis!',
      date: new Date('2024-04-24'),
    },
    {
      headline: '💬  Text-Selektierung ermöglicht',
      story:
        'Nun kann der Text in einem Input-Feld auch selektiert werden, ohne, dass das Struktogramm verschoben wird. Danke für die Meldung!',
      date: new Date('2024-04-25'),
    },
  ]

  const getNews = computed(() => {
    return news.filter((n) => {
      const today = new Date()
      const threeDaysAgo = new Date(today.setDate(today.getDate() - 5))
      return n.date > threeDaysAgo
    })
  })

  return {
    activeDragging,
    mouseOverElementId,
    draggingElementId,
    lastDroppedParentId,
    root,
    getNews,
    news,
    activeEditing,
  }
})
