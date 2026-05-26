import { useConfirmDialog } from '@vueuse/core'
import { shallowRef } from 'vue'

export type OnBookingConfirm = (payload: {
  tables: string[]
  startTime: string
  endTime: string
  capacity: number
}) => void

export const defaultOnBookingConfirm: OnBookingConfirm = (payload) => {
  // eslint-disable-next-line no-console -- demo booking action
  console.log('Создать бронирование:', payload)
}

/** Подтверждение выделения через useConfirmDialog. */
export function useSelectionConfirm() {
  const selectionConfirmed = shallowRef(false)

  const {
    confirm: confirmSelection,
    cancel: cancelSelection,
    onConfirm,
    onCancel,
  } = useConfirmDialog(selectionConfirmed)

  return {
    selectionConfirmed,
    onConfirm,
    onCancel,
    confirmSelection,
    cancelSelection,
  }
}
