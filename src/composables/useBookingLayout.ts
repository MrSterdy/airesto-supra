import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { LayoutEvent, TableInfo, TimelineEvent } from '@/types'
import { computed, toValue } from 'vue'
import { INTERSECTION_THRESHOLD } from '@/constants'

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

export function useBookingLayout(
  filteredTables: ComputedRef<TableInfo[]> | Ref<TableInfo[]>,
  eventsPerTable: ComputedRef<Map<string, TimelineEvent[]>>,
  minutesToPx: (min: number) => number,
  columnWidth: MaybeRef<number>,
  indent: MaybeRef<number>,
) {
  const resolvedColumnWidth = computed(() => toValue(columnWidth))
  const resolvedIndent = computed(() => toValue(indent))

  function layoutEventsForTable(tableId: string): LayoutEvent[] {
    const colWidth = resolvedColumnWidth.value
    const colIndent = resolvedIndent.value
    const events = eventsPerTable.value.get(tableId)
    if (!events || !events.length)
      return []

    const sorted = [...events].sort((a, b) => {
      const diff = a.startMinutes - b.startMinutes
      if (diff !== 0)
        return diff
      return (b.endMinutes - b.startMinutes) - (a.endMinutes - a.startMinutes)
    })

    const items: LayoutItem[] = sorted.map(e => ({
      event: e,
      top: minutesToPx(e.startMinutes),
      height: minutesToPx(e.endMinutes) - minutesToPx(e.startMinutes),
      left: 0,
      width: colWidth,
      startMin: e.startMinutes,
      endMin: e.endMinutes,
    }))

    const overlapGroups = buildOverlapGroups(items)

    for (const group of overlapGroups) {
      if (group.length === 1)
        continue

      const clusters = buildIntersectionClusters(items, group)
      applyClusterLayout(items, clusters, colWidth, colIndent)
    }

    applyContentOcclusion(items, colIndent)

    return items.map((e, stackIndex) => ({
      event: e.event,
      top: e.top,
      height: e.height,
      left: e.left,
      width: e.width,
      contentMaxHeight: e.contentMaxHeight,
      stackIndex,
    }))
  }

  const tableLayouts = computed(() => {
    const map = new Map<string, LayoutEvent[]>()
    for (const table of filteredTables.value) {
      map.set(table.id, layoutEventsForTable(table.id))
    }
    return map
  })

  return { tableLayouts }
}

function buildOverlapGroups(items: LayoutItem[]): number[][] {
  const groups: number[][] = []
  const visited = new Set<number>()

  for (let i = 0; i < items.length; i++) {
    if (visited.has(i))
      continue
    const group = [i]
    visited.add(i)
    let maxEnd = items[i].endMin

    for (let j = i + 1; j < items.length; j++) {
      if (!visited.has(j) && items[j].startMin < maxEnd) {
        group.push(j)
        visited.add(j)
        maxEnd = Math.max(maxEnd, items[j].endMin)
      }
    }
    groups.push(group)
  }

  return groups
}

/**
 * Within an overlap group, cluster events whose start times
 * are within INTERSECTION_THRESHOLD minutes of the first event
 * in the cluster — these will be laid out as side-by-side columns.
 */
function buildIntersectionClusters(items: LayoutItem[], group: number[]): number[][] {
  const clusters: number[][] = []
  let currentCluster: number[] = [group[0]]

  for (let i = 1; i < group.length; i++) {
    const idx = group[i]
    const anchorIdx = currentCluster[0]
    if (items[idx].startMin - items[anchorIdx].startMin <= INTERSECTION_THRESHOLD) {
      currentCluster.push(idx)
    }
    else {
      clusters.push(currentCluster)
      currentCluster = [idx]
    }
  }
  clusters.push(currentCluster)

  return clusters
}

function rectsOverlapHorizontally(a: LayoutItem, b: LayoutItem): boolean {
  return a.left < b.left + b.width && b.left < a.left + a.width
}

function rectsOverlapVertically(a: LayoutItem, b: LayoutItem): boolean {
  return a.top < b.top + b.height && b.top < a.top + a.height
}

function applyContentOcclusion(items: LayoutItem[], indent: number): void {
  const occlusionGap = indent + 1

  for (let i = 0; i < items.length; i++) {
    let contentMaxHeight = items[i].height

    for (let j = i + 1; j < items.length; j++) {
      if (!rectsOverlapHorizontally(items[i], items[j]))
        continue
      if (!rectsOverlapVertically(items[i], items[j]))
        continue

      const occluderTop = items[j].top
      const itemTop = items[i].top

      if (occluderTop > itemTop) {
        contentMaxHeight = Math.min(contentMaxHeight, occluderTop - itemTop - occlusionGap)
      }
    }

    if (contentMaxHeight < items[i].height) {
      items[i].contentMaxHeight = contentMaxHeight
    }
  }
}

function applyClusterLayout(
  items: LayoutItem[],
  clusters: number[][],
  columnWidth: number,
  indent: number,
): void {
  const placed: { leftBase: number, maxEnd: number }[] = []

  for (const cluster of clusters) {
    const clusterStart = items[cluster[0]].startMin
    const clusterMaxEnd = Math.max(...cluster.map(idx => items[idx].endMin))

    let maxActiveLeft = -1
    for (const p of placed) {
      if (p.maxEnd > clusterStart) {
        maxActiveLeft = Math.max(maxActiveLeft, p.leftBase)
      }
    }

    const leftBase = maxActiveLeft >= 0 ? maxActiveLeft + indent : 0
    const availableWidth = columnWidth - leftBase
    const numColumns = cluster.length

    for (let c = 0; c < cluster.length; c++) {
      const idx = cluster[c]
      const colWidth = availableWidth / numColumns
      items[idx].left = leftBase + c * colWidth
      items[idx].width = colWidth
    }

    placed.push({ leftBase, maxEnd: clusterMaxEnd })
  }
}
