import type { LayoutEvent } from './timeline.types'

/** Событие пересекает видимый диапазон quarter-строк. */
export function isLayoutEventInRowRange(
  layoutEvent: Pick<LayoutEvent, 'top' | 'height'>,
  rowStart: number,
  rowEnd: number,
  quarterHeight: number,
): boolean {
  const rangeTop = rowStart * quarterHeight
  const rangeBottom = (rowEnd + 1) * quarterHeight
  return layoutEvent.top + layoutEvent.height > rangeTop && layoutEvent.top < rangeBottom
}
