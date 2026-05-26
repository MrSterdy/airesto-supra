import { useNow } from '@vueuse/core'
import { computed } from 'vue'

export function useCurrentTime(startMinutes: number, endMinutes: number, minutesToPx: (min: number) => number) {
  const now = useNow({ interval: 60_000 })

  const currentTimePosition = computed(() => {
    const h = now.value.getHours()
    const m = now.value.getMinutes()
    const totalMin = h * 60 + m
    if (totalMin < startMinutes || totalMin > endMinutes)
      return -1
    return minutesToPx(totalMin)
  })

  return { currentTimePosition }
}
