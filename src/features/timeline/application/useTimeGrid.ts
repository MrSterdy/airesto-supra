import type { MaybeRef } from 'vue'
import { computed, toRef } from 'vue'
import {
  buildTimeSlots,
  formatTimeSlotLabel,
  minutesFromTime,
} from '@/features/timeline/domain/timeGrid'

/** Временная сетка: слоты, высоты и перевод минут в пиксели. */
export function useTimeGrid(openingTime: string, closingTime: string, slotHeight: MaybeRef<number>) {
  const startMinutes = minutesFromTime(openingTime)
  const endMinutes = minutesFromTime(closingTime)

  const resolvedSlotHeight = toRef(slotHeight)

  const timeSlots = computed(() => buildTimeSlots(openingTime, closingTime))

  const gridHeight = computed(() => (timeSlots.value.length - 1) * resolvedSlotHeight.value)

  const quarterHeight = computed(() => resolvedSlotHeight.value / 2)
  const totalQuarters = computed(() => (timeSlots.value.length - 1) * 2)

  function minutesToPx(minutes: number): number {
    return ((minutes - startMinutes) / 30) * resolvedSlotHeight.value
  }

  return {
    startMinutes,
    endMinutes,
    timeSlots,
    gridHeight,
    quarterHeight,
    totalQuarters,
    minutesToPx,
    formatTimeSlot: formatTimeSlotLabel,
    slotHeight: resolvedSlotHeight,
  }
}
