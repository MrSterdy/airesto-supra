import { onClickOutside, onKeyStroke, useEventListener, useToggle, useWindowSize } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const POPOVER_WIDTH = 112
const POPOVER_HEIGHT = 88
const OFFSET = 8

export function useScalePopover() {
  const [isOpen, toggleOpen] = useToggle(false)
  const position = ref({ x: 0, y: 0 })
  const popoverRef = ref<HTMLElement | null>(null)
  const { width, height } = useWindowSize()

  const bounds = computed(() => ({
    maxX: width.value - POPOVER_WIDTH - OFFSET,
    maxY: height.value - POPOVER_HEIGHT - OFFSET,
  }))

  function clampPosition(x: number, y: number) {
    const { maxX, maxY } = bounds.value
    return {
      x: Math.max(OFFSET, Math.min(x, maxX)),
      y: Math.max(OFFSET, Math.min(y, maxY)),
    }
  }

  function open(x: number, y: number) {
    position.value = clampPosition(x + OFFSET, y + OFFSET)
    toggleOpen(true)
  }

  function openFromEvent(e: MouseEvent) {
    open(e.clientX, e.clientY)
  }

  function close() {
    toggleOpen(false)
  }

  watch(isOpen, (open, _, onCleanup) => {
    if (!open)
      return
    onCleanup(onClickOutside(popoverRef, close))
  })

  onKeyStroke('Escape', () => {
    if (isOpen.value)
      close()
  })

  useEventListener(window, 'scroll', () => {
    if (isOpen.value)
      close()
  }, { capture: true })

  return {
    isOpen,
    position,
    popoverRef,
    open,
    openFromEvent,
    close,
  }
}
