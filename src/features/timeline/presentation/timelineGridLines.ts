export const TIMELINE_GRID_LINE_COLOR = 'color-mix(in oklch, var(--foreground) 8%, transparent)'

export const TIMELINE_GRID_COLUMN_SEPARATOR = `inset -1px 0 0 0 ${TIMELINE_GRID_LINE_COLOR}`

export function timelineHorizontalGridBackground(slotHeightPx: number): string {
  const color = TIMELINE_GRID_LINE_COLOR
  return `repeating-linear-gradient(to bottom, ${color} 0, ${color} 1px, transparent 1px, transparent ${slotHeightPx}px)`
}
