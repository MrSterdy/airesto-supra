import type { LayoutItem } from './types'

function rectsOverlapHorizontally(first: LayoutItem, second: LayoutItem): boolean {
  return first.left < second.left + second.width && second.left < first.left + first.width
}

function rectsOverlapVertically(first: LayoutItem, second: LayoutItem): boolean {
  return first.top < second.top + second.height && second.top < first.top + first.height
}

/** Обрезка видимой высоты контента, если сверху лежит другая бронь. */
export function applyContentOcclusion(items: LayoutItem[], indentPx: number): void {
  const OCCLUSION_GAP = indentPx + 1

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
        contentMaxHeight = Math.min(contentMaxHeight, occluderTop - itemTop - OCCLUSION_GAP)
      }
    }

    if (contentMaxHeight < items[index].height) {
      items[index].contentMaxHeight = contentMaxHeight
    }
  }
}
