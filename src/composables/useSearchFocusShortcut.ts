import { onKeyDown } from '@vueuse/core'
import { isEditableElement } from '@/lib/isEditableElement'

function isSearchFocusKey(e: KeyboardEvent): boolean {
  const key = e.key.toLowerCase()
  return key === 'l' || key === 'л'
}

export function useSearchFocusShortcut(getInput: () => HTMLInputElement | null | undefined) {
  onKeyDown(
    e => isSearchFocusKey(e),
    (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey)
        return
      if (isEditableElement(e.target))
        return

      e.preventDefault()
      const input = getInput()
      input?.focus()
      input?.select()
    },
    { target: document },
  )
}
