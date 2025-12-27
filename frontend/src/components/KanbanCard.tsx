'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { User, AlertCircle, Clock, Wrench, Calendar } from 'lucide-react'
import Link from 'next/link'

interface KanbanCardProps {
  request: any
}

export default function KanbanCard({ request }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Check if request is overdue
  const isOverdue = request.schedule_date && new Date(request.schedule_date) < new Date() && !request.close_date

  // Priority colors
  const priorityColors: Record<string, { bg: string; text: string; label: string }> = {
    '0': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Low' },
    '1': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Medium' },
    '2': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
    '3': { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent' },
  }

  const priority = priorityColors[request.priority] || priorityColors['1']

  // Request type badge
  const requestTypeBadge = request.request_type === 'preventive' ? (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
      <Calendar className="h-3 w-3 mr-1" />
      Preventive
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
      <Wrench className="h-3 w-3 mr-1" />
      Corrective
    </span>
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move ${
        isOverdue ? 'border-2 border-red-500' : 'border border-gray-200'
      }`}
    >
      <Link href={`/requests/${request.id}`}>
        <div className="p-4">
          {/* Overdue indicator */}
          {isOverdue && (
            <div className="flex items-center space-x-1 text-red-600 text-xs font-medium mb-2">
              <AlertCircle className="h-4 w-4" />
              <span>OVERDUE</span>
            </div>
          )}

          {/* Title */}
          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {request.name}
          </h4>

          {/* Equipment name */}
          {request.equipment && (
            <p className="text-sm text-gray-600 mb-3">
              Equipment: {request.equipment.name || `ID: ${request.equipment_id}`}
            </p>
          )}

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-3">
            {requestTypeBadge}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.text}`}>
              {priority.label}
            </span>
          </div>

          {/* Scheduled date for preventive */}
          {request.schedule_date && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
              <Clock className="h-3 w-3" />
              <span>
                Scheduled: {new Date(request.schedule_date).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Assigned technician */}
          {request.technician_id && (
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-gray-600">
                Assigned to technician #{request.technician_id}
              </span>
            </div>
          )}

          {/* Duration if completed */}
          {request.duration && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
              <Clock className="h-3 w-3" />
              <span>{request.duration} hours</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

