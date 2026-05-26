import type { MaybeRefOrGetter } from 'vue'
import { onKeyDown, useFocus } from '@vueuse/core'
import { computed, toValue } from 'vue'
import { isEditableElement } from '@/shared/lib/isEditableElement'

function isSearchFocusKey(keyboardEvent: KeyboardEvent): boolean {
  const key = keyboardEvent.key.toLowerCase()
  return key === 'l' || key === 'л'
}

export function useSearchFocusShortcut(
  target: MaybeRefOrGetter<HTMLInputElement | null | undefined>,
) {
  const input = computed(() => toValue(target))
  const { focused } = useFocus(input)

  onKeyDown(
    event => isSearchFocusKey(event),
    (keyboardEvent) => {
      if (!(keyboardEvent.metaKey || keyboardEvent.ctrlKey) || keyboardEvent.altKey || keyboardEvent.shiftKey)
        return
      if (isEditableElement(keyboardEvent.target))
        return

      keyboardEvent.preventDefault()
      focused.value = true
      input.value?.select()
    },
    { target: document },
  )
}
