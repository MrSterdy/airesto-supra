import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { SelectionDimensions } from '@/features/timeline/domain/timeline.types'
import { useBreakpoints } from '@vueuse/core'
import { computed, toValue } from 'vue'

/** Минимальный размер выделения для inline-карточки (px). */
const CARD_MIN_WIDTH = 140
const CARD_MIN_HEIGHT = 120

const breakpoints = useBreakpoints({
  sm: 640,
})

/**
 * Выбор междукарточкой и модальным диалогом:
 * узкий viewport, мелкий размер или маленькое выделение - dialog.
 */
export function useSelectionPresentation(
  selectionConfirmed: Ref<boolean>,
  selectionDimensions: ComputedRef<SelectionDimensions | null>,
  scale: MaybeRefOrGetter<number>,
) {
  const isNarrowViewport = breakpoints.smaller('sm')

  const useInlineCard = computed(() => {
    if (!selectionConfirmed.value || !selectionDimensions.value)
      return false

    if (isNarrowViewport.value)
      return false

    if (toValue(scale) < 1)
      return false

    const { width, height } = selectionDimensions.value
    return width >= CARD_MIN_WIDTH && height >= CARD_MIN_HEIGHT
  })

  const useDialog = computed(() => selectionConfirmed.value && !useInlineCard.value)

  return { useInlineCard, useDialog }
}
