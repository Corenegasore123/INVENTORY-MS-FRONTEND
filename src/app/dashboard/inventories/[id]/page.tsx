"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BoxIcon, Edit, Package, Trash2 } from 'lucide-react'

// Mock data for a single inventory
const mockInventory = {
  id: "1",
  name: "Main Warehouse",
  location: "New York, NY",
  description: "Our primary storage facility for all products. Located in the heart of New York with easy access to major shipping routes.",
  productCount: 532,
  totalValue: "$125,430",
  status: "Active",
  lastUpdated: "2023-05-15T10:30:00Z",
}

// Mock data for products in this inventory
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones XZ-400",
    sku: "WH-XZ400-BLK",
    category: "Electronics",
    quantity: 45,
    price: "$129.99",
    status: "In Stock",
  },
  {
    id: "2",
    name: "Smartphone Case X12",
    sku: "ACC-CSE-X12",
    category: "Accessories",
    quantity: 3,
    price: "$24.99",
    status: "Low Stock",
  },
  {
    id: "3",
    name: "Bluetooth Speaker Waterproof",
    sku: "SPK-BT-WP20",
    category: "Electronics",
    quantity: 0,
    price: "$79.99",
    status: "Out of Stock",
  },
]

export default function InventoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [inventory, setInventory] = useState(mockInventory)
  const [products, setProducts] = useState(mockProducts)
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, you would fetch the inventory data based on the ID
  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    // In a real app, you would fetch data from your API
    // Example: fetch(`/api/inventories/${params.id}`)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this inventory?")) {
      // In a real app, you would call your API to delete the inventory
      router.push("/dashboard/inventories")
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
          href="/dashboard/inventories"
          className="mb-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventories
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{inventory.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{inventory.location}</p>
          </div>
          <div className="mt-4 flex space-x-3 sm:mt-0">
            <Link
              href={`/dashboard/inventories/${inventory.id}/edit`}
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

      {/* Inventory Details */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    inventory.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {inventory.status}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Products</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{inventory.productCount}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{inventory.totalValue}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(inventory.lastUpdated).toLocaleDateString()} at{" "}
                {new Date(inventory.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-sm text-gray-900">{inventory.description}</p>
          </div>
        </div>
      </div>

      {/* Products in this Inventory */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Products in this Inventory</h2>
          <Link
            href={`/dashboard/products/new?inventoryId=${inventory.id}`}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Product
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  SKU
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                        <BoxIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.category}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.quantity}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.price}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
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
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products in this inventory</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a product to this inventory.</p>
            <div className="mt-6">
              <Link
                href={`/dashboard/products/new?inventoryId=${inventory.id}`}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
