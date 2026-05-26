import type { ComputedRef, Ref } from 'vue'
import type { TableInfo, TimelineEvent } from '@/features/timeline/domain/timeline.types'
import { createInjectionState } from '@vueuse/core'

export interface TimelineContext {
  filteredTables: Ref<TableInfo[]> | ComputedRef<TableInfo[]>
  eventsPerTable: Ref<Map<string, TimelineEvent[]>> | ComputedRef<Map<string, TimelineEvent[]>>
  openingTime: string
  closingTime: string
  selectedDay: Ref<string> | ComputedRef<string>
}

export const [provideTimelineContext, useTimelineContext] = createInjectionState(
  (context: TimelineContext) => context,
)
