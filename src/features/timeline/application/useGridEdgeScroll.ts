import type { Ref } from 'vue'
import { useRafFn } from '@vueuse/core'
import { ref } from 'vue'

const EDGE_THRESHOLD_PX = 40
const SCROLL_STEP_PX = 12

/**
 * Автопрокрутка scroll-контейнера при drag у края viewport.
 */
export function useGridEdgeScroll(scrollElement: Ref<HTMLElement | null>) {
  const pointer = ref({ x: 0, y: 0 })
  const isActive = ref(false)

  const { pause, resume } = useRafFn(() => {
    const element = scrollElement.value
    if (!element || !isActive.value)
      return

    const { x: clientX, y: clientY } = pointer.value
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
  }, { immediate: false })

  function stopEdgeScroll() {
    isActive.value = false
    pause()
  }

  function updateEdgeScroll(clientX: number, clientY: number, isDragging: boolean) {
    if (!isDragging) {
      stopEdgeScroll()
      return
    }

    const element = scrollElement.value
    if (!element)
      return

    pointer.value = { x: clientX, y: clientY }
    const rect = element.getBoundingClientRect()
    const nearEdge
      = clientX < rect.left + EDGE_THRESHOLD_PX
        || clientX > rect.right - EDGE_THRESHOLD_PX
        || clientY < rect.top + EDGE_THRESHOLD_PX
        || clientY > rect.bottom - EDGE_THRESHOLD_PX

    if (nearEdge) {
      isActive.value = true
      resume()
    }
    else {
      stopEdgeScroll()
    }
  }

  return { updateEdgeScroll, stopEdgeScroll }
}
