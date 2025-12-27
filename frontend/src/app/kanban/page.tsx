'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Wrench, Plus, User, AlertCircle, Clock, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import KanbanColumn from '@/components/KanbanColumn'
import KanbanCard from '@/components/KanbanCard'

export default function KanbanPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)

  // Fetch stages
  const { data: stages = [] } = useQuery({
    queryKey: ['stages'],
    queryFn: () => api.getStages(),
  })

  // Fetch maintenance requests
  const { data: requests = [] } = useQuery({
    queryKey: ['requests'],
    queryFn: () => api.getRequests({ active_only: true }),
  })

  // Update request mutation
  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const requestId = parseInt(active.id as string)
    const newStageId = parseInt(over.id as string)

    // Find the request
    const request = requests.find((r: any) => r.id === requestId)
    
    if (request && request.stage_id !== newStageId) {
      // Update the request's stage
      updateRequestMutation.mutate({
        id: requestId,
        data: { stage_id: newStageId },
      })
    }

    setActiveId(null)
  }

  // Group requests by stage
  const requestsByStage = stages.reduce((acc: any, stage: any) => {
    acc[stage.id] = requests.filter((r: any) => r.stage_id === stage.id)
    return acc
  }, {})

  // Find active request for drag overlay
  const activeRequest = activeId ? requests.find((r: any) => r.id === parseInt(activeId)) : null

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
                <h1 className="text-2xl font-bold text-gray-900">Maintenance Kanban</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/requests/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>New Request</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {stages.map((stage: any) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                requests={requestsByStage[stage.id] || []}
              />
            ))}
          </div>

          <DragOverlay>
            {activeRequest ? (
              <div className="opacity-50">
                <KanbanCard request={activeRequest} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  )
}

