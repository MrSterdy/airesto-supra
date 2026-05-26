import type { Ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')
    return true
  return target.isContentEditable
}

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
  function onKeyDown(e: KeyboardEvent) {
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
  }

  function onWheel(e: WheelEvent) {
    if (!e.ctrlKey)
      return
    const grid = gridContainer.value
    if (!grid?.contains(e.target as Node))
      return

    e.preventDefault()

    if (e.deltaY < 0)
      zoomIn()
    else if (e.deltaY > 0)
      zoomOut()
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('wheel', onWheel, { passive: false, capture: true })
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('wheel', onWheel, { capture: true })
  })
}
