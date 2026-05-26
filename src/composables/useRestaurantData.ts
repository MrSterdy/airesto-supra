import type { TableInfo, TimelineEvent } from '@/types'
import { computed, ref } from 'vue'
import { applyPreferencesContext, useUiPreferences } from '@/composables/useUiPreferences'
import { mockData } from '@/data/mock'

function isoToMinutes(iso: string): number {
  const match = iso.match(/T(\d{2}):(\d{2})/)
  if (!match)
    return 0
  return Number(match[1]) * 60 + Number(match[2])
}

function isoToDate(iso: string): string {
  return iso.slice(0, 10)
}

export function useRestaurantData() {
  const data = mockData
  const restaurant = data.restaurant
  const availableDays = data.available_days
  const currentDay = data.current_day

  const zones = computed(() => {
    const set = new Set<string>()
    for (const t of data.tables) {
      set.add(t.zone)
    }
    return Array.from(set)
  })

  applyPreferencesContext({
    currentDay,
    availableDays,
    zones: zones.value,
  })

  const { selectedDay, selectedZones } = useUiPreferences()
  const searchQuery = ref('')

  function tableMatchesSearch(table: (typeof data.tables)[number], query: string, day: string): boolean {
    return table.reservations.some(
      res =>
        isoToDate(res.seating_time) === day
        && res.name_for_reservation.toLowerCase().includes(query),
    )
  }

  const visibleTables = computed(() => {
    let tables = data.tables
    if (selectedZones.value.length > 0) {
      const zoneFilter = new Set(selectedZones.value)
      tables = tables.filter(t => zoneFilter.has(t.zone))
    }
    const query = searchQuery.value.trim().toLowerCase()
    if (query) {
      const day = selectedDay.value
      tables = tables.filter(t => tableMatchesSearch(t, query, day))
    }
    return tables
  })

  const filteredTables = computed<TableInfo[]>(() =>
    visibleTables.value.map(t => ({
      id: t.id,
      number: t.number,
      zone: t.zone,
      capacity: t.capacity,
    })),
  )

  const eventsPerTable = computed(() => {
    const map = new Map<string, TimelineEvent[]>()
    const day = selectedDay.value

    const tables = visibleTables.value

    for (const table of tables) {
      const events: TimelineEvent[] = []

      for (const order of table.orders) {
        if (isoToDate(order.start_time) !== day)
          continue
        events.push({
          id: order.id,
          tableId: table.id,
          kind: 'order',
          status: order.status,
          startMinutes: isoToMinutes(order.start_time),
          endMinutes: isoToMinutes(order.end_time),
          title: order.status === 'Banquet' ? 'Банкет' : 'Заказ',
        })
      }

      for (const res of table.reservations) {
        if (isoToDate(res.seating_time) !== day)
          continue
        events.push({
          id: String(res.id),
          tableId: table.id,
          kind: 'reservation',
          status: res.status,
          startMinutes: isoToMinutes(res.seating_time),
          endMinutes: isoToMinutes(res.end_time),
          name: res.name_for_reservation,
          phone: res.phone_number,
          guests: res.num_people,
          cancelled: res.status === 'Отменен',
        })
      }

      map.set(table.id, events)
    }

    return map
  })

  return {
    restaurant,
    availableDays,
    currentDay,
    selectedDay,
    selectedZones,
    searchQuery,
    zones,
    filteredTables,
    eventsPerTable,
  }
}
