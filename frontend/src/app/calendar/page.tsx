'use client'

import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Wrench, ArrowLeft, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function CalendarPage() {
  const queryClient = useQueryClient()
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Fetch preventive maintenance requests
  const { data: requests = [] } = useQuery({
    queryKey: ['requests', 'preventive'],
    queryFn: () => api.getRequests({ request_type: 'preventive' }),
  })

  // Fetch teams for color coding
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.getTeams(),
  })

  // Convert requests to calendar events
  const events = useMemo(() => {
    return requests
      .filter((r: any) => r.schedule_date)
      .map((r: any) => {
        const team = teams.find((t: any) => t.id === r.maintenance_team_id)
        return {
          id: r.id,
          title: r.name,
          start: new Date(r.schedule_date),
          end: new Date(r.schedule_date),
          resource: {
            ...r,
            teamColor: team?.color || 0,
          },
        }
      })
  }, [requests, teams])

  // Event style getter for color coding
  const eventStyleGetter = useCallback((event: any) => {
    const priority = event.resource.priority
    let backgroundColor = '#3174ad'

    // Color by priority
    if (priority === '3') backgroundColor = '#dc2626' // Urgent - Red
    else if (priority === '2') backgroundColor = '#ea580c' // High - Orange
    else if (priority === '1') backgroundColor = '#2563eb' // Medium - Blue
    else backgroundColor = '#6b7280' // Low - Gray

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }, [])

  const handleSelectSlot = useCallback((slotInfo: any) => {
    // Navigate to create new request with pre-filled schedule date
    const scheduleDate = slotInfo.start.toISOString()
    window.location.href = `/requests/new?schedule_date=${scheduleDate}&type=preventive`
  }, [])

  const handleSelectEvent = useCallback((event: any) => {
    setSelectedEvent(event)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <Wrench className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Preventive Maintenance Calendar</h1>
              </div>
            </div>
            <Link
              href="/requests/new?type=preventive"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Schedule Maintenance</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6" style={{ height: '700px' }}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            popup
          />
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Priority Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-sm text-gray-700">Urgent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ea580c' }}></div>
              <span className="text-sm text-gray-700">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2563eb' }}></div>
              <span className="text-sm text-gray-700">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6b7280' }}></div>
              <span className="text-sm text-gray-700">Low</span>
            </div>
          </div>
        </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Scheduled:</span> {format(selectedEvent.start, 'PPP')}</p>
              <p><span className="font-semibold">Type:</span> Preventive Maintenance</p>
              <p><span className="font-semibold">Priority:</span> {
                selectedEvent.resource.priority === '3' ? 'Urgent' :
                selectedEvent.resource.priority === '2' ? 'High' :
                selectedEvent.resource.priority === '1' ? 'Medium' : 'Low'
              }</p>
            </div>
            <div className="mt-6 flex space-x-3">
              <Link
                href={`/requests/${selectedEvent.id}`}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
              >
                View Details
              </Link>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

