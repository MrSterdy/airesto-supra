import type { TableInfo, TimelineEvent } from '@/types'
import { computed, ref } from 'vue'
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

  const selectedDay = ref(currentDay)
  const selectedZone = ref<string | null>(null)

  const zones = computed(() => {
    const set = new Set<string>()
    for (const t of data.tables) {
      set.add(t.zone)
    }
    return Array.from(set)
  })

  const filteredTables = computed<TableInfo[]>(() => {
    let tables = data.tables
    if (selectedZone.value) {
      tables = tables.filter(t => t.zone === selectedZone.value)
    }
    return tables.map(t => ({
      id: t.id,
      number: t.number,
      zone: t.zone,
      capacity: t.capacity,
    }))
  })

  const eventsPerTable = computed(() => {
    const map = new Map<string, TimelineEvent[]>()
    const day = selectedDay.value

    let tables = data.tables
    if (selectedZone.value) {
      tables = tables.filter(t => t.zone === selectedZone.value)
    }

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
    selectedZone,
    zones,
    filteredTables,
    eventsPerTable,
  }
}
