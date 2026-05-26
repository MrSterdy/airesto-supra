import type { MaybeRefOrGetter } from 'vue'
import type { ReservationSearchEntry } from '@/features/restaurant/domain/mapApiToTimeline'
import { refDebounced } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { computed, toRef } from 'vue'

export type { ReservationSearchEntry as ReservationSearchItem }

/**
 * Поиск столов по имени с debounce.
 */
export function useRestaurantSearch(
  searchIndex: MaybeRefOrGetter<ReservationSearchEntry[]>,
  searchQuery: MaybeRefOrGetter<string>,
  debounceMs = 200,
) {
  const queryRef = toRef(searchQuery)
  const debouncedSearchQuery = refDebounced(queryRef, debounceMs)

  const { results: fuseResults } = useFuse(
    debouncedSearchQuery,
    searchIndex,
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

  return { debouncedSearchQuery, tableIdsMatchingSearch }
}
