import type { LayoutEvent, TimelineEvent } from '../timeline.types'
import type { LayoutItem } from './types'
import { applyClusterLayout, buildIntersectionClusters } from './intersectionClusters'
import { applyContentOcclusion } from './occlusion'
import { buildOverlapGroups } from './overlapGroups'

/**
 * Раскладка броней для одного стола.
 */
export function layoutEventsForTable(
  events: TimelineEvent[],
  minutesToPx: (minutes: number) => number,
  columnWidthPx: number,
  indentPx: number,
): LayoutEvent[] {
  if (!events.length)
    return []

  const sorted = [...events].sort((first, second) => {
    const startDiff = first.startMinutes - second.startMinutes
    if (startDiff !== 0)
      return startDiff
    return (second.endMinutes - second.startMinutes) - (first.endMinutes - first.startMinutes)
  })

  const items: LayoutItem[] = sorted.map(event => ({
    event,
    top: minutesToPx(event.startMinutes),
    height: minutesToPx(event.endMinutes) - minutesToPx(event.startMinutes),
    left: 0,
    width: columnWidthPx,
    startMin: event.startMinutes,
    endMin: event.endMinutes,
  }))

  const overlapGroups = buildOverlapGroups(items)

  for (const overlapGroup of overlapGroups) {
    if (overlapGroup.length === 1)
      continue

    const intersectionClusters = buildIntersectionClusters(items, overlapGroup)
    applyClusterLayout(items, intersectionClusters, columnWidthPx, indentPx)
  }

  applyContentOcclusion(items, indentPx)

  return items.map((item, stackIndex) => ({
    event: item.event,
    top: item.top,
    height: item.height,
    left: item.left,
    width: item.width,
    contentMaxHeight: item.contentMaxHeight,
    stackIndex,
  }))
}
