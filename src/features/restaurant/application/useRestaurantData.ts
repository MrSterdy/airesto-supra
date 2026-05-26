import type { TableInfo } from '@/features/timeline/domain/timeline.types'
import { createSharedComposable, refDebounced } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { computed, ref } from 'vue'
import { mockData } from '@/data/mock'
import {
  buildEventsPerTable,
  buildReservationSearchIndex,
  toTableInfo,
} from '@/features/restaurant/domain/mapApiToTimeline'
import { useUiPreferences } from './useUiPreferences'

const useRestaurantDataState = createSharedComposable(() => {
  const data = mockData
  const restaurant = data.restaurant
  const availableDays = data.available_days
  const currentDay = data.current_day

  const zones = computed(() => {
    const zoneSet = new Set<string>()
    for (const table of data.tables) {
      zoneSet.add(table.zone)
    }
    return Array.from(zoneSet)
  })

  const { selectedDay, selectedZones } = useUiPreferences()
  const searchQuery = ref('')
  const debouncedSearchQuery = refDebounced(searchQuery, 200)

  const reservationSearchIndex = computed(() =>
    buildReservationSearchIndex(data.tables, selectedDay.value, restaurant.timezone),
  )

  const { results: fuseResults } = useFuse(
    debouncedSearchQuery,
    reservationSearchIndex,
    {
      fuseOptions: {
        keys: ['name'],
        threshold: 0.35,
        ignoreLocation: true,
      },
      matchAllWhenSearchEmpty: true,
    },
  )

  /** null = поиск пустой, показываем все столы после фильтра зон. */
  const tableIdsMatchingSearch = computed(() => {
    const query = debouncedSearchQuery.value.trim()
    if (!query)
      return null
    return new Set(fuseResults.value.map(result => result.item.tableId))
  })

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
})

export function useRestaurantData() {
  return useRestaurantDataState()
}
