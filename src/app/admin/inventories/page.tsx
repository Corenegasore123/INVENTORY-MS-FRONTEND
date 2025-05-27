"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { Inventory } from "@/types"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"

export default function AdminInventoriesPage() {
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const data = await apiClient.getAllInventories()
        setInventories(data)
      } catch (error) {
        console.error("Failed to fetch inventories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventories()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading inventories...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Inventories</h1>
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
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventories.map((inventory) => (
            <Card key={inventory.id}>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{inventory.name}</h3>
                <p className="text-gray-600">{inventory.location}</p>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>{inventory.products?.length || 0} products</p>
                <p>Created: {new Date(inventory.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
