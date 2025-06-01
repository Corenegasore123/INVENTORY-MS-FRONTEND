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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

export default function TransfersPage() {
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
    quantity: 0,
    status: "PENDING",
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
      setTransfers(transfersData);
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
    setFormError(null);
    if (
      !formData.productId ||
      !formData.sourceInventoryId ||
      !formData.destinationInventoryId ||
      formData.quantity <= 0 ||
      formData.sourceInventoryId === formData.destinationInventoryId
    ) {
      setFormError(
        "All fields are required and must be valid. Source and destination inventories must be different."
      );
      showToast("All fields are required and must be valid.", "error");
      return;
    }
    setCreating(true);
    try {
      if (editingTransfer) {
        const updatedTransfer = await apiClient.updateTransferStatus(
          editingTransfer.id,
          editingTransfer.status
        );
        if (updatedTransfer) {
          showToast("Transfer status updated successfully!", "success");
          addActivity({
            type: "transfer_updated",
            title: "Transfer Updated",
            description: `Updated transfer status to ${updatedTransfer.status}`,
            icon: "📝",
            color: "blue",
          });
          setIsModalOpen(false);
          setEditingTransfer(null);
          fetchData();
        }
      } else {
        const newTransfer = await apiClient.createTransfer(formData);
        if (newTransfer) {
          showToast("Transfer created successfully!", "success");
          const product = products.find((p) => p.id === formData.productId);
          const sourceInventory = inventories.find(
            (inv) => inv.id === formData.sourceInventoryId
          );
          const destInventory = inventories.find(
            (inv) => inv.id === formData.destinationInventoryId
          );
          addActivity({
            type: "transfer_created",
            title: "New Transfer Created",
            description: `Transferring ${formData.quantity} ${
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
            quantity: 0,
            status: "PENDING",
          });
          fetchData();
        }
      }
    } catch (error: any) {
      console.error("Error saving transfer:", error);
      const message = error?.message || "Failed to save transfer";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (transfer: TransferResponseDTO) => {
    setEditingTransfer(transfer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId !== null) {
      try {
        await apiClient.deleteTransfer(deletingId);
        showToast("Transfer deleted successfully!", "success");
        fetchData();
      } catch (error) {
        console.error("Failed to delete transfer:", error);
        showToast("Failed to delete transfer", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const openCreateModal = () => {
    setEditingTransfer(null);
    setFormData({
      productId: 0,
      sourceInventoryId: 0,
      destinationInventoryId: 0,
      quantity: 0,
      status: "PENDING",
    });
    setAvailableProducts([]);
    setIsModalOpen(true);
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

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
            <p className="text-gray-600 mt-1">
              Manage inventory transfers between locations
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Transfer</span>
            </div>
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          transfer.status
                        )}`}
                      >
                        {transfer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transfer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(transfer)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transfer.id)}
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

        {transfers.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No transfers found
              </h3>
              <p className="text-gray-500 mb-6">
                Start by creating a new transfer
              </p>
              <Button onClick={openCreateModal}>
                Create your first transfer
              </Button>
            </div>
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTransfer ? "Edit Transfer Status" : "New Transfer"}
        >
          <form onSubmit={handleSubmit}>
            {editingTransfer ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={editingTransfer.status}
                  onChange={(e) =>
                    setEditingTransfer({
                      ...editingTransfer,
                      status: e.target.value as
                        | "PENDING"
                        | "COMPLETED"
                        | "CANCELLED",
                    })
                  }
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            ) : (
              <>
                <div className="mb-4">
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
                <div className="mb-4">
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
                <div className="mb-4">
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
                <Input
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number.parseInt(e.target.value),
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as
                          | "PENDING"
                          | "COMPLETED"
                          | "CANCELLED",
                      })
                    }
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </>
            )}
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
                  ) : editingTransfer ? (
                    "Update Status"
                  ) : (
                    "Create Transfer"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          title="Delete Transfer?"
        >
          <div className="flex flex-col items-center justify-center p-4">
            <Trash2 className="w-10 h-10 text-red-500 mb-4" />
            <p className="mb-4 text-center text-gray-700">
              Are you sure you want to delete this transfer? This action cannot
              be undone.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setDeletingId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
