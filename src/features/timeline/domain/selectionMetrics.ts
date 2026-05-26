import type {
  NormalizedSelection,
  SelectionDimensions,
  SelectionTimeRange,
  TableInfo,
} from './timeline.types'
import { quarterToTime } from './timeGrid'

export function computeNormalizedSelection(selection: {
  startTableIdx: number
  endTableIdx: number
  startQuarter: number
  endQuarter: number
}): NormalizedSelection {
  return {
    minTableIdx: Math.min(selection.startTableIdx, selection.endTableIdx),
    maxTableIdx: Math.max(selection.startTableIdx, selection.endTableIdx),
    minQuarter: Math.min(selection.startQuarter, selection.endQuarter),
    maxQuarter: Math.max(selection.startQuarter, selection.endQuarter),
  }
}

export function computeSelectionDimensions(
  normalized: NormalizedSelection,
  columnWidthPx: number,
  quarterHeightPx: number,
): SelectionDimensions {
  const { minTableIdx, maxTableIdx, minQuarter, maxQuarter } = normalized
  return {
    width: (maxTableIdx - minTableIdx + 1) * columnWidthPx,
    height: (maxQuarter - minQuarter) * quarterHeightPx,
  }
}

export function computeSelectionStyle(
  normalized: NormalizedSelection,
  dimensions: SelectionDimensions,
  timeColumnWidthPx: number,
  columnWidthPx: number,
  headerHeightPx: number,
  quarterHeightPx: number,
): Record<string, string> {
  const { minTableIdx, minQuarter } = normalized
  const { width, height } = dimensions
  const left = timeColumnWidthPx + minTableIdx * columnWidthPx
  const top = headerHeightPx + minQuarter * quarterHeightPx
  return {
    left: `${left}px`,
    width: `${width}px`,
    top: `${top}px`,
    height: `${height}px`,
  }
}

export function computeSelectionTimeRange(
  normalized: NormalizedSelection,
  shiftStartMinutes: number,
): SelectionTimeRange {
  return {
    start: quarterToTime(shiftStartMinutes, normalized.minQuarter),
    end: quarterToTime(shiftStartMinutes, normalized.maxQuarter),
  }
}

/** Длительность интервала на русском. */
export function formatDurationRussian(timeRange: SelectionTimeRange): string {
  const startParts = timeRange.start.split(':').map(Number)
  const endParts = timeRange.end.split(':').map(Number)
  const diffMinutes = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1])
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  if (hours && minutes)
    return `${hours} ч ${minutes} мин`
  if (hours)
    return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`
  return `${minutes} мин`
}

export function computeSelectionCapacity(
  tables: TableInfo[],
  normalized: NormalizedSelection,
): number {
  return tables
    .slice(normalized.minTableIdx, normalized.maxTableIdx + 1)
    .reduce((sum, table) => sum + table.capacity, 0)
}
