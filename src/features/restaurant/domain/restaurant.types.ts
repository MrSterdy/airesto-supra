export interface Restaurant {
  id: number
  timezone: string
  restaurant_name: string
  opening_time: string
  closing_time: string
}

export interface ApiOrder {
  id: string
  status: string
  start_time: string
  end_time: string
}

export interface ApiReservation {
  id: number
  name_for_reservation: string
  phone_number: string
  num_people: number
  status: string
  seating_time: string
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
  current_day: string
  available_days: string[]
  restaurant: Restaurant
  tables: ApiTable[]
}
