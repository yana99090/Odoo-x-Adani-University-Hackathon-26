'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Wrench, Package, Users, BarChart3, Calendar, Settings, LogOut, User, ChevronDown, Bell, Search } from 'lucide-react'
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
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-900">GearGuard</h1>
                <p className="text-xs text-secondary-500">Maintenance Hub</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link href="/kanban" className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Kanban
              </Link>
              <Link href="/calendar" className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Calendar
              </Link>
              <Link href="/analytics" className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Analytics
              </Link>
              <Link href="/equipment" className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Equipment
              </Link>
              <Link href="/requests" className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Requests
              </Link>
              <Link href="/teams" className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Teams
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:bg-secondary-100 rounded-lg px-3 py-2 transition-colors"
                >
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full ring-2 ring-primary-500"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ring-2 ring-primary-500">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-secondary-900 hidden md:block">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-secondary-500 hidden md:block" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-medium border border-secondary-200 py-2 z-50 animate-slide-down">
                    <div className="px-4 py-3 border-b border-secondary-200">
                      <p className="text-sm font-semibold text-secondary-900">{user?.name}</p>
                      <p className="text-xs text-secondary-500 mt-1">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    {user?.is_admin && (
                      <Link
                        href="/users"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Manage Users
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2 border-secondary-200" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        logout()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-lg text-secondary-600">
            Here's what's happening with your equipment today
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Equipment"
              value={stats.total_equipment}
              icon={<Package className="h-6 w-6" />}
              color="primary"
            />
            <StatCard
              title="Active Equipment"
              value={stats.active_equipment}
              icon={<Package className="h-6 w-6" />}
              color="success"
            />
            <StatCard
              title="Open Requests"
              value={stats.open_requests}
              icon={<Wrench className="h-6 w-6" />}
              color="warning"
            />
            <StatCard
              title="Urgent Requests"
              value={stats.urgent_requests}
              icon={<Wrench className="h-6 w-6" />}
              color="danger"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              title="Maintenance Requests"
              description="View and manage all maintenance requests"
              icon={<Wrench className="h-10 w-10" />}
              href="/requests"
              color="primary"
            />
            <ActionCard
              title="Equipment"
              description="Manage your equipment and assets"
              icon={<Package className="h-10 w-10" />}
              href="/equipment"
              color="success"
            />
            <ActionCard
              title="Teams"
              description="Organize maintenance teams"
              icon={<Users className="h-10 w-10" />}
              href="/teams"
              color="accent"
            />
            <ActionCard
              title="Calendar"
              description="Schedule preventive maintenance"
              icon={<Calendar className="h-10 w-10" />}
              href="/calendar"
              color="warning"
            />
            <ActionCard
              title="Reports"
              description="View analytics and insights"
              icon={<BarChart3 className="h-10 w-10" />}
              href="/analytics"
              color="primary"
            />
            <ActionCard
              title="Settings"
              description="Configure categories and stages"
              icon={<Settings className="h-10 w-10" />}
              href="/settings"
              color="secondary"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-500',
      text: 'text-primary-600',
      lightBg: 'bg-primary-50',
    },
    success: {
      bg: 'bg-success-500',
      text: 'text-success-600',
      lightBg: 'bg-success-50',
    },
    warning: {
      bg: 'bg-warning-500',
      text: 'text-warning-600',
      lightBg: 'bg-warning-50',
    },
    danger: {
      bg: 'bg-danger-500',
      text: 'text-danger-600',
      lightBg: 'bg-danger-50',
    },
  }

  const colors = colorClasses[color as keyof typeof colorClasses]

  return (
    <div className="card card-hover group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-secondary-900">{value}</p>
        </div>
        <div className={`${colors.lightBg} ${colors.text} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function ActionCard({ title, description, icon, href, color }: any) {
  const colorClasses = {
    primary: {
      gradient: 'from-primary-500 to-primary-600',
      hover: 'group-hover:from-primary-600 group-hover:to-primary-700',
    },
    success: {
      gradient: 'from-success-500 to-success-600',
      hover: 'group-hover:from-success-600 group-hover:to-success-700',
    },
    accent: {
      gradient: 'from-accent-500 to-accent-600',
      hover: 'group-hover:from-accent-600 group-hover:to-accent-700',
    },
    warning: {
      gradient: 'from-warning-500 to-warning-600',
      hover: 'group-hover:from-warning-600 group-hover:to-warning-700',
    },
    secondary: {
      gradient: 'from-secondary-500 to-secondary-600',
      hover: 'group-hover:from-secondary-600 group-hover:to-secondary-700',
    },
  }

  const colors = colorClasses[color as keyof typeof colorClasses]

  return (
    <Link href={href}>
      <div className="card card-hover group cursor-pointer">
        <div className={`bg-gradient-to-br ${colors.gradient} ${colors.hover} text-white p-4 rounded-xl inline-flex items-center justify-center mb-4 transition-all duration-200 group-hover:scale-110`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
        <p className="text-secondary-600 text-sm">{description}</p>
      </div>
    </Link>
  )
}

