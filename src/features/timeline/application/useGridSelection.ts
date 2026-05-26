import type { ComputedRef, MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import type { TableInfo } from '@/features/timeline/domain/timeline.types'
import { computed, toValue } from 'vue'
import { useCoalescedPointerMove } from './useCoalescedPointerMove'
import { useGridCoordinates } from './useGridCoordinates'
import { useGridEdgeScroll } from './useGridEdgeScroll'
import { useGridHover } from './useGridHover'
import { useGridPanning } from './useGridPanning'
import { useGridSelectionDrag } from './useGridSelectionDrag'
import { useSelectionConfirm } from './useSelectionConfirm'

/**
 * Выделение диапазона столов и времени на таблице.
 * Фасад: pan (СКМ), hover, drag ЛКМ + подтверждение.
 */
export function useGridSelection(
  gridContainer: Ref<HTMLElement | null>,
  gridBody: MaybeRefOrGetter<HTMLElement | null>,
  scrollElement: Ref<HTMLElement | null>,
  filteredTables: ComputedRef<TableInfo[]> | import('vue').Ref<TableInfo[]>,
  quarterHeight: MaybeRef<number>,
  totalQuarters: ComputedRef<number>,
  startMinutes: number,
  columnWidth: MaybeRef<number>,
  timeColWidth: MaybeRef<number>,
  headerHeight: MaybeRef<number>,
) {
  const resolvedColumnWidth = computed(() => toValue(columnWidth))
  const resolvedQuarterHeight = computed(() => toValue(quarterHeight))
  const resolvedTimeColWidth = computed(() => toValue(timeColWidth))
  const resolvedHeaderHeight = computed(() => toValue(headerHeight))

  const coordinates = useGridCoordinates(
    gridContainer,
    gridBody,
    filteredTables,
    quarterHeight,
    totalQuarters,
    columnWidth,
    timeColWidth,
  )

  const panning = useGridPanning(gridContainer, scrollElement)
  const hover = useGridHover(gridContainer, coordinates)
  const confirm = useSelectionConfirm()
  const drag = useGridSelectionDrag(
    filteredTables,
    startMinutes,
    coordinates,
    confirm,
    {
      columnWidth: resolvedColumnWidth,
      quarterHeight: resolvedQuarterHeight,
      timeColWidth: resolvedTimeColWidth,
      headerHeight: resolvedHeaderHeight,
    },
  )
  const edgeScroll = useGridEdgeScroll(scrollElement)

  function processMouseMove(mouseEvent: MouseEvent) {
    if (panning.isPanning.value)
      return

    hover.updateHoverFromEvent(mouseEvent)
    drag.updateSelectionFromEvent(mouseEvent)
    edgeScroll.updateEdgeScroll(mouseEvent.clientX, mouseEvent.clientY, drag.isDragging.value)
  }

  const { onPointerMove } = useCoalescedPointerMove(processMouseMove)

  function onGridMouseDown(mouseEvent: MouseEvent) {
    if (panning.startPanningFromMouseDown(mouseEvent))
      return
    drag.onGridMouseDown(mouseEvent)
  }

  function onGridMouseUp(mouseEvent: MouseEvent) {
    edgeScroll.stopEdgeScroll()
    drag.onGridMouseUp(mouseEvent)
  }

  function isHoverActive(): boolean {
    if (drag.isDragging.value || drag.selectionConfirmed.value)
      return false
    return hover.hoverTableIdx.value >= 0 && hover.hoverQuarter.value >= 0
  }

  return {
    isDragging: drag.isDragging,
    selection: drag.selection,
    selectionConfirmed: drag.selectionConfirmed,
    hoverTableIdx: hover.hoverTableIdx,
    hoverQuarter: hover.hoverQuarter,
    normalizedSelection: drag.normalizedSelection,
    selectionDimensions: drag.selectionDimensions,
    selectionStyle: drag.selectionStyle,
    selectedTables: drag.selectedTables,
    selectionTimeRange: drag.selectionTimeRange,
    selectionDuration: drag.selectionDuration,
    selectionCapacity: drag.selectionCapacity,
    onGridMouseDown,
    onGridMouseMove: onPointerMove,
    onGridMouseUp,
    confirmSelection: drag.confirmSelection,
    cancelSelection: drag.cancelSelection,
    clearSelection: drag.clearSelection,
    isHoverActive,
  }
}
