import type { ApiResponse } from '@/features/restaurant/domain/restaurant.types'
import type { TableInfo } from '@/features/timeline/domain/timeline.types'
import { createSharedComposable } from '@vueuse/core'
import { computed, ref } from 'vue'
import { buildPreferencesContext, useUiPreferences } from '@/core/preferences'
import { mockData } from '@/data/mock'
import {
  buildEventsPerTable,
  buildReservationSearchIndex,
  toTableInfo,
} from '@/features/restaurant/domain/mapApiToTimeline'
import { initUiPreferencesFromData } from './initUiPreferencesFromData'
import { useRestaurantSearch } from './useRestaurantSearch'

function createRestaurantDataState(data: ApiResponse) {
  const restaurant = data.restaurant
  const availableDays = data.available_days
  const currentDay = data.current_day

  const zones = computed(() => buildPreferencesContext(data).zones)

  const { selectedDay, selectedZones } = useUiPreferences()
  const searchQuery = ref('')

  const reservationSearchIndex = computed(() =>
    buildReservationSearchIndex(data.tables, selectedDay.value, restaurant.timezone),
  )

  const { tableIdsMatchingSearch } = useRestaurantSearch(reservationSearchIndex, searchQuery)

  /** Столы после фильтра зон и поиска по имени. */
  const visibleTables = computed(() => {
    let tables = data.tables
    if (selectedZones.value.length > 0) {
      const zoneFilter = new Set(selectedZones.value)
      tables = tables.filter(table => zoneFilter.has(table.zone))
    }
    if (tableIdsMatchingSearch.value) {
      tables = tables.filter(table => tableIdsMatchingSearch.value!.has(table.id))
    }
    return tables
  })

  const filteredTables = computed<TableInfo[]>(() =>
    visibleTables.value.map(toTableInfo),
  )

  const eventsPerTable = computed(() =>
    buildEventsPerTable(visibleTables.value, selectedDay.value, restaurant.timezone),
  )

  return {
    restaurant,
    availableDays,
    currentDay,
    selectedDay,
    selectedZones,
    searchQuery,
    zones,
    filteredTables,
    eventsPerTable,
  }
}

const useRestaurantDataState = createSharedComposable(() => {
  initUiPreferencesFromData(mockData)
  return createRestaurantDataState(mockData)
})

export function useRestaurantData() {
  return useRestaurantDataState()
}
