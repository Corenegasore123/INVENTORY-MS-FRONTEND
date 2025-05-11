"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BoxIcon, Edit, Package, Trash2 } from 'lucide-react'

// Mock data for a single product
const mockProduct = {
  id: "1",
  name: "Wireless Headphones XZ-400",
  sku: "WH-XZ400-BLK",
  description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and comfortable over-ear design.",
  category: "Electronics",
  inventoryId: "1",
  inventoryName: "Main Warehouse",
  quantity: 45,
  price: "$129.99",
  status: "In Stock",
  createdAt: "2023-01-15T10:30:00Z",
  updatedAt: "2023-05-15T10:30:00Z",
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(mockProduct)
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, you would fetch the product data based on the ID
  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    // In a real app, you would fetch data from your API
    // Example: fetch(`/api/products/${params.id}`)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      // In a real app, you would call your API to delete the product
      router.push("/dashboard/products")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    )
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
            <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
          <div className="mt-4 flex space-x-3 sm:mt-0">
            <Link
              href={`/dashboard/products/${product.id}/edit`}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <BoxIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-medium text-gray-900">{product.name}</h2>
              <p className="mt-1 text-sm text-gray-500">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    product.status === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : product.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{product.price}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{product.quantity}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Inventory</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <Link
                    href={`/dashboard/inventories/${product.inventoryId}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {product.inventoryName}
                  </Link>
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-sm text-gray-900">{product.description}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()} at{" "}
                  {new Date(product.createdAt).toLocaleTimeString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(product.updatedAt).toLocaleTimeString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Inventory Information */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Inventory Information</h2>
          <Link
            href={`/dashboard/inventories/${product.inventoryId}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Inventory
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{product.inventoryName}</h3>
                <p className="mt-1 text-sm text-gray-500">Current stock: {product.quantity} units</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative pt-1">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">Stock Level</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-indigo-600">
                      {product.quantity > 20 ? "Healthy" : product.quantity > 5 ? "Medium" : "Low"}
                    </span>
                  </div>
                </div>
                <div className="mb-4 flex h-2 overflow-hidden rounded bg-indigo-200 text-xs">
                  <div
                    style={{
                      width:
                        product.quantity > 50
                          ? "100%"
                          : product.quantity > 20
                            ? "75%"
                            : product.quantity > 5
                              ? "50%"
                              : "25%",
                    }}
                    className={`flex flex-col justify-center whitespace-nowrap rounded ${
                      product.quantity > 20
                        ? "bg-green-500"
                        : product.quantity > 5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
