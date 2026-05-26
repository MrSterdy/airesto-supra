import type { Ref } from 'vue'

const EDGE_THRESHOLD_PX = 40
const SCROLL_STEP_PX = 12

/**
 * Автопрокрутка scroll-контейнера при drag у края viewport.
 */
export function useGridEdgeScroll(scrollElement: Ref<HTMLElement | null>) {
  let rafId = 0

  function stopEdgeScroll() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  function tickScroll(clientX: number, clientY: number) {
    const element = scrollElement.value
    if (!element) {
      stopEdgeScroll()
      return
    }

    const rect = element.getBoundingClientRect()
    let deltaX = 0
    let deltaY = 0

    if (clientX < rect.left + EDGE_THRESHOLD_PX)
      deltaX = -SCROLL_STEP_PX
    else if (clientX > rect.right - EDGE_THRESHOLD_PX)
      deltaX = SCROLL_STEP_PX

    if (clientY < rect.top + EDGE_THRESHOLD_PX)
      deltaY = -SCROLL_STEP_PX
    else if (clientY > rect.bottom - EDGE_THRESHOLD_PX)
      deltaY = SCROLL_STEP_PX

    if (deltaX !== 0)
      element.scrollLeft += deltaX
    if (deltaY !== 0)
      element.scrollTop += deltaY

    rafId = requestAnimationFrame(() => tickScroll(clientX, clientY))
  }

  function updateEdgeScroll(clientX: number, clientY: number, isDragging: boolean) {
    if (!isDragging) {
      stopEdgeScroll()
      return
    }

    const element = scrollElement.value
    if (!element)
      return

    const rect = element.getBoundingClientRect()
    const nearEdge
      = clientX < rect.left + EDGE_THRESHOLD_PX
        || clientX > rect.right - EDGE_THRESHOLD_PX
        || clientY < rect.top + EDGE_THRESHOLD_PX
        || clientY > rect.bottom - EDGE_THRESHOLD_PX

    if (nearEdge && !rafId)
      rafId = requestAnimationFrame(() => tickScroll(clientX, clientY))
    else if (!nearEdge)
      stopEdgeScroll()
  }

  return { updateEdgeScroll, stopEdgeScroll }
}
