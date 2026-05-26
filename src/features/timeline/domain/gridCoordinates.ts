export type QuarterSnapMode = 'floor' | 'round'

/** Режим clamp: drag допускает индекс totalQuarters, hover - максимум totalQuarters - 1. */
export type QuarterClampMode = 'drag' | 'hover'

function clampQuarterIndex(quarterIndex: number, totalQuarters: number, mode: QuarterClampMode): number {
  const maxIndex = mode === 'drag' ? totalQuarters : totalQuarters - 1
  return Math.max(0, Math.min(quarterIndex, maxIndex))
}

/**
 * Индекс quarter по смещению от верха grid body.
 * snap floor - начало drag; round - обновление при движении.
 */
export function offsetToQuarterIndex(
  offsetFromBodyTop: number,
  quarterHeightPx: number,
  totalQuarters: number,
  snap: QuarterSnapMode,
  clampMode: QuarterClampMode,
): number {
  const quarterIndex = snap === 'floor'
    ? Math.floor(offsetFromBodyTop / quarterHeightPx)
    : Math.round(offsetFromBodyTop / quarterHeightPx)
  return clampQuarterIndex(quarterIndex, totalQuarters, clampMode)
}

/** Индекс столбца стола по смещению от левого края таблицы после столбца со временем. */
export function offsetToTableIndex(
  offsetFromGridLeft: number,
  timeColumnWidthPx: number,
  columnWidthPx: number,
  tableCount: number,
): number {
  const tableColumnIndex = Math.floor((offsetFromGridLeft - timeColumnWidthPx) / columnWidthPx)
  return Math.max(0, Math.min(tableColumnIndex, Math.max(0, tableCount - 1)))
}
