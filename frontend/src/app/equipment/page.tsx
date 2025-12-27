'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Wrench, Plus, ArrowLeft, Search } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch equipment
  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => api.getEquipment(true),
  })

  // Filter equipment by search term
  const filteredEquipment = equipment.filter((eq: any) =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.serial_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.model?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
              </div>
            </div>
            <Link
              href="/equipment/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Equipment</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment by name, serial number, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Equipment Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading equipment...</p>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No equipment found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((eq: any) => (
              <Link
                key={eq.id}
                href={`/equipment/${eq.id}`}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{eq.name}</h3>
                    {eq.serial_no && (
                      <p className="text-sm text-gray-500">SN: {eq.serial_no}</p>
                    )}
                  </div>
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>

                <div className="space-y-2">
                  {eq.model && (
                    <div>
                      <p className="text-xs text-gray-500">Model</p>
                      <p className="text-sm font-medium text-gray-900">{eq.model}</p>
                    </div>
                  )}
                  {eq.department && (
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm font-medium text-gray-900">{eq.department}</p>
                    </div>
                  )}
                  {eq.location && (
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{eq.location}</p>
                    </div>
                  )}
                </div>

                {eq.is_scrap && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Scrapped
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

