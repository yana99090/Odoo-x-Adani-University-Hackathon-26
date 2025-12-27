'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '@/lib/api'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RequestsPage() {
  const queryClient = useQueryClient()
  const [selectedStage, setSelectedStage] = useState<number | null>(null)

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: () => api.getRequests(),
  })

  const { data: stages, isLoading: stagesLoading } = useQuery({
    queryKey: ['stages'],
    queryFn: () => api.getStages(),
  })

  const { data: equipment } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => api.getEquipment(),
  })

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      api.updateRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })

  const handleStageChange = (requestId: number, newStageId: number) => {
    updateRequestMutation.mutate({
      id: requestId,
      data: { stage_id: newStageId }
    })
  }

  if (requestsLoading || stagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  // Group requests by stage
  const requestsByStage = stages?.reduce((acc: any, stage: any) => {
    acc[stage.id] = requests?.filter((req: any) => req.stage_id === stage.id) || []
    return acc
  }, {})

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      '0': 'bg-gray-100 text-gray-800',
      '1': 'bg-blue-100 text-blue-800',
      '2': 'bg-orange-100 text-orange-800',
      '3': 'bg-red-100 text-red-800',
    }
    return colors[priority] || colors['1']
  }

  const getPriorityLabel = (priority: string) => {
    const labels: any = {
      '0': 'Low',
      '1': 'Medium',
      '2': 'High',
      '3': 'Urgent',
    }
    return labels[priority] || 'Medium'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
            </div>
            <Link
              href="/requests/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Request</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages?.map((stage: any) => (
            <div key={stage.id} className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span>{stage.name}</span>
                <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                  {requestsByStage[stage.id]?.length || 0}
                </span>
              </h3>
              
              <div className="space-y-3">
                {requestsByStage[stage.id]?.map((request: any) => {
                  const equipmentName = equipment?.find((e: any) => e.id === request.equipment_id)?.name || 'Unknown'
                  
                  return (
                    <div
                      key={request.id}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">{request.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Equipment: {equipmentName}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(request.priority)}`}>
                          {getPriorityLabel(request.priority)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {request.request_type === 'corrective' ? '🔧 Corrective' : '📅 Preventive'}
                        </span>
                      </div>
                      
                      {/* Stage selector */}
                      <select
                        value={request.stage_id || ''}
                        onChange={(e) => handleStageChange(request.id, parseInt(e.target.value))}
                        className="mt-3 w-full text-sm border-2 border-blue-200 rounded-lg px-3 py-2 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all cursor-pointer font-medium text-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {stages.map((s: any) => (
                          <option
                            key={s.id}
                            value={s.id}
                            className="py-2 hover:bg-blue-50"
                          >
                            {s.id === request.stage_id ? `✓ ${s.name}` : `Move to ${s.name}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                })}
                
                {requestsByStage[stage.id]?.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No requests
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

