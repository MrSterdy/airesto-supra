export const SLOT_HEIGHT = 40
export const COLUMN_WIDTH = 80
export const INDENT = 4
export const INTERSECTION_THRESHOLD = 30

const DEFAULT_ORDER_COLOR = { bg: 'rgba(127, 215, 204, 0.16)', border: '#7FD7CC' }
const DEFAULT_RESERVATION_COLOR = { bg: 'rgba(255, 112, 67, 0.16)', border: '#FF7043' }

export const ORDER_COLORS: Record<string, { bg: string, border: string }> = {
  New: { bg: 'rgba(127, 215, 204, 0.16)', border: '#7FD7CC' },
  Closed: { bg: 'rgba(127, 215, 204, 0.08)', border: '#7FD7CC' },
  Bill: { bg: 'rgba(74, 201, 155, 0.16)', border: '#4AC99B' },
  Banquet: { bg: 'rgba(179, 72, 247, 0.16)', border: '#7B439E' },
}

export const RESERVATION_COLORS: Record<string, { bg: string, border: string }> = {
  'Заявка': { bg: 'rgba(255, 112, 67, 0.16)', border: '#FF7043' },
  'Новая': { bg: 'rgba(255, 112, 67, 0.16)', border: '#FF7043' },
  'Живая очередь': { bg: 'rgba(0, 151, 253, 0.16)', border: '#007AFF' },
  'Открыт': { bg: 'rgba(74, 201, 155, 0.16)', border: '#4AC99B' },
  'Занял место': { bg: 'rgba(74, 201, 155, 0.16)', border: '#4AC99B' },
  'Вызвана': { bg: 'rgba(0, 151, 253, 0.24)', border: '#007AFF' },
  'Отменен': { bg: 'rgba(255, 255, 255, 0.04)', border: '#666' },
}

export function getEventColor(kind: 'order' | 'reservation', status: string) {
  if (kind === 'order') {
    return ORDER_COLORS[status] ?? DEFAULT_ORDER_COLOR
  }
  return RESERVATION_COLORS[status] ?? DEFAULT_RESERVATION_COLOR
}

export const BADGE_COLORS: Record<string, { bg: string, text: string }> = {
  'New': { bg: 'rgba(255, 255, 255, 0.12)', text: '#FFFFFF' },
  'Closed': { bg: 'rgba(255, 255, 255, 0.12)', text: '#FFFFFF' },
  'Bill': { bg: 'rgba(74, 201, 155, 0.32)', text: '#FFFFFF' },
  'Banquet': { bg: 'rgba(179, 72, 247, 0.24)', text: '#FFFFFF' },
  'Заявка': { bg: 'rgba(0, 151, 253, 0.1)', text: '#0097FD' },
  'Новая': { bg: 'rgba(0, 151, 253, 0.1)', text: '#0097FD' },
  'Живая очередь': { bg: 'rgba(0, 151, 253, 0.2)', text: '#007AFF' },
  'Открыт': { bg: 'rgba(74, 201, 155, 0.32)', text: '#FFFFFF' },
  'Занял место': { bg: 'rgba(74, 201, 155, 0.32)', text: '#FFFFFF' },
  'Вызвана': { bg: 'rgba(0, 151, 253, 0.2)', text: '#007AFF' },
  'Отменен': { bg: 'rgba(255, 255, 255, 0.08)', text: '#999' },
}

const DEFAULT_BADGE = { bg: 'rgba(255, 255, 255, 0.12)', text: '#FFFFFF' }

export function getBadgeColor(status: string) {
  return BADGE_COLORS[status] ?? DEFAULT_BADGE
}

export function getOrderTitle(status: string): string {
  return status === 'Banquet' ? 'Банкет' : 'Заказ'
}

export function getOrderBadgeLabel(status: string): string {
  switch (status) {
    case 'New': return 'Новый'
    case 'Closed': return 'Закрытый'
    case 'Bill': return 'Пречек'
    case 'Banquet': return 'Банкет'
    default: return status
  }
}
