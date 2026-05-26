import type { ComputedRef, Ref } from 'vue'
import type { OrderStatus, ReservationStatus } from '@/shared/constants'

/** Тип события на временной шкале. */
export type EventKind = 'order' | 'reservation'

export interface TimelineEvent {
  id: string
  tableId: string
  kind: EventKind
  status: OrderStatus | ReservationStatus | string
  startMinutes: number
  endMinutes: number
  title?: string
  name?: string
  phone?: string
  guests?: number
  cancelled?: boolean
}

/** Событие с вычисленной геометрией для отрисовки. */
export interface LayoutEvent {
  event: TimelineEvent
  top: number
  height: number
  left: number
  width: number
  contentMaxHeight?: number
  stackIndex: number
}

/** Состояние drag-выделения (индексы столов и quarter-слотов). */
export interface SelectionState {
  startTableIdx: number
  endTableIdx: number
  startQuarter: number
  endQuarter: number
}

export interface TableInfo {
  id: string
  number: string
  zone: string
  capacity: number
}

/** Реактивный список столов (ref или computed). */
export type TableListRef = Ref<TableInfo[]> | ComputedRef<TableInfo[]>

export interface NormalizedSelection {
  minTableIdx: number
  maxTableIdx: number
  minQuarter: number
  maxQuarter: number
}

export interface SelectionDimensions {
  width: number
  height: number
}

export interface SelectionTimeRange {
  start: string
  end: string
}

/** Общие props карточки и диалога подтверждения брони. */
export interface SelectionBookingProps {
  timeRange: SelectionTimeRange
  duration: string
  capacity: number
  selectedTables: TableInfo[]
  selectedDay: string
}

/** CSS-стили прямоугольника выделения (px). */
export type SelectionBoxStyle = Record<string, string>

/** Метрики сетки для расчёта стилей выделения. */
export interface GridMetrics {
  columnWidth: Ref<number> | ComputedRef<number>
  quarterHeight: Ref<number> | ComputedRef<number>
  timeColWidth: Ref<number> | ComputedRef<number>
  headerHeight: Ref<number> | ComputedRef<number>
}
