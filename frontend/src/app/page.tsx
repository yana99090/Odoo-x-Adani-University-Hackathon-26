'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Wrench, Package, Users, BarChart3, Calendar, Settings, LogOut, User } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wrench className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">GearGuard</h1>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-4">
                <Link href="/kanban" className="text-gray-600 hover:text-gray-900">
                  Kanban
                </Link>
                <Link href="/calendar" className="text-gray-600 hover:text-gray-900">
                  Calendar
                </Link>
                <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
                  Analytics
                </Link>
                <Link href="/equipment" className="text-gray-600 hover:text-gray-900">
                  Equipment
                </Link>
                <Link href="/requests" className="text-gray-600 hover:text-gray-900">
                  Requests
                </Link>
                <Link href="/teams" className="text-gray-600 hover:text-gray-900">
                  Teams
                </Link>
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-3 border-l pl-6 relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                >
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    {user?.is_admin && (
                      <Link
                        href="/users"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Manage Users
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        logout()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to GearGuard
          </h2>
          <p className="text-xl text-gray-600">
            The Ultimate Maintenance Management System
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="Total Equipment"
              value={stats.total_equipment}
              icon={<Package className="h-8 w-8" />}
              color="blue"
            />
            <StatCard
              title="Active Equipment"
              value={stats.active_equipment}
              icon={<Package className="h-8 w-8" />}
              color="green"
            />
            <StatCard
              title="Open Requests"
              value={stats.open_requests}
              icon={<Wrench className="h-8 w-8" />}
              color="yellow"
            />
            <StatCard
              title="Urgent Requests"
              value={stats.urgent_requests}
              icon={<Wrench className="h-8 w-8" />}
              color="red"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Maintenance Requests"
            description="View and manage all maintenance requests"
            icon={<Wrench className="h-12 w-12" />}
            href="/requests"
            color="blue"
          />
          <ActionCard
            title="Equipment"
            description="Manage your equipment and assets"
            icon={<Package className="h-12 w-12" />}
            href="/equipment"
            color="green"
          />
          <ActionCard
            title="Teams"
            description="Organize maintenance teams"
            icon={<Users className="h-12 w-12" />}
            href="/teams"
            color="purple"
          />
          <ActionCard
            title="Calendar"
            description="Schedule preventive maintenance"
            icon={<Calendar className="h-12 w-12" />}
            href="/calendar"
            color="orange"
          />
          <ActionCard
            title="Reports"
            description="View analytics and insights"
            icon={<BarChart3 className="h-12 w-12" />}
            href="/analytics"
            color="indigo"
          />
          <ActionCard
            title="Settings"
            description="Configure categories and stages"
            icon={<Settings className="h-12 w-12" />}
            href="/settings"
            color="gray"
          />
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon, color }: any) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${colors[color as keyof typeof colors]} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function ActionCard({ title, description, icon, href, color }: any) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600',
    gray: 'from-gray-500 to-gray-600',
  }

  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer">
        <div className={`bg-gradient-to-r ${colors[color as keyof typeof colors]} text-white p-4 rounded-lg inline-block mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

