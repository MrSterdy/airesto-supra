import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'
import {
  buildTimeSlots,
  formatTimeSlotLabel,
  minutesFromTime,
  quarterToTime,
} from '@/features/timeline/domain/timeGrid'

export function useTimeGrid(openingTime: string, closingTime: string, slotHeight: MaybeRef<number>) {
  const startMinutes = minutesFromTime(openingTime)
  const endMinutes = minutesFromTime(closingTime)

  const resolvedSlotHeight = computed(() => toValue(slotHeight))

  const timeSlots = computed(() => buildTimeSlots(openingTime, closingTime))

  const gridHeight = computed(() => (timeSlots.value.length - 1) * resolvedSlotHeight.value)

  const quarterHeight = computed(() => resolvedSlotHeight.value / 2)
  const totalQuarters = computed(() => (timeSlots.value.length - 1) * 2)

  function minutesToPx(minutes: number): number {
    return ((minutes - startMinutes) / 30) * resolvedSlotHeight.value
  }

  function formatTimeSlot(slot: string): string {
    return formatTimeSlotLabel(slot)
  }

  function quarterToTimeForShift(quarterIndex: number): string {
    return quarterToTime(startMinutes, quarterIndex)
  }

  return {
    startMinutes,
    endMinutes,
    timeSlots,
    gridHeight,
    quarterHeight,
    totalQuarters,
    minutesToPx,
    formatTimeSlot,
    quarterToTime: quarterToTimeForShift,
    minutesFromTime,
    slotHeight: resolvedSlotHeight,
  }
}
