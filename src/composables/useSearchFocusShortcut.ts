import { onMounted, onUnmounted } from 'vue'

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')
    return true
  return target.isContentEditable
}

function isSearchFocusKey(e: KeyboardEvent): boolean {
  const key = e.key.toLowerCase()
  return key === 'l' || key === 'л'
}

export function useSearchFocusShortcut(getInput: () => HTMLInputElement | null | undefined) {
  function onKeyDown(e: KeyboardEvent) {
    if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey)
      return
    if (!isSearchFocusKey(e))
      return
    if (isEditableElement(e.target))
      return

    e.preventDefault()
    const input = getInput()
    input?.focus()
    input?.select()
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown)
  })
}
