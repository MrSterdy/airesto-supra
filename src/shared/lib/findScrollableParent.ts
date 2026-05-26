export function findScrollableParent(element: HTMLElement | null): HTMLElement {
  let parent = element?.parentElement ?? null
  while (parent) {
    const { overflow, overflowX, overflowY } = getComputedStyle(parent)
    const isScrollable = (value: string) => value === 'auto' || value === 'scroll'
    if (isScrollable(overflow) || isScrollable(overflowX) || isScrollable(overflowY)) {
      if (parent.scrollWidth > parent.clientWidth || parent.scrollHeight > parent.clientHeight)
        return parent
    }
    parent = parent.parentElement
  }
  return document.documentElement
}
