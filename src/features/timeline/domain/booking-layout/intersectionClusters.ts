import type { LayoutItem } from './types'
import { INTERSECTION_THRESHOLD } from '@/features/timeline/domain/constants'

/** Кластеры внутри пересекающихся групп (события с близким startMin). */
export function buildIntersectionClusters(items: LayoutItem[], overlapGroup: number[]): number[][] {
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

/** Распределяет ширину столбцов внутри кластера пересечений. */
export function applyClusterLayout(
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
