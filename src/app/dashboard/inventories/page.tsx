"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Edit, Filter, MoreHorizontal, Package, Plus, Search, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/dialog"
import { Pagination } from "@/components/ui/pagination"

// Mock data for inventories
const mockInventories = [
  {
    id: "1",
    name: "Main Warehouse",
    location: "New York, NY",
    productCount: 532,
    totalValue: "$125,430",
    status: "Active",
    lastUpdated: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    name: "East Coast Distribution",
    location: "Boston, MA",
    productCount: 328,
    totalValue: "$84,210",
    status: "Active",
    lastUpdated: "2023-05-12T14:45:00Z",
  },
  {
    id: "3",
    name: "West Coast Storage",
    location: "Los Angeles, CA",
    productCount: 421,
    totalValue: "$102,850",
    status: "Active",
    lastUpdated: "2023-05-10T09:15:00Z",
  },
  {
    id: "4",
    name: "South Facility",
    location: "Miami, FL",
    productCount: 215,
    totalValue: "$52,680",
    status: "Inactive",
    lastUpdated: "2023-04-28T16:20:00Z",
  },
  {
    id: "5",
    name: "Central Warehouse",
    location: "Chicago, IL",
    productCount: 378,
    totalValue: "$91,450",
    status: "Active",
    lastUpdated: "2023-05-08T11:10:00Z",
  },
  {
    id: "6",
    name: "Northwest Storage",
    location: "Seattle, WA",
    productCount: 289,
    totalValue: "$76,320",
    status: "Active",
    lastUpdated: "2023-05-05T08:45:00Z",
  },
  {
    id: "7",
    name: "Southwest Facility",
    location: "Phoenix, AZ",
    productCount: 176,
    totalValue: "$43,890",
    status: "Active",
    lastUpdated: "2023-05-03T13:20:00Z",
  },
  {
    id: "8",
    name: "Midwest Distribution",
    location: "Denver, CO",
    productCount: 312,
    totalValue: "$79,540",
    status: "Active",
    lastUpdated: "2023-04-30T09:10:00Z",
  },
  {
    id: "9",
    name: "Northeast Storage",
    location: "Philadelphia, PA",
    productCount: 245,
    totalValue: "$62,780",
    status: "Inactive",
    lastUpdated: "2023-04-25T11:30:00Z",
  },
  {
    id: "10",
    name: "Southeast Warehouse",
    location: "Atlanta, GA",
    productCount: 298,
    totalValue: "$73,450",
    status: "Active",
    lastUpdated: "2023-04-22T14:15:00Z",
  },
  {
    id: "11",
    name: "North Central Facility",
    location: "Minneapolis, MN",
    productCount: 187,
    totalValue: "$48,920",
    status: "Active",
    lastUpdated: "2023-04-20T10:45:00Z",
  },
  {
    id: "12",
    name: "South Central Storage",
    location: "Dallas, TX",
    productCount: 356,
    totalValue: "$89,670",
    status: "Active",
    lastUpdated: "2023-04-18T16:30:00Z",
  },
  {
    id: "13",
    name: "Pacific Northwest",
    location: "Portland, OR",
    productCount: 203,
    totalValue: "$51,240",
    status: "Inactive",
    lastUpdated: "2023-04-15T09:20:00Z",
  },
  {
    id: "14",
    name: "Mountain Region",
    location: "Salt Lake City, UT",
    productCount: 167,
    totalValue: "$42,380",
    status: "Active",
    lastUpdated: "2023-04-12T13:10:00Z",
  },
  {
    id: "15",
    name: "Great Lakes Warehouse",
    location: "Detroit, MI",
    productCount: 278,
    totalValue: "$69,540",
    status: "Active",
    lastUpdated: "2023-04-10T11:45:00Z",
  },
]

type SortField = "name" | "location" | "productCount" | "totalValue" | "status" | "lastUpdated"
type SortDirection = "asc" | "desc"

export default function InventoriesPage() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [inventories, setInventories] = useState(mockInventories)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [inventoryToDelete, setInventoryToDelete] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Filter inventories based on search query
  const filteredInventories = inventories.filter(
    (inventory) =>
      inventory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inventory.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort inventories
  const sortedInventories = [...filteredInventories].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle special cases for sorting
    if (sortField === "totalValue") {
      // Remove $ and convert to number
      aValue = Number.parseFloat(a.totalValue.replace(/[$,]/g, ""))
      bValue = Number.parseFloat(b.totalValue.replace(/[$,]/g, ""))
    } else if (sortField === "lastUpdated") {
      aValue = new Date(a.lastUpdated).getTime()
      bValue = new Date(b.lastUpdated).getTime()
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
  const currentItems = sortedInventories.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedInventories.length / itemsPerPage)

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleDeleteInventory = (id: string) => {
    setInventories(inventories.filter((inventory) => inventory.id !== id))
    setInventoryToDelete(null)
  }

  const openDeleteDialog = (id: string) => {
    setInventoryToDelete(id)
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

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your inventory locations and storage facilities</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/inventories/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory
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
            placeholder="Search inventories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              Filter
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </button>
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

      {/* Inventory display */}
      {viewType === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((inventory) => (
            <InventoryCard key={inventory.id} inventory={inventory} onDelete={openDeleteDialog} />
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
                    <span>Name</span>
                    {renderSortIcon("name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("location")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Location</span>
                    {renderSortIcon("location")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("productCount")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Products</span>
                    {renderSortIcon("productCount")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("totalValue")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Value</span>
                    {renderSortIcon("totalValue")}
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
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort("lastUpdated")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Updated</span>
                    {renderSortIcon("lastUpdated")}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentItems.map((inventory) => (
                <tr key={inventory.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{inventory.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{inventory.location}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{inventory.productCount}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{inventory.totalValue}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        inventory.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {inventory.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(inventory.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/dashboard/inventories/${inventory.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button
                        onClick={() => openDeleteDialog(inventory.id)}
                        className="text-red-600 hover:text-red-900"
                      >
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
      {filteredInventories.length === 0 && (
        <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No inventories found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new inventory location.</p>
          <div className="mt-6">
            <Link
              href="/dashboard/inventories/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Inventory
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredInventories.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedInventories.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => inventoryToDelete && handleDeleteInventory(inventoryToDelete)}
        title="Delete Inventory"
        message="Are you sure you want to delete this inventory? This action cannot be undone and will remove all data associated with this inventory."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

function InventoryCard({
  inventory,
  onDelete,
}: {
  inventory: (typeof mockInventories)[0]
  onDelete: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
            <Package className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">{inventory.name}</h3>
            <p className="text-sm text-gray-500">{inventory.location}</p>
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
                    href={`/dashboard/inventories/${inventory.id}/edit`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      onDelete(inventory.id)
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
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Products</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{inventory.productCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{inventory.totalValue}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              inventory.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {inventory.status}
          </span>
          <span className="text-xs text-gray-500">Updated {new Date(inventory.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div className="mt-4 flex space-x-2">
          <Link
            href={`/dashboard/inventories/${inventory.id}`}
            className="flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View Details
          </Link>
          <Link
            href={`/dashboard/inventories/${inventory.id}/products`}
            className="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  )
}
