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

export default function InventoriesPage() {
  const router = useRouter()
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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingInventory) {
        await apiClient.updateInventory(editingInventory.id, formData)
      } else {
        await apiClient.createInventory(formData)
      }
      setIsModalOpen(false)
      setEditingInventory(null)
      setFormData({ name: "", location: "" })
      fetchInventories()
    } catch (error) {
      console.error("Failed to save inventory:", error)
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
        fetchInventories()
      } catch (error) {
        console.error("Failed to delete inventory:", error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingInventory(null)
    setFormData({ name: "", location: "" })
    setIsModalOpen(true)
  }

  if (loading) {
    return <div className="text-center py-8">Loading inventories...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Inventories</h1>
        <div className="flex space-x-4">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === "grid" ? "bg-white shadow" : ""}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === "list" ? "bg-white shadow" : ""}`}
            >
              List
            </button>
          </div>
          <Button onClick={openCreateModal}>Add Inventory</Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventories.map((inventory) => (
            <Card key={inventory.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{inventory.name}</h3>
                  <p className="text-gray-600">{inventory.location}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(inventory)} className="text-blue-600 hover:text-blue-800">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(inventory.id)} className="text-red-600 hover:text-red-800">
                    🗑️
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                <p>{inventory.products?.length || 0} products</p>
                <p>Created: {new Date(inventory.createdAt).toLocaleDateString()}</p>
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
                    Name
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
                  <tr key={inventory.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inventory.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inventory.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inventory.products?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inventory.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/inventories/${inventory.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button onClick={() => handleEdit(inventory)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(inventory.id)} className="text-red-600 hover:text-red-900">
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
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No inventories found</p>
            <Button onClick={openCreateModal}>Create your first inventory</Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInventory ? "Edit Inventory" : "Create Inventory"}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingInventory ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
