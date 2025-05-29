"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { Inventory, InventoryDTO } from "@/types"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Modal from "@/components/ui/Modal"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"
import { useRecentActivity } from "@/hooks/useRecentActivity"

export default function InventoriesPage() {
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()
  const { addActivity } = useRecentActivity()
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null)
  const [formData, setFormData] = useState<InventoryDTO>({
    name: "",
    location: "",
  })

  useEffect(() => {
    fetchInventories()
  }, [])

  const fetchInventories = async () => {
    try {
      const data = await apiClient.getInventories()
      setInventories(data)
    } catch (error) {
      console.error("Failed to fetch inventories:", error)
      showToast("Failed to load inventories", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingInventory) {
        await apiClient.updateInventory(editingInventory.id, formData)
        showToast("Inventory updated successfully!", "success")
        addActivity({
          type: "inventory_updated",
          title: "Inventory Updated",
          description: `Updated inventory "${formData.name}"`,
          icon: "📝",
          color: "blue",
        })
      } else {
        await apiClient.createInventory(formData)
        showToast("Inventory created successfully!", "success")
        addActivity({
          type: "inventory_created",
          title: "New Inventory Created",
          description: `Created inventory "${formData.name}" at ${formData.location}`,
          icon: "📦",
          color: "green",
        })
      }
      setIsModalOpen(false)
      setEditingInventory(null)
      setFormData({ name: "", location: "" })
      fetchInventories()
    } catch (error) {
      console.error("Failed to save inventory:", error)
      showToast("Failed to save inventory", "error")
    }
  }

  const handleEdit = (inventory: Inventory) => {
    setEditingInventory(inventory)
    setFormData({
      name: inventory.name,
      location: inventory.location,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this inventory?")) {
      try {
        await apiClient.deleteInventory(id)
        showToast("Inventory deleted successfully!", "success")
        fetchInventories()
      } catch (error) {
        console.error("Failed to delete inventory:", error)
        showToast("Failed to delete inventory", "error")
      }
    }
  }

  const openCreateModal = () => {
    setEditingInventory(null)
    setFormData({ name: "", location: "" })
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventories...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Inventories</h1>
            <p className="text-gray-600 mt-1">Manage your inventory locations and track your products</p>
          </div>
          <div className="flex space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span>Grid</span>
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span>List</span>
                </div>
              </button>
            </div>
            <Button onClick={openCreateModal}>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Inventory</span>
              </div>
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventories.map((inventory) => (
              <Card key={inventory.id} hover>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">{inventory.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{inventory.name}</h3>
                      <p className="text-gray-600">{inventory.location}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(inventory)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                      title="Edit inventory"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(inventory.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="Delete inventory"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p className="flex items-center space-x-2">
                    <span>📦</span>
                    <span>{inventory.products?.length || 0} products</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>Created: {new Date(inventory.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/dashboard/inventories/${inventory.id}`)}
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventories.map((inventory) => (
                    <tr key={inventory.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{inventory.name.charAt(0)}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{inventory.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inventory.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {inventory.products?.length || 0} items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inventory.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/inventories/${inventory.id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(inventory)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(inventory.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {inventories.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inventories found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first inventory location</p>
              <Button onClick={openCreateModal}>Create your first inventory</Button>
            </div>
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingInventory ? "Edit Inventory" : "Create New Inventory"}
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Inventory Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Main Warehouse"
              required
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., New York, NY"
              required
            />
            <div className="flex justify-end space-x-4 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingInventory ? "Update Inventory" : "Create Inventory"}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  )
}
