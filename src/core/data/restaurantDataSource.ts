import type { ApiResponse } from '@/features/restaurant/domain/restaurant.types'

/** Порт загрузки данных ресторана (mock или API). */
export interface RestaurantDataSource {
  load: () => Promise<ApiResponse>
}
