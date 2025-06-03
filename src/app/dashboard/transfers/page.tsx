"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import type {
  TransferResponseDTO,
  TransferDTO,
  Inventory,
  Product,
} from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { Plus, Edit, Trash2, Loader2, Check, X, Archive } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TransfersPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { addActivity } = useRecentActivity();
  const [transfers, setTransfers] = useState<TransferResponseDTO[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] =
    useState<TransferResponseDTO | null>(null);
  const [formData, setFormData] = useState<TransferDTO>({
    productId: 0,
    sourceInventoryId: 0,
    destinationInventoryId: 0,
    currentQuantity: 0,
    transferQuantity: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (formData.sourceInventoryId) {
      const inventoryProducts = products.filter(
        (product) => product.inventoryId === formData.sourceInventoryId
      );
      setAvailableProducts(inventoryProducts);
      if (!inventoryProducts.find((p) => p.id === formData.productId)) {
        setFormData((prev) => ({ ...prev, productId: 0 }));
      }
    } else {
      setAvailableProducts([]);
    }
  }, [formData.sourceInventoryId, products]);

  const fetchData = async () => {
    try {
      const [transfersData, productsData, inventoriesData] = await Promise.all([
        apiClient.getTransfers(),
        apiClient.getProducts(),
        apiClient.getInventories(),
      ]);
      setTransfers(transfersData.filter((transfer) => !transfer.archived));
      setProducts(productsData);
      setInventories(inventoriesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError("");

    // Always fetch latest products before submitting
    try {
      const productsData = await apiClient.getProducts();
      setProducts(productsData);
      // Update currentQuantity in formData to match backend
      const selectedProduct = productsData.find(
        (p) =>
          p.id === formData.productId &&
          p.inventoryId === formData.sourceInventoryId
      );
      if (selectedProduct) {
        formData.currentQuantity = selectedProduct.quantity;
      }
    } catch (error) {
      showToast("Failed to refresh products", "error");
      setCreating(false);
      return;
    }

    if (
      !formData.productId ||
      !formData.sourceInventoryId ||
      !formData.destinationInventoryId ||
      !formData.transferQuantity
    ) {
      setFormError("All fields are required");
      setCreating(false);
      return;
    }

    if (formData.sourceInventoryId === formData.destinationInventoryId) {
      setFormError("Source and destination inventories must be different");
      setCreating(false);
      return;
    }

    if (formData.transferQuantity <= 0) {
      setFormError("Transfer quantity must be greater than 0");
      setCreating(false);
      return;
    }

    const product = availableProducts.find((p) => p.id === formData.productId);
    if (formData.transferQuantity > (product?.quantity || 0)) {
      setFormError("Transfer quantity cannot exceed available quantity");
      setCreating(false);
      return;
    }

    try {
      const newTransfer = await apiClient.createTransfer(formData);
      if (newTransfer) {
        showToast("Transfer created successfully!", "success");
        const sourceInventory = inventories.find(
          (inv) => inv.id === formData.sourceInventoryId
        );
        const destInventory = inventories.find(
          (inv) => inv.id === formData.destinationInventoryId
        );
        addActivity({
          type: "transfer_created",
          title: "New Transfer Created",
          description: `Transferring ${formData.transferQuantity} ${
            product?.name || "items"
          } from ${sourceInventory?.name || "source"} to ${
            destInventory?.name || "destination"
          }`,
          icon: "🔄",
          color: "green",
        });
        setIsModalOpen(false);
        setFormData({
          productId: 0,
          sourceInventoryId: 0,
          destinationInventoryId: 0,
          currentQuantity: 0,
          transferQuantity: 0,
        });
        fetchData();
      }
    } catch (error: any) {
      console.error("Error saving transfer:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save transfer";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (transfer: TransferResponseDTO) => {
    if (transfer.status === "PENDING") {
      setEditingTransfer(transfer);
      setIsModalOpen(true);
    } else {
      showToast("Only pending transfers can be modified", "error");
    }
  };

  const handleComplete = async (id: number) => {
    try {
      const updatedTransfer = await apiClient.completeTransfer(id);
      if (updatedTransfer) {
        showToast("Transfer completed successfully!", "success");
        addActivity({
          type: "transfer_updated",
          title: "Transfer Completed",
          description: `Completed transfer of ${updatedTransfer.quantity} ${updatedTransfer.productName}`,
          icon: "✅",
          color: "green",
        });
        fetchData();
      }
    } catch (error: any) {
      console.error("Failed to complete transfer:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to complete transfer";
      showToast(message, "error");
    }
  };

  const handleCancel = async (id: number) => {
    try {
      const updatedTransfer = await apiClient.cancelTransfer(id);
      if (updatedTransfer) {
        showToast("Transfer cancelled successfully!", "success");
        addActivity({
          type: "transfer_updated",
          title: "Transfer Cancelled",
          description: `Cancelled transfer of ${updatedTransfer.quantity} ${updatedTransfer.productName}`,
          icon: "❌",
          color: "red",
        });
        fetchData();
      }
    } catch (error: any) {
      console.error("Failed to cancel transfer:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel transfer";
      showToast(message, "error");
    }
  };

  const handleArchive = async (id: number) => {
    try {
      const updatedTransfer = await apiClient.archiveTransfer(id);
      if (updatedTransfer) {
        showToast("Transfer archived successfully!", "success");
        addActivity({
          type: "transfer_updated",
          title: "Transfer Archived",
          description: `Archived transfer of ${updatedTransfer.quantity} ${updatedTransfer.productName}`,
          icon: "📦",
          color: "gray",
        });
        fetchData();
      }
    } catch (error: any) {
      console.error("Failed to archive transfer:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to archive transfer";
      showToast(message, "error");
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId !== null) {
      try {
        await apiClient.archiveTransfer(deletingId);
        showToast("Transfer archived successfully!", "success");
        fetchData();
      } catch (error: any) {
        console.error("Failed to archive transfer:", error);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to archive transfer";
        showToast(message, "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const openCreateModal = async () => {
    setEditingTransfer(null);
    setFormData({
      productId: 0,
      sourceInventoryId: 0,
      destinationInventoryId: 0,
      currentQuantity: 0,
      transferQuantity: 0,
    });
    setAvailableProducts([]);
    setIsModalOpen(true);
    // Always fetch latest products before opening modal
    try {
      const productsData = await apiClient.getProducts();
      setProducts(productsData);
    } catch (error) {
      showToast("Failed to refresh products", "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transfers...</p>
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

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Transfers
            </h1>
            <p className="text-gray-600 mt-1">
              Manage inventory transfers between locations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/transfers/archived")}
              className="flex items-center space-x-2"
            >
              <Archive className="w-4 h-4" />
              <span>Archived Transfers</span>
            </Button>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>New Transfer</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Transfers Table */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transfer.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transfer.sourceInventoryName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transfer.destinationInventoryName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transfer.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          transfer.status
                        )}`}
                      >
                        {transfer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transfer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {transfer.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleComplete(transfer.id)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors mr-2"
                            title="Complete Transfer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancel(transfer.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mr-2"
                            title="Cancel Transfer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleArchive(transfer.id)}
                        className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Archive Transfer"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {transfers.length === 0 && (
          <Card className="shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No transfers found
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start by creating a new transfer between your inventory
                locations
              </p>
              <Button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                Create your first transfer
              </Button>
            </div>
          </Card>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTransfer ? "Edit Transfer" : "New Transfer"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {formError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Inventory
              </label>
              <select
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.sourceInventoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sourceInventoryId: Number.parseInt(e.target.value),
                    productId: 0,
                  })
                }
                required
              >
                <option value={0}>Select source inventory</option>
                {inventories.map((inventory) => (
                  <option key={inventory.id} value={inventory.id}>
                    {inventory.name} - {inventory.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <select
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.productId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productId: Number.parseInt(e.target.value),
                  })
                }
                required
                disabled={!formData.sourceInventoryId}
              >
                <option value={0}>Select a product</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Available: {product.quantity})
                  </option>
                ))}
              </select>
              {!formData.sourceInventoryId && (
                <p className="mt-1 text-sm text-gray-500">
                  Please select a source inventory first
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Inventory
              </label>
              <select
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.destinationInventoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationInventoryId: Number.parseInt(e.target.value),
                  })
                }
                required
              >
                <option value={0}>Select destination inventory</option>
                {inventories
                  .filter((inv) => inv.id !== formData.sourceInventoryId)
                  .map((inventory) => (
                    <option key={inventory.id} value={inventory.id}>
                      {inventory.name} - {inventory.location}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Quantity
              </label>
              <Input
                type="number"
                value={formData.transferQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transferQuantity: Number.parseInt(e.target.value),
                  })
                }
                placeholder="0"
                required
                max={
                  availableProducts.find((p) => p.id === formData.productId)
                    ?.quantity || 0
                }
              />
              {formData.productId && (
                <p className="mt-1 text-sm text-gray-500">
                  Available quantity:{" "}
                  {availableProducts.find((p) => p.id === formData.productId)
                    ?.quantity || 0}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingTransfer ? "Updating..." : "Creating..."}
                  </>
                ) : editingTransfer ? (
                  "Update Transfer"
                ) : (
                  "Create Transfer"
                )}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          title="Archive Transfer"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to archive this transfer? This will hide it
              from the main view but keep it in the system for record-keeping.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setDeletingId(null)}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
              >
                Archive
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
