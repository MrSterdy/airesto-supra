import type { OrderStatus, ReservationStatus } from '@/shared/constants'

/** Метаданные ресторана из API. */
export interface Restaurant {
  id: number
  /** IANA timezone, например Europe/Moscow */
  timezone: string
  restaurant_name: string
  /** Время открытия смены, ЧЧ:ММ */
  opening_time: string
  /** Время закрытия смены, ЧЧ:ММ */
  closing_time: string
}

export interface ApiOrder {
  id: string
  status: OrderStatus | string
  /** ISO 8601 */
  start_time: string
  /** ISO 8601 */
  end_time: string
}

export interface ApiReservation {
  id: number
  name_for_reservation: string
  phone_number: string
  num_people: number
  status: ReservationStatus | string
  /** ISO 8601 */
  seating_time: string
  /** ISO 8601 */
  end_time: string
}

export interface ApiTable {
  id: string
  number: string
  zone: string
  capacity: number
  orders: ApiOrder[]
  reservations: ApiReservation[]
}

export interface ApiResponse {
  /** Календарный день YYYY-MM-DD */
  current_day: string
  available_days: string[]
  restaurant: Restaurant
  tables: ApiTable[]
}
