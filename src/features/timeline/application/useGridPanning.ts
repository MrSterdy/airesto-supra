import type { Ref } from 'vue'
import { tryOnScopeDispose, useEventListener } from '@vueuse/core'
import { ref } from 'vue'
import { findScrollableParent } from '@/shared/lib/findScrollableParent'

/**
 * Средняя кнопка мыши: перетаскивание прокрутки сетки, а не выделение.
 */
export function useGridPanning(
  gridContainer: Ref<HTMLElement | null>,
  preferredScrollElement?: Ref<HTMLElement | null>,
) {
  const isPanning = ref(false)

  let scrollableContainer: HTMLElement | null = null
  let panStartX = 0
  let panStartY = 0
  let panStartScrollLeft = 0
  let panStartScrollTop = 0

  function stopPanning() {
    isPanning.value = false
    scrollableContainer = null
  }

  useEventListener(document, 'mousemove', (mouseEvent: MouseEvent) => {
    if (!isPanning.value || !scrollableContainer)
      return
    scrollableContainer.scrollLeft = panStartScrollLeft - (mouseEvent.clientX - panStartX)
    scrollableContainer.scrollTop = panStartScrollTop - (mouseEvent.clientY - panStartY)
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
    scrollableContainer = preferredScrollElement?.value
      ?? findScrollableParent(gridContainer.value)
    if (!scrollableContainer)
      return false

    panStartX = mouseEvent.clientX
    panStartY = mouseEvent.clientY
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
