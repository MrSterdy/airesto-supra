import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { LayoutEvent, TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { useMemoize } from '@vueuse/core'
import { computed, toValue } from 'vue'
import { layoutEventsForTable } from '@/features/timeline/domain/booking-layout'

function eventsSignature(events: TimelineEvent[]): string {
  if (!events.length)
    return ''
  return events.map(event => `${event.id}:${event.startMinutes}:${event.endMinutes}`).join('|')
}

/** Раскладка броней по столбцу с мемоизацией при zoom и смене событий. */
export function useBookingLayout(
  eventsPerTable: ComputedRef<Map<string, TimelineEvent[]>> | Ref<Map<string, TimelineEvent[]>>,
  minutesToPx: (minutes: number) => number,
  columnWidth: MaybeRef<number>,
  indent: MaybeRef<number>,
  slotHeight: MaybeRef<number>,
) {
  const layoutMetrics = computed(() => ({
    columnWidth: toValue(columnWidth),
    indent: toValue(indent),
    slotHeight: toValue(slotHeight),
  }))

  const layoutEventsForTableMemo = useMemoize(
    (
      _cacheKey: string,
      events: TimelineEvent[],
      columnWidthPx: number,
      indentPx: number,
    ) => layoutEventsForTable(events, minutesToPx, columnWidthPx, indentPx),
    { getKey: cacheKey => cacheKey },
  )

  function getTableLayout(tableId: string): LayoutEvent[] {
    const events = eventsPerTable.value.get(tableId) ?? []
    const { columnWidth: columnWidthPx, indent: indentPx, slotHeight: slotHeightPx } = layoutMetrics.value
    const cacheKey = `${tableId}:${columnWidthPx}:${indentPx}:${slotHeightPx}:${eventsSignature(events)}`
    return layoutEventsForTableMemo(
      cacheKey,
      events,
      columnWidthPx,
      indentPx,
    )
  }

  /** Меняется при zoom для :key у TableColumn. */
  const layoutVersion = computed(
    () => `${layoutMetrics.value.columnWidth}:${layoutMetrics.value.indent}:${layoutMetrics.value.slotHeight}`,
  )

  return { getTableLayout, layoutVersion }
}
