import type { LayoutItem } from './types'

/** События с пересечением по времени попадают в одну группу для горизонтального стека. */
export function buildOverlapGroups(items: LayoutItem[]): number[][] {
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
