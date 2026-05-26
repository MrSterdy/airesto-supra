import { tryOnScopeDispose } from '@vueuse/core'

/** RAF-coalescing для mousemove (один обработчик на кадр). */
export function useCoalescedPointerMove(handler: (event: MouseEvent) => void) {
  let pendingMoveEvent: MouseEvent | null = null
  let moveRafId = 0

  function onPointerMove(mouseEvent: MouseEvent) {
    pendingMoveEvent = mouseEvent
    if (moveRafId)
      return
    moveRafId = requestAnimationFrame(() => {
      moveRafId = 0
      const event = pendingMoveEvent
      pendingMoveEvent = null
      if (event)
        handler(event)
    })
  }

  tryOnScopeDispose(() => {
    if (moveRafId)
      cancelAnimationFrame(moveRafId)
  })

  return { onPointerMove }
}
