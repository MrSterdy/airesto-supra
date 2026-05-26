import type { Ref } from 'vue'
import { tryOnScopeDispose, useEventListener, useMouse } from '@vueuse/core'
import { ref, watch } from 'vue'
import { findScrollableParent } from '@/shared/lib/findScrollableParent'

/**
 * Средняя кнопка мыши: перетаскивание прокрутки сетки, а не выделение.
 */
export function useGridPanning(gridContainer: Ref<HTMLElement | null>) {
  const isPanning = ref(false)
  const { x: mouseX, y: mouseY } = useMouse({ type: 'client' })

  let scrollableContainer: HTMLElement | null = null
  let panStartX = 0
  let panStartY = 0
  let panStartScrollLeft = 0
  let panStartScrollTop = 0

  function stopPanning() {
    isPanning.value = false
    scrollableContainer = null
  }

  watch([mouseX, mouseY, isPanning], () => {
    if (!isPanning.value || !scrollableContainer)
      return
    scrollableContainer.scrollLeft = panStartScrollLeft - (mouseX.value - panStartX)
    scrollableContainer.scrollTop = panStartScrollTop - (mouseY.value - panStartY)
  })

  useEventListener(document, 'mouseup', (mouseEvent: MouseEvent) => {
    if (mouseEvent.button === 1)
      stopPanning()
  })

  tryOnScopeDispose(stopPanning)

  function startPanningFromMouseDown(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 1)
      return false

    mouseEvent.preventDefault()
    scrollableContainer = findScrollableParent(gridContainer.value)
    panStartX = mouseX.value
    panStartY = mouseY.value
    panStartScrollLeft = scrollableContainer.scrollLeft
    panStartScrollTop = scrollableContainer.scrollTop
    isPanning.value = true
    return true
  }

  return {
    isPanning,
    startPanningFromMouseDown,
  }
}
