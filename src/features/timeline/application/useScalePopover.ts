import { onClickOutside, onKeyStroke, useElementBounding, useEventListener, useToggle, useWindowSize } from '@vueuse/core'
import { useClamp } from '@vueuse/math'
import { computed, ref, watch } from 'vue'

const POPOVER_OFFSET = 8

export function useScalePopover() {
  const [isOpen, toggleOpen] = useToggle(false)
  const position = ref({ x: 0, y: 0 })
  const popoverRef = ref<HTMLElement | null>(null)
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { width: popoverWidth, height: popoverHeight } = useElementBounding(popoverRef)

  const maxX = computed(() => {
    const width = popoverWidth.value || 112
    return windowWidth.value - width - POPOVER_OFFSET
  })

  const maxY = computed(() => {
    const height = popoverHeight.value || 88
    return windowHeight.value - height - POPOVER_OFFSET
  })

  const clampedX = useClamp(
    computed(() => position.value.x),
    POPOVER_OFFSET,
    maxX,
  )

  const clampedY = useClamp(
    computed(() => position.value.y),
    POPOVER_OFFSET,
    maxY,
  )

  const displayPosition = computed(() => ({
    x: clampedX.value,
    y: clampedY.value,
  }))

  function open(x: number, y: number) {
    position.value = { x: x + POPOVER_OFFSET, y: y + POPOVER_OFFSET }
    toggleOpen(true)
  }

  function openFromEvent(mouseEvent: MouseEvent) {
    open(mouseEvent.clientX, mouseEvent.clientY)
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
    position: displayPosition,
    popoverRef,
    open,
    openFromEvent,
    close,
  }
}
