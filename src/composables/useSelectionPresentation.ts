import type { ComputedRef, Ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'

/** Minimum selection size to anchor an inline card (px). */
const CARD_MIN_WIDTH = 140
const CARD_MIN_HEIGHT = 120

export interface SelectionDimensions {
  width: number
  height: number
}

export function useSelectionPresentation(
  selectionConfirmed: Ref<boolean>,
  selectionDimensions: ComputedRef<SelectionDimensions | null>,
  scale: ComputedRef<number>,
) {
  const isNarrowViewport = useMediaQuery('(max-width: 640px)')

  const useInlineCard = computed(() => {
    if (!selectionConfirmed.value || !selectionDimensions.value)
      return false

    if (isNarrowViewport.value)
      return false

    if (scale.value < 1)
      return false

    const { width, height } = selectionDimensions.value
    return width >= CARD_MIN_WIDTH && height >= CARD_MIN_HEIGHT
  })

  const useDialog = computed(() => selectionConfirmed.value && !useInlineCard.value)

  return { useInlineCard, useDialog }
}
