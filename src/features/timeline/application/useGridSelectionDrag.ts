import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { SelectionState, TableInfo } from '@/features/timeline/domain/timeline.types'
import { useConfirmDialog } from '@vueuse/core'
import { computed, ref, shallowRef, toValue } from 'vue'
import {
  computeNormalizedSelection,
  computeSelectionCapacity,
  computeSelectionDimensions,
  computeSelectionStyle,
  computeSelectionTimeRange,
  formatDurationRussian,
} from '@/features/timeline/domain/selectionMetrics'

type QuarterSnapMode = 'floor' | 'round'

/**
 * Drag ЛКМ по сетке: выделение диапазона столов, подтверждение брони.
 */
export function useGridSelectionDrag(
  filteredTables: ComputedRef<TableInfo[]> | Ref<TableInfo[]>,
  quarterHeightPx: MaybeRef<number>,
  totalQuarters: ComputedRef<number>,
  shiftStartMinutes: number,
  columnWidthPx: MaybeRef<number>,
  timeColumnWidthPx: MaybeRef<number>,
  headerHeightPx: MaybeRef<number>,
  getTableIndexFromClientX: (clientX: number) => number,
  getGridBody: () => HTMLElement | null,
) {
  const resolvedQuarterHeight = computed(() => toValue(quarterHeightPx))
  const resolvedColumnWidth = computed(() => toValue(columnWidthPx))
  const resolvedTimeColWidth = computed(() => toValue(timeColumnWidthPx))
  const resolvedHeaderHeight = computed(() => toValue(headerHeightPx))

  const isDragging = ref(false)
  const currentSelection = ref<SelectionState | null>(null)
  const selectionConfirmed = shallowRef(false)

  const {
    confirm: confirmDialog,
    cancel: cancelDialog,
    onConfirm,
    onCancel,
  } = useConfirmDialog(selectionConfirmed)

  function getQuarterIndexFromClientY(
    clientY: number,
    gridBodyElement: HTMLElement,
    snapMode: QuarterSnapMode = 'round',
  ): number {
    const rect = gridBodyElement.getBoundingClientRect()
    const offsetFromBodyTop = clientY - rect.top
    const quarterHeight = resolvedQuarterHeight.value
    const quarterIndex = snapMode === 'floor'
      ? Math.floor(offsetFromBodyTop / quarterHeight)
      : Math.round(offsetFromBodyTop / quarterHeight)
    return Math.max(0, Math.min(quarterIndex, totalQuarters.value))
  }

  function onGridMouseDown(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0)
      return false

    mouseEvent.preventDefault()

    if (selectionConfirmed.value) {
      cancelDialog()
      currentSelection.value = null
      return true
    }

    const gridBodyElement = (mouseEvent.currentTarget as HTMLElement).querySelector('[data-grid-body]') as HTMLElement
    if (!gridBodyElement)
      return false

    const tableIndex = getTableIndexFromClientX(mouseEvent.clientX)
    const quarterIndex = getQuarterIndexFromClientY(mouseEvent.clientY, gridBodyElement, 'floor')

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
    const gridBodyElement = getGridBody()
    if (!gridBodyElement || !isDragging.value || !currentSelection.value)
      return

    currentSelection.value.endTableIdx = getTableIndexFromClientX(mouseEvent.clientX)
    currentSelection.value.endQuarter = getQuarterIndexFromClientY(mouseEvent.clientY, gridBodyElement)
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

    selectionConfirmed.value = true
  }

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
      resolvedColumnWidth.value,
      resolvedQuarterHeight.value,
    )
  })

  const selectionStyle = computed(() => {
    if (!normalizedSelection.value || !selectionDimensions.value)
      return null
    return computeSelectionStyle(
      normalizedSelection.value,
      selectionDimensions.value,
      resolvedTimeColWidth.value,
      resolvedColumnWidth.value,
      resolvedHeaderHeight.value,
      resolvedQuarterHeight.value,
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

  onConfirm(() => {
    if (!selectionTimeRange.value)
      return
    // eslint-disable-next-line no-console -- demo booking action
    console.log('Создать бронирование:', {
      tables: selectedTables.value.map(table => table.id),
      startTime: selectionTimeRange.value.start,
      endTime: selectionTimeRange.value.end,
      capacity: selectionCapacity.value,
    })
    currentSelection.value = null
  })

  onCancel(() => {
    currentSelection.value = null
  })

  function confirmSelection() {
    confirmDialog()
  }

  function cancelSelection() {
    cancelDialog()
  }

  function clearSelection() {
    isDragging.value = false
    cancelSelection()
  }

  return {
    isDragging,
    selection: currentSelection,
    selectionConfirmed,
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
    confirmSelection,
    cancelSelection,
    clearSelection,
  }
}
