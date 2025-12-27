'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard'

interface KanbanColumnProps {
  stage: any
  requests: any[]
}

export default function KanbanColumn({ stage, requests }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  })

  const requestIds = requests.map((r) => r.id.toString())

  // Color mapping for stages
  const stageColors: Record<string, string> = {
    'New': 'bg-blue-100 border-blue-300',
    'In Progress': 'bg-yellow-100 border-yellow-300',
    'Repaired': 'bg-green-100 border-green-300',
    'Scrap': 'bg-red-100 border-red-300',
  }

  const headerColors: Record<string, string> = {
    'New': 'bg-blue-600',
    'In Progress': 'bg-yellow-600',
    'Repaired': 'bg-green-600',
    'Scrap': 'bg-red-600',
  }

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`rounded-lg border-2 ${stageColors[stage.name] || 'bg-gray-100 border-gray-300'} h-full`}>
        {/* Column Header */}
        <div className={`${headerColors[stage.name] || 'bg-gray-600'} text-white px-4 py-3 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{stage.name}</h3>
            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
              {requests.length}
            </span>
          </div>
        </div>

        {/* Cards Container */}
        <div
          ref={setNodeRef}
          className="p-3 space-y-3 min-h-[200px]"
        >
          <SortableContext items={requestIds} strategy={verticalListSortingStrategy}>
            {requests.map((request) => (
              <KanbanCard key={request.id} request={request} />
            ))}
          </SortableContext>

          {requests.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">No requests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

