/** Смещение элемента относительно предка в координатах контента (без учёта текущего scroll). */
export function getContentOffset(
  element: HTMLElement,
  ancestor: HTMLElement,
): { top: number, left: number } {
  let top = 0
  let left = 0
  let current: HTMLElement | null = element

  while (current && current !== ancestor) {
    top += current.offsetTop
    left += current.offsetLeft
    current = current.offsetParent as HTMLElement | null
  }

  return { top, left }
}
