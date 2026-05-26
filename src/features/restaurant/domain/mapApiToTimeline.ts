import type { ApiTable } from './restaurant.types'
import type { TableInfo, TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { getOrderTitle } from '@/shared/constants'
import { isoToCalendarDate, isoToMinutesFromMidnight } from '@/shared/lib/restaurantTime'

export interface ReservationSearchEntry {
  tableId: string
  name: string
}

/** Индекс имён у забронированных столов за выбранный день для поиска по имени. */
export function buildReservationSearchIndex(
  tables: ApiTable[],
  selectedDay: string,
  timeZone: string,
): ReservationSearchEntry[] {
  const reservationSearchEntries: ReservationSearchEntry[] = []

  for (const table of tables) {
    for (const reservation of table.reservations) {
      const reservationDay = isoToCalendarDate(reservation.seating_time, timeZone)
      if (!reservationDay || reservationDay !== selectedDay)
        continue
      reservationSearchEntries.push({
        tableId: table.id,
        name: reservation.name_for_reservation,
      })
    }
  }

  return reservationSearchEntries
}

/** События таймлайна по столам после фильтра зон/поиска. */
export function buildEventsPerTable(
  tables: ApiTable[],
  selectedDay: string,
  timeZone: string,
): Map<string, TimelineEvent[]> {
  const eventsByTableId = new Map<string, TimelineEvent[]>()

  for (const table of tables) {
    const events: TimelineEvent[] = []

    for (const order of table.orders) {
      const orderDay = isoToCalendarDate(order.start_time, timeZone)
      const startMinutes = isoToMinutesFromMidnight(order.start_time, timeZone)
      const endMinutes = isoToMinutesFromMidnight(order.end_time, timeZone)
      if (!orderDay || orderDay !== selectedDay || startMinutes == null || endMinutes == null)
        continue
      events.push({
        id: order.id,
        tableId: table.id,
        kind: 'order',
        status: order.status,
        startMinutes,
        endMinutes,
        title: getOrderTitle(order.status),
      })
    }

    for (const reservation of table.reservations) {
      const reservationDay = isoToCalendarDate(reservation.seating_time, timeZone)
      if (!reservationDay || reservationDay !== selectedDay)
        continue
      const startMinutes = isoToMinutesFromMidnight(reservation.seating_time, timeZone)
      const endMinutes = isoToMinutesFromMidnight(reservation.end_time, timeZone)
      if (startMinutes == null || endMinutes == null)
        continue
      events.push({
        id: String(reservation.id),
        tableId: table.id,
        kind: 'reservation',
        status: reservation.status,
        startMinutes,
        endMinutes,
        name: reservation.name_for_reservation,
        phone: reservation.phone_number,
        guests: reservation.num_people,
        cancelled: reservation.status === 'Отменен',
      })
    }

    eventsByTableId.set(table.id, events)
  }

  return eventsByTableId
}

/** Краткая информация о столе для таблицы. */
export function toTableInfo(table: ApiTable): TableInfo {
  return {
    id: table.id,
    number: table.number,
    zone: table.zone,
    capacity: table.capacity,
  }
}
