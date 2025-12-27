'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Wrench, Calendar, DollarSign, MapPin, Users, User, AlertCircle, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function EquipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const equipmentId = parseInt(params.id as string)

  // Fetch equipment details
  const { data: equipment, isLoading: equipmentLoading } = useQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => api.getEquipmentById(equipmentId),
  })

  // Fetch maintenance requests for this equipment
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['equipment-requests', equipmentId],
    queryFn: () => api.getEquipmentRequests(equipmentId),
  })

  // Fetch request count
  const { data: requestCount } = useQuery({
    queryKey: ['equipment-requests-count', equipmentId],
    queryFn: () => api.getEquipmentRequestsCount(equipmentId),
  })

  if (equipmentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading equipment...</p>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipment Not Found</h2>
          <Link href="/equipment" className="text-blue-600 hover:underline">
            Back to Equipment List
          </Link>
        </div>
      </div>
    )
  }

  const openRequests = requestCount?.count || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <Wrench className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{equipment.name}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Equipment Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Serial Number</p>
                  <p className="font-semibold text-gray-900">{equipment.serial_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-semibold text-gray-900">{equipment.model || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-semibold text-gray-900">{equipment.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {equipment.location || 'N/A'}
                  </p>
                </div>
                {equipment.purchase_date && (
                  <div>
                    <p className="text-sm text-gray-500">Purchase Date</p>
                    <p className="font-semibold text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(equipment.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {equipment.purchase_value && (
                  <div>
                    <p className="text-sm text-gray-500">Purchase Value</p>
                    <p className="font-semibold text-gray-900 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${equipment.purchase_value.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance Requests List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Maintenance Requests</h2>
                <Link
                  href={`/requests/new?equipment_id=${equipmentId}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Request</span>
                </Link>
              </div>

              {requestsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No maintenance requests found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((request: any) => (
                    <Link
                      key={request.id}
                      href={`/requests/${request.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{request.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Smart Buttons */}
          <div className="space-y-6">
            {/* Maintenance Requests Smart Button */}
            <Link
              href={`/requests?equipment_id=${equipmentId}`}
              className="block bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Open Requests</p>
                  <p className="text-3xl font-bold text-blue-600">{openRequests}</p>
                </div>
                <Wrench className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mt-2">View all maintenance requests</p>
            </Link>

            {/* Team Info */}
            {equipment.maintenance_team_id && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Maintenance Team</h3>
                </div>
                <p className="text-sm text-gray-600">Team ID: {equipment.maintenance_team_id}</p>
              </div>
            )}

            {/* Technician Info */}
            {equipment.technician_id && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Assigned Technician</h3>
                </div>
                <p className="text-sm text-gray-600">Technician ID: {equipment.technician_id}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

