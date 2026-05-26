import type { Ref } from 'vue'
import type { useGridCoordinates } from './useGridCoordinates'
import { useMouseInElement } from '@vueuse/core'
import { ref, watch } from 'vue'

type GridCoordinates = ReturnType<typeof useGridCoordinates>

/** Подсветка слота под курсором. */
export function useGridHover(
  gridContainer: Ref<HTMLElement | null>,
  coordinates: GridCoordinates,
) {
  const hoverTableIdx = ref(-1)
  const hoverQuarter = ref(-1)

  const { isOutside: isMouseOutsideGrid } = useMouseInElement(gridContainer)

  watch(isMouseOutsideGrid, (outside) => {
    if (outside) {
      hoverTableIdx.value = -1
      hoverQuarter.value = -1
    }
  })

  function updateHoverFromEvent(mouseEvent: MouseEvent) {
    const gridBodyElement = coordinates.getGridBody()
    if (!gridBodyElement)
      return

    hoverTableIdx.value = coordinates.getTableIndexFromClientX(mouseEvent.clientX)
    hoverQuarter.value = coordinates.getQuarterIndexFromClientY(
      mouseEvent.clientY,
      gridBodyElement,
      'floor',
      'hover',
    )
  }

  function clearHover() {
    hoverTableIdx.value = -1
    hoverQuarter.value = -1
  }

  return {
    hoverTableIdx,
    hoverQuarter,
    updateHoverFromEvent,
    clearHover,
  }
}
