import type { MaybeRefOrGetter } from 'vue'
import { useNow } from '@vueuse/core'
import { computed, toValue } from 'vue'

export function useCurrentTime(
  startMinutes: MaybeRefOrGetter<number>,
  endMinutes: MaybeRefOrGetter<number>,
  minutesToPx: (minutes: number) => number,
) {
  const now = useNow({ interval: 60_000 })

  const currentTimePosition = computed(() => {
    const shiftStart = toValue(startMinutes)
    const shiftEnd = toValue(endMinutes)
    const hours = now.value.getHours()
    const minutes = now.value.getMinutes()
    const totalMinutes = hours * 60 + minutes

    if (totalMinutes < shiftStart || totalMinutes > shiftEnd)
      return -1

    return minutesToPx(totalMinutes)
  })

  return { currentTimePosition }
}
