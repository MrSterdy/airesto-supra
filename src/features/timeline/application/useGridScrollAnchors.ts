import type { ComputedRef, Ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { findScrollableParent } from '@/shared/lib/findScrollableParent'
import { getContentOffset } from '@/shared/lib/getContentOffset'

/** Привязка таблицы к scroll-контейнеру страницы и расчёт margin для виртуализатора. */
export function useGridScrollAnchors(
  gridContainer: Ref<HTMLElement | null>,
  headerHeight: ComputedRef<number>,
  timeColWidth: ComputedRef<number>,
) {
  const scrollElement = ref<HTMLElement | null>(null)
  const gridOffsetTop = ref(0)
  const gridOffsetLeft = ref(0)

  function resolveScrollElement() {
    scrollElement.value = gridContainer.value
      ? findScrollableParent(gridContainer.value)
      : null
  }

  function measureOffsets() {
    if (!gridContainer.value || !scrollElement.value)
      return
    const { top, left } = getContentOffset(gridContainer.value, scrollElement.value)
    gridOffsetTop.value = top
    gridOffsetLeft.value = left
  }

  function sync() {
    resolveScrollElement()
    measureOffsets()
  }

  watch(gridContainer, sync, { flush: 'post' })

  useResizeObserver(gridContainer, () => {
    measureOffsets()
  })

  const rowScrollMargin = computed(() => gridOffsetTop.value + headerHeight.value)
  const colScrollMargin = computed(() => gridOffsetLeft.value + timeColWidth.value)

  return {
    scrollElement,
    gridOffsetLeft,
    rowScrollMargin,
    colScrollMargin,
    measureOffsets,
  }
}
