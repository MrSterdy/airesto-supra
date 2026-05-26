import type { Ref } from 'vue'
import { onKeyStroke, useEventListener, useThrottleFn } from '@vueuse/core'
import { isEditableElement } from '@/shared/lib/isEditableElement'

function shouldHandleZoom(keyboardEvent: KeyboardEvent): boolean {
  return keyboardEvent.ctrlKey && !keyboardEvent.altKey && !keyboardEvent.metaKey && !isEditableElement(keyboardEvent.target)
}

export function useTimelineZoomShortcuts(
  gridContainer: Ref<HTMLElement | null>,
  zoomIn: () => void,
  zoomOut: () => void,
) {
  const throttledZoomIn = useThrottleFn(zoomIn, 50)
  const throttledZoomOut = useThrottleFn(zoomOut, 50)

  function handleZoomIn(keyboardEvent: KeyboardEvent) {
    if (!shouldHandleZoom(keyboardEvent))
      return
    keyboardEvent.preventDefault()
    zoomIn()
  }

  function handleZoomOut(keyboardEvent: KeyboardEvent) {
    if (!shouldHandleZoom(keyboardEvent))
      return
    keyboardEvent.preventDefault()
    zoomOut()
  }

  onKeyStroke(['+', '=', 'Add', 'NumpadAdd'], handleZoomIn, { target: document })
  onKeyStroke(['-', 'Subtract', 'NumpadSubtract'], handleZoomOut, { target: document })

  useEventListener(
    document,
    'wheel',
    (wheelEvent: WheelEvent) => {
      if (!wheelEvent.ctrlKey)
        return
      const grid = gridContainer.value
      if (!grid?.contains(wheelEvent.target as Node))
        return

      wheelEvent.preventDefault()

      if (wheelEvent.deltaY < 0)
        throttledZoomIn()
      else if (wheelEvent.deltaY > 0)
        throttledZoomOut()
    },
    { passive: false, capture: true },
  )
}
