/** Пиксельная геометрия overlay (hover / selection) в координатах таблицы. */
export interface OverlayPixels {
  left: number
  top: number
  width: number
  height: number
}

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

export function computeHoverOverlayPixels(
  tableIdx: number,
  quarter: number,
  timeColumnWidthPx: number,
  columnWidthPx: number,
  headerHeightPx: number,
  quarterHeightPx: number,
): OverlayPixels & { visible: true } {
  return {
    visible: true,
    ...computeOverlayPixels(
      tableIdx,
      quarter,
      timeColumnWidthPx,
      columnWidthPx,
      headerHeightPx,
      quarterHeightPx,
    ),
  }
}
