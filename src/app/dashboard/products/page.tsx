"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BoxIcon, ChevronDown, ChevronUp, Edit, Filter, MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/dialog"

// Mock data for products
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones XZ-400",
    sku: "WH-XZ400-BLK",
    category: "Electronics",
    inventory: "Main Warehouse",
    quantity: 45,
    price: "$129.99",
    status: "In Stock",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    sku: "FRN-CHR-ERG1",
    category: "Furniture",
    inventory: "East Coast Distribution",
    quantity: 12,
    price: "$249.99",
    status: "In Stock",
  },
  {
    id: "3",
    name: "Smartphone Case X12",
    sku: "ACC-CSE-X12",
    category: "Accessories",
    inventory: "Main Warehouse",
    quantity: 3,
    price: "$24.99",
    status: "Low Stock",
  },
  {
    id: "4",
    name: 'Ultra HD Smart TV 55"',
    sku: "TV-UHD-55S",
    category: "Electronics",
    inventory: "West Coast Storage",
    quantity: 8,
    price: "$699.99",
    status: "In Stock",
  },
  {
    id: "5",
    name: "Bluetooth Speaker Waterproof",
    sku: "SPK-BT-WP20",
    category: "Electronics",
    inventory: "Main Warehouse",
    quantity: 0,
    price: "$79.99",
    status: "Out of Stock",
  },
  {
    id: "6",
    name: "Fitness Tracker Pro",
    sku: "WBL-FIT-PRO3",
    category: "Wearables",
    inventory: "East Coast Distribution",
    quantity: 22,
    price: "$89.99",
    status: "In Stock",
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    sku: "ACC-CHRG-WL1",
    category: "Accessories",
    inventory: "Main Warehouse",
    quantity: 34,
    price: "$39.99",
    status: "In Stock",
  },
  {
    id: "8",
    name: "Mechanical Keyboard RGB",
    sku: "PC-KB-MECH1",
    category: "Electronics",
    inventory: "West Coast Storage",
    quantity: 15,
    price: "$129.99",
    status: "In Stock",
  },
  {
    id: "9",
    name: "Wireless Gaming Mouse",
    sku: "PC-MS-GM1",
    category: "Electronics",
    inventory: "Main Warehouse",
    quantity: 7,
    price: "$59.99",
    status: "Low Stock",
  },
  {
    id: "10",
    name: "External SSD 1TB",
    sku: "PC-SSD-1TB",
    category: "Electronics",
    inventory: "East Coast Distribution",
    quantity: 0,
    price: "$149.99",
    status: "Out of Stock",
  },
  {
    id: "11",
    name: "Laptop Stand Adjustable",
    sku: "ACC-LPT-STD1",
    category: "Accessories",
    inventory: "Main Warehouse",
    quantity: 28,
    price: "$34.99",
    status: "In Stock",
  },
  {
    id: "12",
    name: "Noise Cancelling Earbuds",
    sku: "AUD-EAR-NC1",
    category: "Electronics",
    inventory: "West Coast Storage",
    quantity: 19,
    price: "$89.99",
    status: "In Stock",
  },
  {
    id: "13",
    name: "Smart Home Hub",
    sku: "SMT-HUB-V2",
    category: "Smart Home",
    inventory: "Main Warehouse",
    quantity: 5,
    price: "$129.99",
    status: "Low Stock",
  },
  {
    id: "14",
    name: "Wireless Security Camera",
    sku: "SMT-CAM-WL1",
    category: "Smart Home",
    inventory: "East Coast Distribution",
    quantity: 11,
    price: "$79.99",
    status: "In Stock",
  },
  {
    id: "15",
    name: "Smart Thermostat",
    sku: "SMT-THERM-V3",
    category: "Smart Home",
    inventory: "West Coast Storage",
    quantity: 0,
    price: "$149.99",
    status: "Out of Stock",
  },
]

// Extract unique categories
const categories = Array.from(new Set(mockProducts.map((product) => product.category)))

type SortField = "name" | "sku" | "category" | "inventory" | "quantity" | "price" | "status"
type SortDirection = "asc" | "desc"

export default function ProductsPage() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState(mockProducts)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory ? product.category === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle special cases for sorting
    if (sortField === "price") {
      // Remove $ and convert to number
      aValue = Number.parseFloat(a.price.replace(/[$,]/g, ""))
      bValue = Number.parseFloat(b.price.replace(/[$,]/g, ""))
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)

  // Reset to first page when search query or category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))
    setProductToDelete(null)
    setDeleteDialogOpen(false)
  }

  const openDeleteDialog = (id: string) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-indigo-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-indigo-600" />
    )
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
    setShowCategoryFilter(false)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {selectedCategory ? `${selectedCategory} Products` : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Manage your product catalog and inventory levels</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Category filter */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            >
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              {selectedCategory || "Category"}
              {selectedCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCategory(null)
                  }}
                  className="ml-2 rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              )}
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </button>
            {showCategoryFilter && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        selectedCategory === category
                          ? "bg-indigo-100 text-indigo-900"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewType("grid")}
              className={`relative inline-flex items-center rounded-l-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                viewType === "grid"
                  ? "bg-indigo-50 text-indigo-600 z-10 border-indigo-500"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="sr-only">Grid view</span>
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewType("list")}
              className={`relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                viewType === "list"
                  ? "bg-indigo-50 text-indigo-600 z-10 border-indigo-500"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="sr-only">List view</span>
              List
            </button>
          </div>
        </div>
      </div>

      {/* Category badge if selected */}
      {selectedCategory && (
        <div className="mb-4">
          <div className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
            <span>Category: {selectedCategory}</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-2 rounded-full bg-indigo-200 p-1 hover:bg-indigo-300"
            >
              <X className="h-3 w-3 text-indigo-600" />
              <span className="sr-only">Remove filter</span>
            </button>
          </div>
        </div>
      )}

      {/* Product display */}
      {viewType === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={openDeleteDialog} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Product</span>
                    {renderSortIcon("name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("sku")}
                >
                  <div className="flex items-center space-x-1">
                    <span>SKU</span>
                    {renderSortIcon("sku")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    {renderSortIcon("category")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("inventory")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Inventory</span>
                    {renderSortIcon("inventory")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("quantity")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Quantity</span>
                    {renderSortIcon("quantity")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    {renderSortIcon("price")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {renderSortIcon("status")}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentItems.map((product) => (
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
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.inventory}</td>
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
                        href={`/dashboard/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button onClick={() => openDeleteDialog(product.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <BoxIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCategory
              ? `No products found in the ${selectedCategory} category.`
              : "Get started by creating a new product."}
          </p>
          <div className="mt-6">
            {selectedCategory ? (
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Clear Filter
              </button>
            ) : (
              <Link
                href="/dashboard/products/new"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of{" "}
              <span className="font-medium">{filteredProducts.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => productToDelete && handleDeleteProduct(productToDelete)}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

function ProductCard({
  product,
  onDelete,
}: {
  product: (typeof mockProducts)[0]
  onDelete: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <BoxIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-0 mt-8 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-10">
                <div className="py-1">
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      onDelete(product.id)
                      setMenuOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Price</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{product.price}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Quantity</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{product.quantity}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{product.category}</span>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              product.status === "In Stock"
                ? "bg-green-100 text-green-800"
                : product.status === "Low Stock"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {product.status}
          </span>
        </div>

        <div className="mt-4 flex space-x-2">
          <Link
            href={`/dashboard/products/${product.id}`}
            className="flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View Details
          </Link>
          <Link
            href={`/dashboard/products/${product.id}/edit`}
            className="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  )
}
