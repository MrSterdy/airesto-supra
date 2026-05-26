/** Пиксельная геометрия overlay (hover / selection) в координатах таблицы. */
export interface OverlayPixels {
  left: number
  top: number
  width: number
  height: number
}

/** Пиксельная геометрия overlay по индексам стола и quarter. */
export function computeOverlayPixels(
  tableIdx: number,
  quarter: number,
  timeColumnWidthPx: number,
  columnWidthPx: number,
  headerHeightPx: number,
  quarterHeightPx: number,
  widthColumns = 1,
  heightQuarters = 1,
): OverlayPixels {
  return {
    left: timeColumnWidthPx + tableIdx * columnWidthPx,
    top: headerHeightPx + quarter * quarterHeightPx,
    width: columnWidthPx * widthColumns,
    height: quarterHeightPx * heightQuarters,
  }
}
