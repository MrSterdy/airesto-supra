import type { MaybeRefOrGetter } from 'vue'
import { useNow } from '@vueuse/core'
import { computed, toValue } from 'vue'
import { getMinutesFromMidnight } from '@/shared/lib/restaurantTime'

export function useCurrentTime(
  startMinutes: MaybeRefOrGetter<number>,
  endMinutes: MaybeRefOrGetter<number>,
  minutesToPx: (minutes: number) => number,
  timeZone: MaybeRefOrGetter<string>,
  selectedDay: MaybeRefOrGetter<string>,
  currentDay: MaybeRefOrGetter<string>,
) {
  const now = useNow({ interval: 60_000 })

  const currentTimePosition = computed(() => {
    if (toValue(selectedDay) !== toValue(currentDay))
      return -1

    const totalMinutes = getMinutesFromMidnight(now.value, toValue(timeZone))
    if (totalMinutes == null)
      return -1

    const shiftStart = toValue(startMinutes)
    const shiftEnd = toValue(endMinutes)

    if (totalMinutes < shiftStart || totalMinutes > shiftEnd)
      return -1

    return minutesToPx(totalMinutes)
  })

  return { currentTimePosition }
}
