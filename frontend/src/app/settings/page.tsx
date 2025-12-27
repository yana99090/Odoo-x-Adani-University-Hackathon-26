'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowLeft, Settings as SettingsIcon, Plus, Trash2, Edit } from 'lucide-react'
import { api } from '@/lib/api'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'categories' | 'stages'>('categories')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
  })

  // Fetch stages
  const { data: stages = [], isLoading: stagesLoading } = useQuery({
    queryKey: ['stages'],
    queryFn: () => api.getStages(),
  })

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (category: any) => api.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setShowCreateModal(false)
    },
  })

  // Create stage mutation
  const createStageMutation = useMutation({
    mutationFn: (stage: any) => api.createStage(stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages'] })
      setShowCreateModal(false)
    },
  })

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setEditingItem(null)
    },
  })

  // Update stage mutation
  const updateStageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateStage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages'] })
      setEditingItem(null)
    },
  })

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => api.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  // Delete stage mutation
  const deleteStageMutation = useMutation({
    mutationFn: (id: number) => api.deleteStage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages'] })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (activeTab === 'categories') {
      const categoryData = {
        name: formData.get('name') as string,
        color: parseInt(formData.get('color') as string),
        note: formData.get('note') as string,
      }

      if (editingItem) {
        updateCategoryMutation.mutate({ id: editingItem.id, data: categoryData })
      } else {
        createCategoryMutation.mutate(categoryData)
      }
    } else {
      const stageData = {
        name: formData.get('name') as string,
        sequence: parseInt(formData.get('sequence') as string),
        fold: formData.get('fold') === 'true',
        done: formData.get('done') === 'true',
        is_scrap: formData.get('is_scrap') === 'true',
        description: formData.get('description') as string,
      }

      if (editingItem) {
        updateStageMutation.mutate({ id: editingItem.id, data: stageData })
      } else {
        createStageMutation.mutate(stageData)
      }
    }
  }

  const isLoading = activeTab === 'categories' ? categoriesLoading : stagesLoading
  const items = activeTab === 'categories' ? categories : stages

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
                <SettingsIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add {activeTab === 'categories' ? 'Category' : 'Stage'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'categories'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Equipment Categories
              </button>
              <button
                onClick={() => setActiveTab('stages')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'stages'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Maintenance Stages
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <SettingsIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === 'categories' ? 'categories' : 'stages'} yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first {activeTab === 'categories' ? 'category' : 'stage'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create {activeTab === 'categories' ? 'Category' : 'Stage'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  {activeTab === 'categories' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Color
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sequence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    {activeTab === 'categories' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: getColorHex(item.color) }}
                          ></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{item.note || '-'}</div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.sequence}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {item.done && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Done
                              </span>
                            )}
                            {item.fold && (
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                Folded
                              </span>
                            )}
                            {item.is_scrap && (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                Scrap
                              </span>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete this ${activeTab === 'categories' ? 'category' : 'stage'}?`)) {
                            if (activeTab === 'categories') {
                              deleteCategoryMutation.mutate(item.id)
                            } else {
                              deleteStageMutation.mutate(item.id)
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit' : 'Create'} {activeTab === 'categories' ? 'Category' : 'Stage'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={editingItem?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {activeTab === 'categories' ? (
                <>
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <select
                      id="color"
                      name="color"
                      defaultValue={editingItem?.color || 0}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="0">Blue</option>
                      <option value="1">Red</option>
                      <option value="2">Green</option>
                      <option value="3">Yellow</option>
                      <option value="4">Purple</option>
                      <option value="5">Orange</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                      Note
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      defaultValue={editingItem?.note}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="sequence" className="block text-sm font-medium text-gray-700 mb-2">
                      Sequence *
                    </label>
                    <input
                      type="number"
                      id="sequence"
                      name="sequence"
                      required
                      defaultValue={editingItem?.sequence || 1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      defaultValue={editingItem?.description}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="fold"
                        value="true"
                        defaultChecked={editingItem?.fold}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Fold in Kanban</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="done"
                        value="true"
                        defaultChecked={editingItem?.done}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Mark as Done</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_scrap"
                        value="true"
                        defaultChecked={editingItem?.is_scrap}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Scrap Stage</span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function getColorHex(color: number): string {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#eab308', '#a855f7', '#f97316']
  return colors[color] || colors[0]
}


