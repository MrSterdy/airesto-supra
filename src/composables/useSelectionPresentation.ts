import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'

/** Minimum selection size to anchor an inline card (px). */
const CARD_MIN_WIDTH = 140
const CARD_MIN_HEIGHT = 120

export function useSelectionPresentation(
  selectionConfirmed: Ref<boolean>,
  selectionStyle: ComputedRef<Record<string, string> | null>,
  scale: ComputedRef<number>,
) {
  const useInlineCard = computed(() => {
    if (!selectionConfirmed.value || !selectionStyle.value)
      return false

    if (scale.value < 1)
      return false

    const width = Number.parseFloat(selectionStyle.value.width)
    const height = Number.parseFloat(selectionStyle.value.height)

    if (Number.isNaN(width) || Number.isNaN(height))
      return false

    return width >= CARD_MIN_WIDTH && height >= CARD_MIN_HEIGHT
  })

  const useDialog = computed(() => selectionConfirmed.value && !useInlineCard.value)

  return { useInlineCard, useDialog }
}
