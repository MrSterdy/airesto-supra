import { computed } from 'vue'
import { SLOT_HEIGHT } from '@/constants'

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function useTimeGrid(openingTime: string, closingTime: string) {
  const startMinutes = timeToMinutes(openingTime)
  const endMinutes = timeToMinutes(closingTime)

  const timeSlots = computed(() => {
    const slots: string[] = []
    const startH = Math.floor(startMinutes / 60)
    const endH = Math.ceil(endMinutes / 60)
    for (let h = startH; h <= endH; h++) {
      if (h === 24) {
        slots.push('00:00')
      }
      else {
        slots.push(`${h}:00`)
        slots.push(`${h}:30`)
      }
    }
    return slots
  })

  const gridHeight = computed(() => (timeSlots.value.length - 1) * SLOT_HEIGHT)

  const quarterHeight = SLOT_HEIGHT / 2
  const totalQuarters = computed(() => (timeSlots.value.length - 1) * 2)

  function minutesToPx(min: number): number {
    return ((min - startMinutes) / 30) * SLOT_HEIGHT
  }

  function formatTimeSlot(slot: string): string {
    const [h, m] = slot.split(':')
    return `${h}:${m.padStart(2, '0')}`
  }

  function quarterToTime(q: number): string {
    const totalMin = startMinutes + q * 15
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    return `${h}:${String(m).padStart(2, '0')}`
  }

  function minutesFromTime(time: string): number {
    return timeToMinutes(time)
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
    quarterToTime,
    minutesFromTime,
  }
}
