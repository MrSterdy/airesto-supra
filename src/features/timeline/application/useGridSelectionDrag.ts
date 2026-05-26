import type { useGridCoordinates } from './useGridCoordinates'
import type { useSelectionConfirm } from './useSelectionConfirm'
import type { GridMetrics, SelectionState, TableListRef } from '@/features/timeline/domain/timeline.types'
import { computed, ref } from 'vue'
import {
  computeNormalizedSelection,
  computeSelectionCapacity,
  computeSelectionDimensions,
  computeSelectionStyle,
  computeSelectionTimeRange,
  formatDurationRussian,
} from '@/features/timeline/domain/selectionMetrics'
import { defaultOnBookingConfirm } from './useSelectionConfirm'

type GridCoordinates = ReturnType<typeof useGridCoordinates>

/**
 * Drag ЛКМ по сетке: выделение диапазона столов, подтверждение брони.
 */
export function useGridSelectionDrag(
  filteredTables: TableListRef,
  shiftStartMinutes: number,
  coordinates: GridCoordinates,
  confirm: ReturnType<typeof useSelectionConfirm>,
  resolvedMetrics: GridMetrics,
) {
  const isDragging = ref(false)
  const currentSelection = ref<SelectionState | null>(null)

  const normalizedSelection = computed(() => {
    if (!currentSelection.value)
      return null
    return computeNormalizedSelection(currentSelection.value)
  })

  const selectionDimensions = computed(() => {
    if (!normalizedSelection.value)
      return null
    return computeSelectionDimensions(
      normalizedSelection.value,
      resolvedMetrics.columnWidth.value,
      resolvedMetrics.quarterHeight.value,
    )
  })

  const selectionStyle = computed(() => {
    if (!normalizedSelection.value || !selectionDimensions.value)
      return null
    return computeSelectionStyle(
      normalizedSelection.value,
      selectionDimensions.value,
      resolvedMetrics.timeColWidth.value,
      resolvedMetrics.columnWidth.value,
      resolvedMetrics.headerHeight.value,
      resolvedMetrics.quarterHeight.value,
    )
  })

  const selectedTables = computed(() => {
    if (!normalizedSelection.value)
      return []
    const { minTableIdx, maxTableIdx } = normalizedSelection.value
    return filteredTables.value.slice(minTableIdx, maxTableIdx + 1)
  })

  const selectionTimeRange = computed(() => {
    if (!normalizedSelection.value)
      return null
    return computeSelectionTimeRange(normalizedSelection.value, shiftStartMinutes)
  })

  const selectionDuration = computed(() => {
    if (!selectionTimeRange.value)
      return ''
    return formatDurationRussian(selectionTimeRange.value)
  })

  const selectionCapacity = computed(() => {
    if (!normalizedSelection.value)
      return 0
    return computeSelectionCapacity(filteredTables.value, normalizedSelection.value)
  })

  confirm.onConfirm(() => {
    if (!selectionTimeRange.value)
      return
    defaultOnBookingConfirm({
      tables: selectedTables.value.map(table => table.id),
      startTime: selectionTimeRange.value.start,
      endTime: selectionTimeRange.value.end,
      capacity: selectionCapacity.value,
    })
    currentSelection.value = null
  })

  confirm.onCancel(() => {
    currentSelection.value = null
  })

  function onGridMouseDown(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0)
      return false

    mouseEvent.preventDefault()

    if (confirm.selectionConfirmed.value) {
      confirm.cancelSelection()
      currentSelection.value = null
      return true
    }

    const gridBodyElement = coordinates.getGridBody()
    if (!gridBodyElement)
      return false

    const tableIndex = coordinates.getTableIndexFromClientX(mouseEvent.clientX)
    const quarterIndex = coordinates.getQuarterIndexFromClientY(
      mouseEvent.clientY,
      gridBodyElement,
      'floor',
      'drag',
    )

    isDragging.value = true
    currentSelection.value = {
      startTableIdx: tableIndex,
      endTableIdx: tableIndex,
      startQuarter: quarterIndex,
      endQuarter: quarterIndex,
    }
    return true
  }

  function updateSelectionFromEvent(mouseEvent: MouseEvent) {
    const gridBodyElement = coordinates.getGridBody()
    if (!gridBodyElement || !isDragging.value || !currentSelection.value)
      return

    currentSelection.value.endTableIdx = coordinates.getTableIndexFromClientX(mouseEvent.clientX)
    currentSelection.value.endQuarter = coordinates.getQuarterIndexFromClientY(
      mouseEvent.clientY,
      gridBodyElement,
      'round',
      'drag',
    )
  }

  function onGridMouseUp(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0)
      return

    if (!isDragging.value || !currentSelection.value)
      return

    isDragging.value = false

    const selection = currentSelection.value
    const startQuarterIndex = Math.min(selection.startQuarter, selection.endQuarter)
    const endQuarterIndex = Math.max(selection.startQuarter, selection.endQuarter)

    if (startQuarterIndex === endQuarterIndex) {
      currentSelection.value = null
      return
    }

    currentSelection.value.startQuarter = startQuarterIndex
    currentSelection.value.endQuarter = endQuarterIndex
    currentSelection.value.startTableIdx = Math.min(selection.startTableIdx, selection.endTableIdx)
    currentSelection.value.endTableIdx = Math.max(selection.startTableIdx, selection.endTableIdx)

    confirm.selectionConfirmed.value = true
  }

  function clearSelection() {
    isDragging.value = false
    confirm.cancelSelection()
  }

  return {
    isDragging,
    selection: currentSelection,
    selectionConfirmed: confirm.selectionConfirmed,
    normalizedSelection,
    selectionDimensions,
    selectionStyle,
    selectedTables,
    selectionTimeRange,
    selectionDuration,
    selectionCapacity,
    onGridMouseDown,
    updateSelectionFromEvent,
    onGridMouseUp,
    confirmSelection: confirm.confirmSelection,
    cancelSelection: confirm.cancelSelection,
    clearSelection,
  }
}
