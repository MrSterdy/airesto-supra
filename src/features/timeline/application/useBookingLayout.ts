import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { LayoutEvent, TableInfo, TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { useMemoize } from '@vueuse/core'
import { computed, toValue } from 'vue'
import { layoutEventsForTable } from '@/features/timeline/domain/bookingLayout'

export function useBookingLayout(
  filteredTables: ComputedRef<TableInfo[]> | Ref<TableInfo[]>,
  eventsPerTable: ComputedRef<Map<string, TimelineEvent[]>>,
  minutesToPx: (minutes: number) => number,
  columnWidth: MaybeRef<number>,
  indent: MaybeRef<number>,
) {
  const resolvedColumnWidth = computed(() => toValue(columnWidth))
  const resolvedIndent = computed(() => toValue(indent))

  const layoutEventsForTableMemo = useMemoize(
    (
      _tableId: string,
      columnWidthPx: number,
      indentPx: number,
      events: TimelineEvent[],
    ) => layoutEventsForTable(events, minutesToPx, columnWidthPx, indentPx),
  )

  const tableLayouts = computed(() => {
    const layoutsByTableId = new Map<string, LayoutEvent[]>()
    const columnWidthPx = resolvedColumnWidth.value
    const indentPx = resolvedIndent.value
    const eventsMap = eventsPerTable.value

    for (const table of filteredTables.value) {
      const events = eventsMap.get(table.id) ?? []
      layoutsByTableId.set(
        table.id,
        layoutEventsForTableMemo(table.id, columnWidthPx, indentPx, events),
      )
    }
    return layoutsByTableId
  })

  return { tableLayouts }
}
