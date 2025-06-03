"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import type { Inventory, InventoryDTO, Product } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { Edit, ArrowLeft, Loader2 } from "lucide-react";

export default function InventoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { addActivity } = useRecentActivity();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<InventoryDTO>({
    name: "",
    location: "",
    type: "WAREHOUSE",
    capacity: 0,
  });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Add event listener to refetch data when the window gains focus
    window.addEventListener("focus", fetchData);

    // Clean up the event listener
    return () => {
      window.removeEventListener("focus", fetchData);
    };
  }, [params.id]); // Rerun effect if inventory ID changes

  const fetchData = async () => {
    // Add console log to confirm fetchData is called on focus
    console.log("fetchData called for inventory ID:", params.id);
    setLoading(true);
    try {
      console.log("Fetching inventory with ID:", params.id);
      const inventoryData = await apiClient.getInventory(Number(params.id));
      // Add console log to inspect fetched inventory data
      console.log("Fetched inventory data:", inventoryData);

      // Add console log for raw capacity value from fetched data
      console.log("Fetched inventory raw capacity:", inventoryData?.capacity);

      if (!inventoryData) {
        showToast("Inventory not found", "error");
        setInventory(null);
        console.warn("API returned no data for inventory ID:", params.id);
      } else {
        setInventory(inventoryData);
        setFormData({
          name: inventoryData.name,
          location: inventoryData.location,
          type: inventoryData.type,
          capacity: Number(inventoryData.capacity),
        });
        console.log("Successfully fetched inventory:", inventoryData);
      }
    } catch (error) {
      console.error("Failed to fetch data for inventory ID:", params.id, error);
      showToast("Failed to load inventory details", "error");
      setInventory(null);
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
    if (formData.capacity <= 0) {
      setFormError("Capacity must be greater than 0.");
      showToast("Capacity must be greater than 0.", "error");
      return;
    }
    setCreating(true);
    try {
      const updateData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        type: formData.type,
        capacity: Number(formData.capacity),
      };

      const updatedInventory = await apiClient.updateInventory(
        Number(params.id),
        updateData
      );

      if (updatedInventory) {
        showToast("Inventory updated successfully!", "success");
        addActivity({
          type: "inventory_updated",
          title: "Inventory Updated",
          description: `Updated inventory \"${updateData.name}\"`,
          icon: "📝",
          color: "blue",
        });
        setIsModalOpen(false);
        await fetchData();
      } else {
        const errorMessage = "Inventory update failed: API returned no data.";
        console.error(errorMessage);
        setFormError(errorMessage);
        showToast(errorMessage, "error");
      }
    } catch (error: any) {
      console.error("Error updating inventory ID:", params.id, error);
      let errorMessage = error?.message || "Failed to update inventory";
      // Custom handling for backend validation error
      if (
        errorMessage.includes(
          "Cannot set capacity below the total quantity of products"
        ) ||
        errorMessage.includes("capacity below the total quantity")
      ) {
        errorMessage =
          "Cannot set capacity below the total quantity of products in this inventory. Please remove or transfer products first.";
      }
      setFormError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory details...</p>
        </div>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Inventory Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The inventory you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/dashboard/inventories")}>
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventories</span>
          </div>
        </Button>
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
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/inventories")}
              className="mb-4 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Inventories</span>
              </div>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {inventory.name}
            </h1>
            <p className="text-gray-600 mt-1">Inventory Details</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Inventory</span>
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <span className="mr-2">📍</span>
                  {inventory.location}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="mt-1 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {inventory.type}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm text-gray-900 flex items-center">
                    <span className="mr-2">📦</span>
                    {inventory.capacity.toLocaleString()} units
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                    title="Edit inventory"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Products</h3>
                <p className="mt-1 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {(inventory.products?.length || 0).toLocaleString()}{" "}
                    products
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Value
                </h3>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <span className="mr-2">💰</span>$
                  {inventory.products
                    ?.reduce(
                      (sum, product) => sum + product.price * product.quantity,
                      0
                    )
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "0.00"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <span className="mr-2">📅</span>
                  {new Date(inventory.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Last Updated
                </h3>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <span className="mr-2">🔄</span>
                  {new Date(inventory.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Capacity Usage
                </h3>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        inventory.capacityUsedPercentage > 90
                          ? "bg-red-600"
                          : inventory.capacityUsedPercentage > 70
                          ? "bg-yellow-600"
                          : "bg-blue-600"
                      }`}
                      style={{
                        width: `${inventory.capacityUsedPercentage}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-600">
                      {inventory.capacityUsedPercentage.toLocaleString(
                        undefined,
                        { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                      )}
                      % used
                    </p>
                    <p className="text-sm text-gray-600">
                      {(
                        inventory.capacity -
                        (inventory.products?.reduce(
                          (sum, product) => sum + product.quantity,
                          0
                        ) || 0)
                      ).toLocaleString()}{" "}
                      units available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {inventory.products && inventory.products.length > 0 && (
          <Card className="hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Products in this Inventory
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-semibold">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        $
                        {product.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.quantity < 10
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.quantity.toLocaleString()} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/products/${product.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Inventory"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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
              min="1"
              value={formData.capacity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFormData({
                  ...formData,
                  capacity: value,
                });
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value) || value <= 0) {
                  setFormData({
                    ...formData,
                    capacity: 1,
                  });
                }
              }}
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
                className="hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white"
                disabled={creating}
              >
                <span className="relative z-10">
                  {creating ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </div>
                  ) : (
                    "Update Inventory"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}
