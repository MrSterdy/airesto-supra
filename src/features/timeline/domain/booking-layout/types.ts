import type { TimelineEvent } from '../timeline.types'

export interface LayoutItem {
  event: TimelineEvent
  top: number
  height: number
  left: number
  width: number
  startMin: number
  endMin: number
  contentMaxHeight?: number
}
