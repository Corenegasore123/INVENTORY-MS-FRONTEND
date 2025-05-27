"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { Inventory, Product } from "@/types"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"

export default function AdminInventoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [inventory, setInventory] = useState<Inventory | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventoryDetails = async () => {
      try {
        const [inventoriesData, productsData] = await Promise.all([
          apiClient.getAllInventories(),
          apiClient.getAllProducts(),
        ])

        const currentInventory = inventoriesData.find((inv) => inv.id === Number(params.id))
        const inventoryProducts = productsData.filter((product) => product.inventoryId === Number(params.id))

        setInventory(currentInventory || null)
        setProducts(inventoryProducts)
      } catch (error) {
        console.error("Failed to fetch inventory details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchInventoryDetails()
    }
  }, [params.id])

  if (loading) {
    return <div className="text-center py-8">Loading inventory details...</div>
  }

  if (!inventory) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Inventory not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{inventory.name}</h1>
          <p className="text-gray-600">{inventory.location}</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Back to Inventories
        </Button>
      </div>

      {/* Inventory Information */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Inventory Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{inventory.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <p className="text-gray-900">{inventory.location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Products</label>
            <p className="text-gray-900">{products.length}</p>
          </div>
        </div>
      </Card>

      {/* Products in this Inventory */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Products in this Inventory</h2>
        </div>

        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.quantity < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/products/${product.id}`)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No products in this inventory yet</p>
          </div>
        )}
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              ${products.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{products.filter((p) => p.quantity < 10).length}</p>
            <p className="text-sm text-gray-600">Low Stock Items</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
