/** Общие размеры таблицы для столбцов времени и столов. */
export interface TimelineLayoutProps {
  gridHeight: number
  slotHeight: number
  scale: number
  headerHeight: number
}

export interface TableColumnLayoutProps extends TimelineLayoutProps {
  quarterHeight: number
  columnWidth: number
  totalQuarters: number
  timeSlotsCount: number
}

export interface TimeColumnLayoutProps extends TimelineLayoutProps {
  timeColWidth: number
}

export interface VisibleRowRange {
  start: number
  end: number
}
