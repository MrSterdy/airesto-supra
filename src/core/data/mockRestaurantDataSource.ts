import type { RestaurantDataSource } from './restaurantDataSource'
import { mockData } from '@/data/mock'

export const mockRestaurantDataSource: RestaurantDataSource = {
  load: () => Promise.resolve(mockData),
}
