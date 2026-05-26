/** true, если фокус в поле ввода (не перехватывать горячие клавиши). */
export function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')
    return true
  return target.isContentEditable
}
