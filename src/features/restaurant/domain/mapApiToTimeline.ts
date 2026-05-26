import type { ApiTable } from './restaurant.types'
import type { TableInfo, TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { getOrderTitle } from '@/shared/constants'

/** Преобразование ISO datetime в минуты от полуночи. */
export function isoToMinutes(iso: string): number {
  const match = iso.match(/T(\d{2}):(\d{2})/)
  if (!match)
    return 0
  return Number(match[1]) * 60 + Number(match[2])
}

export function isoToDate(iso: string): string {
  return iso.slice(0, 10)
}

export interface ReservationSearchEntry {
  tableId: string
  name: string
}

/** Индекс имён у забронированных столов за выбранный день для поиска по имени. */
export function buildReservationSearchIndex(
  tables: ApiTable[],
  selectedDay: string,
): ReservationSearchEntry[] {
  const reservationSearchEntries: ReservationSearchEntry[] = []

  for (const table of tables) {
    for (const reservation of table.reservations) {
      if (isoToDate(reservation.seating_time) !== selectedDay)
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
): Map<string, TimelineEvent[]> {
  const eventsByTableId = new Map<string, TimelineEvent[]>()

  for (const table of tables) {
    const events: TimelineEvent[] = []

    for (const order of table.orders) {
      if (isoToDate(order.start_time) !== selectedDay)
        continue
      events.push({
        id: order.id,
        tableId: table.id,
        kind: 'order',
        status: order.status,
        startMinutes: isoToMinutes(order.start_time),
        endMinutes: isoToMinutes(order.end_time),
        title: getOrderTitle(order.status),
      })
    }

    for (const reservation of table.reservations) {
      if (isoToDate(reservation.seating_time) !== selectedDay)
        continue
      events.push({
        id: String(reservation.id),
        tableId: table.id,
        kind: 'reservation',
        status: reservation.status,
        startMinutes: isoToMinutes(reservation.seating_time),
        endMinutes: isoToMinutes(reservation.end_time),
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
