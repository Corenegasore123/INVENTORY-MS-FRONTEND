"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { Product, Inventory } from "@/types"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"

export default function AdminProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [inventory, setInventory] = useState<Inventory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const [productsData, inventoriesData] = await Promise.all([
          apiClient.getAllProducts(),
          apiClient.getAllInventories(),
        ])

        const currentProduct = productsData.find((prod) => prod.id === Number(params.id))
        const productInventory = inventoriesData.find((inv) => inv.id === currentProduct?.inventoryId)

        setProduct(currentProduct || null)
        setInventory(productInventory || null)
      } catch (error) {
        console.error("Failed to fetch product details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProductDetails()
    }
  }, [params.id])

  if (loading) {
    return <div className="text-center py-8">Loading product details...</div>
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">${product.price}</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Back
        </Button>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Product Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{product.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <p className="text-gray-900">${product.price}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Stock</label>
              <p className="text-gray-900">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.quantity < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.quantity} units
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{product.description}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Inventory Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Name</label>
              <p className="text-gray-900">{inventory?.name || "Unknown"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <p className="text-gray-900">{inventory?.location || "Unknown"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
              <p className="text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-gray-900">{new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">${(product.price * product.quantity).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{product.quantity}</p>
            <p className="text-sm text-gray-600">Units Available</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p
              className={`text-2xl font-bold ${
                product.quantity < 10 ? "text-red-600" : product.quantity < 50 ? "text-yellow-600" : "text-green-600"
              }`}
            >
              {product.quantity < 10 ? "Low" : product.quantity < 50 ? "Medium" : "High"}
            </p>
            <p className="text-sm text-gray-600">Stock Level</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
