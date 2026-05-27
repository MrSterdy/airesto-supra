import type { MaybeRefOrGetter } from 'vue'
import type { TableListRef, TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { computed, ref, toValue } from 'vue'
import { buildEventDetailsViewModel } from '@/features/timeline/domain/eventDetails'

/**
 * Просмотр существующего события.
 */
export function useEventDetails(
  filteredTables: TableListRef,
  selectedDay: MaybeRefOrGetter<string>,
  clearSelection: () => void,
) {
  const selectedEvent = ref<TimelineEvent | null>(null)

  const isOpen = computed(() => selectedEvent.value !== null)

  const details = computed(() => {
    const event = selectedEvent.value
    if (!event)
      return null

    const table = filteredTables.value.find(candidate => candidate.id === event.tableId)
    if (!table)
      return null

    return buildEventDetailsViewModel(event, table, toValue(selectedDay))
  })

  function openEvent(event: TimelineEvent) {
    clearSelection()
    selectedEvent.value = event
  }

  function closeEvent() {
    selectedEvent.value = null
  }

  return {
    isOpen,
    details,
    openEvent,
    closeEvent,
  }
}
