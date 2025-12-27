'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Wrench, ArrowLeft, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AnalyticsPage() {
  // Fetch all data
  const { data: requests = [] } = useQuery({
    queryKey: ['requests'],
    queryFn: () => api.getRequests(),
  })

  const { data: stages = [] } = useQuery({
    queryKey: ['stages'],
    queryFn: () => api.getStages(),
  })

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.getTeams(),
  })

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => api.getEquipment(false),
  })

  // Calculate analytics
  const analytics = useMemo(() => {
    // Requests by stage
    const byStage = stages.map((stage: any) => ({
      name: stage.name,
      count: requests.filter((r: any) => r.stage_id === stage.id).length,
    }))

    // Requests by priority
    const priorityMap: Record<string, string> = {
      '0': 'Low',
      '1': 'Medium',
      '2': 'High',
      '3': 'Urgent',
    }
    const byPriority = Object.entries(priorityMap).map(([key, label]) => ({
      name: label,
      count: requests.filter((r: any) => r.priority === key).length,
    }))

    // Requests by type
    const byType = [
      { name: 'Preventive', count: requests.filter((r: any) => r.request_type === 'preventive').length },
      { name: 'Corrective', count: requests.filter((r: any) => r.request_type === 'corrective').length },
    ]

    // Requests by team
    const byTeam = teams.map((team: any) => ({
      name: team.name,
      count: requests.filter((r: any) => r.maintenance_team_id === team.id).length,
    }))

    // Monthly trend (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      const monthRequests = requests.filter((r: any) => {
        const createdDate = new Date(r.created_at)
        return createdDate.getMonth() === date.getMonth() && createdDate.getFullYear() === date.getFullYear()
      })

      monthlyTrend.push({
        month: monthName,
        total: monthRequests.length,
        preventive: monthRequests.filter((r: any) => r.request_type === 'preventive').length,
        corrective: monthRequests.filter((r: any) => r.request_type === 'corrective').length,
      })
    }

    // Average duration by priority
    const avgDurationByPriority = Object.entries(priorityMap).map(([key, label]) => {
      const priorityRequests = requests.filter((r: any) => r.priority === key && r.duration)
      const avgDuration = priorityRequests.length > 0
        ? priorityRequests.reduce((sum: number, r: any) => sum + (r.duration || 0), 0) / priorityRequests.length
        : 0
      return {
        name: label,
        avgDuration: Math.round(avgDuration * 10) / 10,
      }
    })

    // KPIs
    const totalRequests = requests.length
    const openRequests = requests.filter((r: any) => {
      const stage = stages.find((s: any) => s.id === r.stage_id)
      return stage && !stage.done
    }).length
    const completedRequests = requests.filter((r: any) => {
      const stage = stages.find((s: any) => s.id === r.stage_id)
      return stage && stage.done
    }).length
    const overdueRequests = requests.filter((r: any) => {
      if (!r.schedule_date || r.close_date) return false
      return new Date(r.schedule_date) < new Date()
    }).length

    return {
      byStage,
      byPriority,
      byType,
      byTeam,
      monthlyTrend,
      avgDurationByPriority,
      kpis: {
        totalRequests,
        openRequests,
        completedRequests,
        overdueRequests,
      },
    }
  }, [requests, stages, teams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.kpis.totalRequests}</p>
              </div>
              <Wrench className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Requests</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.kpis.openRequests}</p>
              </div>
              <Clock className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-green-600">{analytics.kpis.completedRequests}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{analytics.kpis.overdueRequests}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Requests by Stage */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Requests by Stage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.byStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Requests by Priority */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Requests by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.byPriority}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.byPriority.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Requests by Type */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Requests by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.byType.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Requests by Team */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Requests by Team</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.byTeam}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" strokeWidth={2} />
              <Line type="monotone" dataKey="preventive" stroke="#10b981" name="Preventive" strokeWidth={2} />
              <Line type="monotone" dataKey="corrective" stroke="#f59e0b" name="Corrective" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Average Duration by Priority */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Average Duration by Priority (hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.avgDurationByPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDuration" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  )
}

