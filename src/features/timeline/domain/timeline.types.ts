export type EventKind = 'order' | 'reservation'

export interface TimelineEvent {
  id: string
  tableId: string
  kind: EventKind
  status: string
  startMinutes: number
  endMinutes: number
  title?: string
  name?: string
  phone?: string
  guests?: number
  cancelled?: boolean
}

export interface LayoutEvent {
  event: TimelineEvent
  top: number
  height: number
  left: number
  width: number
  contentMaxHeight?: number
  stackIndex: number
}

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
