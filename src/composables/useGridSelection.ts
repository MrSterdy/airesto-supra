import type { ComputedRef, Ref } from 'vue'
import type { SelectionState, TableInfo } from '@/types'
import { computed, ref } from 'vue'
import { COLUMN_WIDTH } from '@/constants'

export function useGridSelection(
  gridContainer: Ref<HTMLElement | null>,
  filteredTables: ComputedRef<TableInfo[]> | Ref<TableInfo[]>,
  quarterHeight: number,
  totalQuarters: ComputedRef<number>,
  startMinutes: number,
) {
  const isDragging = ref(false)
  const selection = ref<SelectionState | null>(null)
  const selectionConfirmed = ref(false)
  const hoverTableIdx = ref(-1)
  const hoverQuarter = ref(-1)

  function getTableIndexFromX(clientX: number): number {
    if (!gridContainer.value)
      return 0
    const rect = gridContainer.value.getBoundingClientRect()
    const x = clientX - rect.left + gridContainer.value.scrollLeft
    const timeColWidth = 52
    const colIdx = Math.floor((x - timeColWidth) / COLUMN_WIDTH)
    return Math.max(0, Math.min(colIdx, filteredTables.value.length - 1))
  }

  function getQuarterFromY(clientY: number, bodyEl: HTMLElement, snap: 'floor' | 'round' = 'round'): number {
    const rect = bodyEl.getBoundingClientRect()
    const y = clientY - rect.top
    const quarter = snap === 'floor'
      ? Math.floor(y / quarterHeight)
      : Math.round(y / quarterHeight)
    return Math.max(0, Math.min(quarter, totalQuarters.value))
  }

  function getHoverQuarterFromY(clientY: number, bodyEl: HTMLElement): number {
    const rect = bodyEl.getBoundingClientRect()
    const y = clientY - rect.top
    const quarter = Math.floor(y / quarterHeight)
    return Math.max(0, Math.min(quarter, totalQuarters.value - 1))
  }

  function onGridMouseDown(e: MouseEvent) {
    if (selectionConfirmed.value) {
      selectionConfirmed.value = false
      selection.value = null
      return
    }

    const bodyEl = (e.currentTarget as HTMLElement).querySelector('[data-grid-body]') as HTMLElement
    if (!bodyEl)
      return

    const tableIdx = getTableIndexFromX(e.clientX)
    const quarter = getQuarterFromY(e.clientY, bodyEl, 'floor')

    isDragging.value = true
    selectionConfirmed.value = false
    selection.value = {
      startTableIdx: tableIdx,
      endTableIdx: tableIdx,
      startQuarter: quarter,
      endQuarter: quarter,
    }
  }

  function onGridMouseMove(e: MouseEvent) {
    const bodyEl = (gridContainer.value as HTMLElement)?.querySelector('[data-grid-body]') as HTMLElement
    if (!bodyEl)
      return

    hoverTableIdx.value = getTableIndexFromX(e.clientX)
    hoverQuarter.value = getHoverQuarterFromY(e.clientY, bodyEl)

    if (!isDragging.value || !selection.value)
      return

    selection.value.endTableIdx = getTableIndexFromX(e.clientX)
    selection.value.endQuarter = getQuarterFromY(e.clientY, bodyEl)
  }

  function onGridMouseLeave() {
    hoverTableIdx.value = -1
    hoverQuarter.value = -1
  }

  function onGridMouseUp() {
    if (!isDragging.value || !selection.value)
      return

    isDragging.value = false

    const s = selection.value
    const minQ = Math.min(s.startQuarter, s.endQuarter)
    const maxQ = Math.max(s.startQuarter, s.endQuarter)
    if (minQ === maxQ) {
      selection.value = null
      return
    }

    selection.value.startQuarter = minQ
    selection.value.endQuarter = maxQ
    selection.value.startTableIdx = Math.min(s.startTableIdx, s.endTableIdx)
    selection.value.endTableIdx = Math.max(s.startTableIdx, s.endTableIdx)

    selectionConfirmed.value = true
  }

  const normalizedSelection = computed(() => {
    if (!selection.value)
      return null
    const s = selection.value
    return {
      minTableIdx: Math.min(s.startTableIdx, s.endTableIdx),
      maxTableIdx: Math.max(s.startTableIdx, s.endTableIdx),
      minQuarter: Math.min(s.startQuarter, s.endQuarter),
      maxQuarter: Math.max(s.startQuarter, s.endQuarter),
    }
  })

  const selectionStyle = computed(() => {
    if (!normalizedSelection.value)
      return null
    const { minTableIdx, maxTableIdx, minQuarter, maxQuarter } = normalizedSelection.value
    const timeColWidth = 52
    const left = timeColWidth + minTableIdx * COLUMN_WIDTH
    const width = (maxTableIdx - minTableIdx + 1) * COLUMN_WIDTH
    const top = 48 + minQuarter * quarterHeight
    const height = (maxQuarter - minQuarter) * quarterHeight
    return { left: `${left}px`, width: `${width}px`, top: `${top}px`, height: `${height}px` }
  })

  const selectedTables = computed(() => {
    if (!normalizedSelection.value)
      return []
    const { minTableIdx, maxTableIdx } = normalizedSelection.value
    return filteredTables.value.slice(minTableIdx, maxTableIdx + 1)
  })

  function quarterToTime(q: number): string {
    const totalMin = startMinutes + q * 15
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    return `${h}:${String(m).padStart(2, '0')}`
  }

  const selectionTimeRange = computed(() => {
    if (!normalizedSelection.value)
      return null
    const { minQuarter, maxQuarter } = normalizedSelection.value
    return {
      start: quarterToTime(minQuarter),
      end: quarterToTime(maxQuarter),
    }
  })

  const selectionDuration = computed(() => {
    if (!selectionTimeRange.value)
      return ''
    const startParts = selectionTimeRange.value.start.split(':').map(Number)
    const endParts = selectionTimeRange.value.end.split(':').map(Number)
    const diff = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1])
    const hours = Math.floor(diff / 60)
    const mins = diff % 60
    if (hours && mins)
      return `${hours} ч ${mins} мин`
    if (hours)
      return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`
    return `${mins} мин`
  })

  const selectionCapacity = computed(() => {
    return selectedTables.value.reduce((sum, t) => sum + t.capacity, 0)
  })

  function confirmSelection() {
    if (!selectionTimeRange.value)
      return
    console.log('Создать бронирование:', {
      tables: selectedTables.value.map(t => t.id),
      startTime: selectionTimeRange.value.start,
      endTime: selectionTimeRange.value.end,
      capacity: selectionCapacity.value,
    })
    selectionConfirmed.value = false
    selection.value = null
  }

  function cancelSelection() {
    selectionConfirmed.value = false
    selection.value = null
  }

  function isHoveredQuarter(tableIdx: number, quarter: number): boolean {
    if (isDragging.value || selectionConfirmed.value)
      return false
    return hoverTableIdx.value === tableIdx && hoverQuarter.value === quarter
  }

  return {
    isDragging,
    selection,
    selectionConfirmed,
    hoverTableIdx,
    hoverQuarter,
    normalizedSelection,
    selectionStyle,
    selectedTables,
    selectionTimeRange,
    selectionDuration,
    selectionCapacity,
    onGridMouseDown,
    onGridMouseMove,
    onGridMouseUp,
    onGridMouseLeave,
    confirmSelection,
    cancelSelection,
    isHoveredQuarter,
  }
}
