"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { Product, ProductDTO, Inventory } from "@/types"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Modal from "@/components/ui/Modal"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductDTO>({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    inventoryId: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsData, inventoriesData] = await Promise.all([apiClient.getProducts(), apiClient.getInventories()])
      setProducts(productsData)
      setInventories(inventoriesData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await apiClient.updateProduct(editingProduct.id, formData)
      } else {
        await apiClient.createProduct(formData)
      }
      setIsModalOpen(false)
      setEditingProduct(null)
      setFormData({ name: "", price: 0, quantity: 0, description: "", inventoryId: 0 })
      fetchData()
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      inventoryId: product.inventoryId,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await apiClient.deleteProduct(id)
        fetchData()
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({ name: "", price: 0, quantity: 0, description: "", inventoryId: 0 })
    setIsModalOpen(true)
  }

  const getInventoryName = (inventoryId: number) => {
    const inventory = inventories.find((inv) => inv.id === inventoryId)
    return inventory ? inventory.name : "Unknown"
  }

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
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
          <Button onClick={openCreateModal}>Add Product</Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span
                  className={`px-2 py-1 rounded ${
                    product.quantity < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.quantity} in stock
                </span>
                <span className="text-gray-500">{getInventoryName(product.inventoryId)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push(`/dashboard/products/${product.id}`)}
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
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getInventoryName(product.inventoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/products/${product.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
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

      {products.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No products found</p>
            <Button onClick={openCreateModal}>Create your first product</Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Create Product"}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
            required
          />
          <Input
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.inventoryId}
              onChange={(e) => setFormData({ ...formData, inventoryId: Number.parseInt(e.target.value) })}
              required
            >
              <option value={0}>Select an inventory</option>
              {inventories.map((inventory) => (
                <option key={inventory.id} value={inventory.id}>
                  {inventory.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingProduct ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
