export function minutesFromTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}:${String(minutes).padStart(2, '0')}`
}

/**
 * Переводит индекс 15‑минутного слота в время ЧЧ:ММ от начала смены.
 * @param shiftStartMinutes - минуты от полуночи (время открытия смены)
 * @param quarterIndex - индекс слота (0 - первый интервал после открытия)
 */
export function quarterToTime(shiftStartMinutes: number, quarterIndex: number): string {
  const totalMinutes = shiftStartMinutes + quarterIndex * 15
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}:${String(minutes).padStart(2, '0')}`
}

/** Метки слотов таблицы (каждые 30 мин) между открытием и закрытием. */
export function buildTimeSlots(openingTime: string, closingTime: string): string[] {
  const startMinutes = minutesFromTime(openingTime)
  const endMinutes = minutesFromTime(closingTime)
  const slots: string[] = []
  const startHour = Math.floor(startMinutes / 60)
  const endHour = Math.ceil(endMinutes / 60)

  for (let hour = startHour; hour <= endHour; hour++) {
    if (hour === 24) {
      slots.push('00:00')
    }
    else {
      slots.push(`${hour}:00`)
      slots.push(`${hour}:30`)
    }
  }

  return slots
}

/** Форматирование метки слота для отображения в столбце времени. */
export function formatTimeSlotLabel(slot: string): string {
  const [hours, minutes] = slot.split(':')
  return `${hours}:${minutes.padStart(2, '0')}`
}
