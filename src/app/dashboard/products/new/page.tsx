"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

// Mock data for inventories
const mockInventories = [
  { id: "1", name: "Main Warehouse" },
  { id: "2", name: "East Coast Distribution" },
  { id: "3", name: "West Coast Storage" },
]

// Mock data for categories
const mockCategories = ["Electronics", "Furniture", "Accessories", "Wearables", "Home Goods", "Office Supplies"]

export default function NewProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSaving, setIsSaving] = useState(false)
  const [inventories, setInventories] = useState(mockInventories)
  const [categories, setCategories] = useState(mockCategories)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    inventoryId: "",
    quantity: 0,
    price: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check if inventoryId is provided in the URL
  useEffect(() => {
    const inventoryId = searchParams.get("inventoryId")
    if (inventoryId) {
      setFormData((prev) => ({
        ...prev,
        inventoryId,
      }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.inventoryId) {
      newErrors.inventoryId = "Inventory is required"
    }
    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative"
    }
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than zero"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSaving(true)
    // In a real app, you would call your API to create the product
    // Example: await fetch('/api/products', { method: 'POST', body: JSON.stringify(formData) })
    setTimeout(() => {
      setIsSaving(false)
      router.push("/dashboard/products")
    }, 1000)
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/products"
          className="mb-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Product</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new product to your inventory.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                id="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.sku ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.category ? "border-red-300" : "border-gray-300"
                } bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="inventoryId" className="block text-sm font-medium text-gray-700">
                Inventory
              </label>
              <select
                id="inventoryId"
                name="inventoryId"
                value={formData.inventoryId}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.inventoryId ? "border-red-300" : "border-gray-300"
                } bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              >
                <option value="">Select an inventory</option>
                {inventories.map((inventory) => (
                  <option key={inventory.id} value={inventory.id}>
                    {inventory.name}
                  </option>
                ))}
              </select>
              {errors.inventoryId && <p className="mt-1 text-sm text-red-600">{errors.inventoryId}</p>}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.quantity ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.price ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href="/dashboard/products"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
