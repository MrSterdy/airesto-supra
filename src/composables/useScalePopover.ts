import { onMounted, onUnmounted, ref } from 'vue'

const POPOVER_WIDTH = 112
const POPOVER_HEIGHT = 88
const OFFSET = 8

export function useScalePopover() {
  const isOpen = ref(false)
  const position = ref({ x: 0, y: 0 })
  const popoverRef = ref<HTMLElement | null>(null)

  function clampPosition(x: number, y: number) {
    const maxX = window.innerWidth - POPOVER_WIDTH - OFFSET
    const maxY = window.innerHeight - POPOVER_HEIGHT - OFFSET
    return {
      x: Math.max(OFFSET, Math.min(x, maxX)),
      y: Math.max(OFFSET, Math.min(y, maxY)),
    }
  }

  function open(x: number, y: number) {
    position.value = clampPosition(x + OFFSET, y + OFFSET)
    isOpen.value = true
  }

  function openFromEvent(e: MouseEvent) {
    open(e.clientX, e.clientY)
  }

  function close() {
    isOpen.value = false
  }

  function getPopoverElement(): HTMLElement | null {
    const el = popoverRef.value
    if (!el)
      return null
    if (el instanceof HTMLElement)
      return el
    return (el as { $el?: HTMLElement }).$el ?? null
  }

  function onDocumentClick(e: MouseEvent) {
    if (!isOpen.value)
      return
    const el = getPopoverElement()
    if (el?.contains(e.target as Node))
      return
    close()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape')
      close()
  }

  onMounted(() => {
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', close, true)
  })

  onUnmounted(() => {
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('scroll', close, true)
  })

  return {
    isOpen,
    position,
    popoverRef,
    open,
    openFromEvent,
    close,
  }
}
