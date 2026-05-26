import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/** Масштабируемые размеры шрифта для элементов таблицы. */
export function useScaledTypography(scale: MaybeRefOrGetter<number>) {
  const resolvedScale = computed(() => toValue(scale))

  const labelStyle = computed(() => ({
    fontSize: `${11 * resolvedScale.value}px`,
    lineHeight: `${14 * resolvedScale.value}px`,
  }))

  const titleStyle = computed(() => ({
    fontSize: `${13 * resolvedScale.value}px`,
    lineHeight: `${20 * resolvedScale.value}px`,
  }))

  const badgeStyle = computed(() => ({
    fontSize: `${8 * resolvedScale.value}px`,
    lineHeight: `${8 * resolvedScale.value}px`,
    padding: `${1 * resolvedScale.value}px ${2 * resolvedScale.value}px`,
  }))

  const iconSize = computed(() => 10 * resolvedScale.value)
  const contentPadding = computed(() => 2 * resolvedScale.value)
  const contentGap = computed(() => 2 * resolvedScale.value)
  const borderWidth = computed(() => Math.max(1, 2 * resolvedScale.value))
  const timeLabelOffset = computed(() => 7 * resolvedScale.value)

  return {
    labelStyle,
    titleStyle,
    badgeStyle,
    iconSize,
    contentPadding,
    contentGap,
    borderWidth,
    timeLabelOffset,
  }
}
