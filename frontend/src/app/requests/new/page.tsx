'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Wrench, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function NewRequestPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    equipment_id: '',
    request_type: 'corrective',
    priority: '1',
    stage_id: '',
    schedule_date: '',
  })

  // Fetch equipment for dropdown
  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => api.getEquipment(true),
  })

  // Fetch stages for dropdown
  const { data: stages = [] } = useQuery({
    queryKey: ['stages'],
    queryFn: () => api.getStages(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
      router.push('/requests')
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to create request')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Prepare data
    const submitData: any = {
      name: formData.name,
      description: formData.description,
      equipment_id: parseInt(formData.equipment_id),
      request_type: formData.request_type,
      priority: formData.priority, // Keep as string
    }

    // Add stage_id if selected
    if (formData.stage_id) {
      submitData.stage_id = parseInt(formData.stage_id)
    } else if (stages.length > 0) {
      // Default to first stage if not selected
      submitData.stage_id = stages[0].id
    }

    // Add schedule_date if provided
    if (formData.schedule_date) {
      submitData.schedule_date = formData.schedule_date
    }

    createMutation.mutate(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/requests" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Wrench className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">New Maintenance Request</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Request Title *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="e.g., CNC Machine - Coolant leak"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="Describe the issue or maintenance needed..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="equipment_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment *
                </label>
                <select
                  id="equipment_id"
                  name="equipment_id"
                  required
                  value={formData.equipment_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select equipment...</option>
                  {equipment.map((eq: any) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="request_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type *
                </label>
                <select
                  id="request_type"
                  name="request_type"
                  value={formData.request_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="corrective">🔧 Corrective (Fix Issue)</option>
                  <option value="preventive">📅 Preventive (Scheduled)</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="0">Low</option>
                  <option value="1">Medium</option>
                  <option value="2">High</option>
                  <option value="3">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="stage_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Stage
                </label>
                <select
                  id="stage_id"
                  name="stage_id"
                  value={formData.stage_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Default (First Stage)</option>
                  {stages.map((stage: any) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.request_type === 'preventive' && (
                <div className="md:col-span-2">
                  <label htmlFor="schedule_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    id="schedule_date"
                    name="schedule_date"
                    value={formData.schedule_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/requests"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}


