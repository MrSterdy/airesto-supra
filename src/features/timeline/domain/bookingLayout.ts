import type { LayoutEvent, TimelineEvent } from './timeline.types'
import { INTERSECTION_THRESHOLD } from '@/shared/constants'

interface LayoutItem {
  event: TimelineEvent
  top: number
  height: number
  left: number
  width: number
  startMin: number
  endMin: number
  contentMaxHeight?: number
}

// События с пересечением по времени попадают в одну группу для горизонтального стека.
function buildOverlapGroups(items: LayoutItem[]): number[][] {
  const overlapGroups: number[][] = []
  const visited = new Set<number>()

  for (let index = 0; index < items.length; index++) {
    if (visited.has(index))
      continue

    const overlapGroup = [index]
    visited.add(index)
    let maxEndMinutes = items[index].endMin

    for (let nextIndex = index + 1; nextIndex < items.length; nextIndex++) {
      if (!visited.has(nextIndex) && items[nextIndex].startMin < maxEndMinutes) {
        overlapGroup.push(nextIndex)
        visited.add(nextIndex)
        maxEndMinutes = Math.max(maxEndMinutes, items[nextIndex].endMin)
      }
    }
    overlapGroups.push(overlapGroup)
  }

  return overlapGroups
}

/** Кластеры внутри пересекающихся групп: события, начавшиеся в пределах интервала пересечения. */
function buildIntersectionClusters(items: LayoutItem[], overlapGroup: number[]): number[][] {
  const intersectionClusters: number[][] = []
  let currentCluster: number[] = [overlapGroup[0]]

  for (let index = 1; index < overlapGroup.length; index++) {
    const itemIndex = overlapGroup[index]
    const anchorIndex = currentCluster[0]
    if (items[itemIndex].startMin - items[anchorIndex].startMin <= INTERSECTION_THRESHOLD) {
      currentCluster.push(itemIndex)
    }
    else {
      intersectionClusters.push(currentCluster)
      currentCluster = [itemIndex]
    }
  }
  intersectionClusters.push(currentCluster)

  return intersectionClusters
}

function rectsOverlapHorizontally(first: LayoutItem, second: LayoutItem): boolean {
  return first.left < second.left + second.width && second.left < first.left + first.width
}

function rectsOverlapVertically(first: LayoutItem, second: LayoutItem): boolean {
  return first.top < second.top + second.height && second.top < first.top + first.height
}

/** Обрезка видимой высоты контента, если сверху лежит другая бронь. */
function applyContentOcclusion(items: LayoutItem[], indentPx: number): void {
  const occlusionGap = indentPx + 1

  for (let index = 0; index < items.length; index++) {
    let contentMaxHeight = items[index].height

    for (let otherIndex = index + 1; otherIndex < items.length; otherIndex++) {
      if (!rectsOverlapHorizontally(items[index], items[otherIndex]))
        continue
      if (!rectsOverlapVertically(items[index], items[otherIndex]))
        continue

      const occluderTop = items[otherIndex].top
      const itemTop = items[index].top

      if (occluderTop > itemTop) {
        contentMaxHeight = Math.min(contentMaxHeight, occluderTop - itemTop - occlusionGap)
      }
    }

    if (contentMaxHeight < items[index].height) {
      items[index].contentMaxHeight = contentMaxHeight
    }
  }
}

function applyClusterLayout(
  items: LayoutItem[],
  intersectionClusters: number[][],
  columnWidthPx: number,
  indentPx: number,
): void {
  const placed: { leftBase: number, maxEnd: number }[] = []

  for (const cluster of intersectionClusters) {
    const clusterStart = items[cluster[0]].startMin
    const clusterMaxEnd = Math.max(...cluster.map(itemIndex => items[itemIndex].endMin))

    let maxActiveLeft = -1
    for (const placement of placed) {
      if (placement.maxEnd > clusterStart) {
        maxActiveLeft = Math.max(maxActiveLeft, placement.leftBase)
      }
    }

    const leftBase = maxActiveLeft >= 0 ? maxActiveLeft + indentPx : 0
    const availableWidth = columnWidthPx - leftBase
    const columnCount = cluster.length

    for (let columnIndex = 0; columnIndex < cluster.length; columnIndex++) {
      const itemIndex = cluster[columnIndex]
      const columnWidth = availableWidth / columnCount
      items[itemIndex].left = leftBase + columnIndex * columnWidth
      items[itemIndex].width = columnWidth
    }

    placed.push({ leftBase, maxEnd: clusterMaxEnd })
  }
}

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
