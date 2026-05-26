import type { Ref } from 'vue'
import { useEventListener, useThrottleFn } from '@vueuse/core'
import { isEditableElement } from '@/lib/isEditableElement'

function isZoomInKey(e: KeyboardEvent): boolean {
  return e.key === '+' || e.key === '=' || e.key === 'Add'
    || e.code === 'NumpadAdd' || e.code === 'Equal'
}

function isZoomOutKey(e: KeyboardEvent): boolean {
  return e.key === '-' || e.key === 'Subtract'
    || e.code === 'NumpadSubtract' || e.code === 'Minus'
}

export function useTimelineZoomShortcuts(
  gridContainer: Ref<HTMLElement | null>,
  zoomIn: () => void,
  zoomOut: () => void,
) {
  const throttledZoomIn = useThrottleFn(zoomIn, 50)
  const throttledZoomOut = useThrottleFn(zoomOut, 50)

  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (!e.ctrlKey || e.altKey || e.metaKey)
      return
    if (isEditableElement(e.target))
      return

    if (isZoomInKey(e)) {
      e.preventDefault()
      zoomIn()
    }
    else if (isZoomOutKey(e)) {
      e.preventDefault()
      zoomOut()
    }
  })

  useEventListener(
    document,
    'wheel',
    (e: WheelEvent) => {
      if (!e.ctrlKey)
        return
      const grid = gridContainer.value
      if (!grid?.contains(e.target as Node))
        return

      e.preventDefault()

      if (e.deltaY < 0)
        throttledZoomIn()
      else if (e.deltaY > 0)
        throttledZoomOut()
    },
    { passive: false, capture: true },
  )
}
