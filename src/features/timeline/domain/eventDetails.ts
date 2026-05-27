import type { EventDetailsViewModel, TableInfo, TimelineEvent } from './timeline.types'
import { formatDurationRussian } from './selectionMetrics'
import { minutesToTime } from './timeGrid'

export function buildEventDetailsViewModel(
  event: TimelineEvent,
  table: TableInfo,
  selectedDay: string,
): EventDetailsViewModel {
  const timeRange = {
    start: minutesToTime(event.startMinutes),
    end: minutesToTime(event.endMinutes),
  }

  return {
    event,
    table,
    selectedDay,
    timeRange,
    duration: formatDurationRussian(timeRange),
  }
}
