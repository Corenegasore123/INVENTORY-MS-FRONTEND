"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import type { Inventory, InventoryDTO } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { Plus, Edit, Trash2, Grid, List, Loader2, Search } from "lucide-react";

export default function InventoriesPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { addActivity } = useRecentActivity();
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(
    null
  );
  const [formData, setFormData] = useState<InventoryDTO>({
    name: "",
    location: "",
    type: "WAREHOUSE",
    capacity: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredInventories, setFilteredInventories] = useState<Inventory[]>(
    []
  );
  const itemsPerPage = 9;

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Filter inventories based on search query
    const filtered = inventories.filter(
      (inventory) =>
        inventory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inventory.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inventory.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventories(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, inventories]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredInventories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInventories = filteredInventories.slice(startIndex, endIndex);

  const fetchData = async () => {
    try {
      const data = await apiClient.getInventories();
      setInventories(data);
    } catch (error) {
      console.error("Failed to fetch inventories:", error);
      showToast("Failed to load inventories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name.trim() || !formData.location.trim()) {
      setFormError("Name and location are required.");
      showToast("Name and location are required.", "error");
      return;
    }
    setCreating(true);
    try {
      if (editingInventory) {
        const updatedInventory = await apiClient.updateInventory(
          editingInventory.id,
          formData
        );
        if (updatedInventory) {
          showToast("Inventory updated successfully!", "success");
          addActivity({
            type: "inventory_updated",
            title: "Inventory Updated",
            description: `Updated inventory \"${formData.name}\"`,
            icon: "📝",
            color: "blue",
          });
          setIsModalOpen(false);
          setEditingInventory(null);
          setFormData({
            name: "",
            location: "",
            type: "WAREHOUSE",
            capacity: 0,
          });
          fetchData();
        }
      } else {
        const newInventory = await apiClient.createInventory(formData);
        if (newInventory) {
          showToast("Inventory created successfully!", "success");
          addActivity({
            type: "inventory_created",
            title: "New Inventory Created",
            description: `Created inventory \"${formData.name}\" at ${formData.location}`,
            icon: "➕",
            color: "green",
          });
          setIsModalOpen(false);
          setEditingInventory(null);
          setFormData({
            name: "",
            location: "",
            type: "WAREHOUSE",
            capacity: 0,
          });
          fetchData();
        }
      }
    } catch (error: any) {
      console.error("Error saving inventory:", error);
      const message = error?.message || "Failed to save inventory";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (inventory: Inventory) => {
    setEditingInventory(inventory);
    setFormData({
      name: inventory.name,
      location: inventory.location,
      type: inventory.type,
      capacity: inventory.capacity,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteInventory(id);
      showToast("Inventory deleted successfully!", "success");
      await fetchData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      showToast("Failed to delete inventory", "error");
    }
  };

  const confirmDelete = async () => {
    if (deletingId !== null) {
      try {
        await apiClient.deleteInventory(deletingId);
        showToast("Inventory deleted successfully!", "success");
        fetchData();
      } catch (error) {
        console.error("Failed to delete inventory:", error);
        showToast("Failed to delete inventory", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const openCreateModal = () => {
    setEditingInventory(null);
    setFormData({
      name: "",
      location: "",
      type: "WAREHOUSE",
      capacity: 0,
    });
    setIsModalOpen(true);
  };

  const handleViewDetails = (inventory: Inventory) => {
    router.push(`/dashboard/inventories/${inventory.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventories...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Inventories</h1>
            <p className="text-gray-600 mt-1">
              Manage your inventory locations and track your products
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Grid className="w-4 h-4" />
                  <span>Grid</span>
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span>List</span>
                </div>
              </button>
            </div>
            <Button onClick={openCreateModal}>
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Inventory</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder="Search inventories by name, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentInventories.map((inventory) => (
              <Card key={inventory.id} hover>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {inventory.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inventory.name}
                      </h3>
                      <p className="text-gray-600">{inventory.location}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(inventory)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                      title="Edit inventory"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInventory(inventory);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="Delete inventory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p className="flex items-center space-x-2">
                    <span>📦</span>
                    <span>
                      {inventory.products?.length.toLocaleString() || 0}{" "}
                      products
                    </span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span>🏢</span>
                    <span>
                      Capacity: {inventory.capacity.toLocaleString()} units
                    </span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        inventory.capacityUsedPercentage > 90
                          ? "bg-red-600"
                          : inventory.capacityUsedPercentage > 70
                          ? "bg-yellow-600"
                          : "bg-green-600"
                      }`}
                      style={{
                        width: `${inventory.capacityUsedPercentage.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {inventory.capacityUsedPercentage.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                    )}
                    % used
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewDetails(inventory)}
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
                      Inventory
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
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentInventories.map((inventory) => (
                    <tr key={inventory.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {inventory.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {inventory.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inventory.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {inventory.products?.length.toLocaleString() || 0}{" "}
                          items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inventory.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inventory.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(inventory)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInventory(inventory);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="text-sm text-gray-700 mb-2">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredInventories.length)} of{" "}
              {filteredInventories.length} inventories
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {filteredInventories.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No inventories found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start creating your inventory locations"}
              </p>
              {!searchQuery && (
                <Button onClick={openCreateModal}>
                  Add your first inventory
                </Button>
              )}
            </div>
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingInventory ? "Edit Inventory" : "Create New Inventory"}
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Inventory Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Main Warehouse"
              required
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., New York, NY"
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as
                      | "WAREHOUSE"
                      | "STORE"
                      | "DISTRIBUTION_CENTER",
                  })
                }
                required
              >
                <option value="WAREHOUSE">Warehouse</option>
                <option value="STORE">Store</option>
                <option value="DISTRIBUTION_CENTER">Distribution Center</option>
              </select>
            </div>
            <Input
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: Number.parseInt(e.target.value),
                })
              }
              placeholder="e.g., 1000"
              required
            />
            {formError && (
              <p className="text-red-600 text-sm mb-2">{formError}</p>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full group relative overflow-hidden"
                disabled={creating}
              >
                <span className="relative z-10">
                  {creating ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </div>
                  ) : editingInventory ? (
                    "Update Inventory"
                  ) : (
                    "Create Inventory"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Inventory"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this inventory? This action cannot
              be undone.
            </p>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              onClick={() =>
                selectedInventory && handleDelete(selectedInventory.id)
              }
            >
              Delete
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}
