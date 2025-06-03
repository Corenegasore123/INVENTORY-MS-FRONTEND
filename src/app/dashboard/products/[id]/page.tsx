"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import type { Product, ProductDTO, Inventory } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { Edit, ArrowLeft, Loader2, Trash2 } from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { addActivity } = useRecentActivity();
  const [product, setProduct] = useState<Product | null>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductDTO>({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    inventoryId: 0,
    minimumStockLevel: 10,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    setLoading(true);
    let productData = null;
    let inventoriesData: Inventory[] = [];
    let productFetchError = null;

    try {
      console.log("Fetching product with ID:", params.id);
      // Attempt to fetch product data
      try {
        productData = await apiClient.getProduct(Number(params.id));
      } catch (error) {
        productFetchError = error; // Store product fetch error
        console.error("Failed to fetch product with ID:", params.id, error);
        let errorMessage = "Failed to load product details";
        if ((error as any).message) {
          if ((error as any).message.includes("not found")) {
            errorMessage = "Product not found";
          } else if (
            (error as any).message.includes("permission") ||
            (error as any).message.includes("access")
          ) {
            errorMessage = "You don't have permission to view this product";
          } else if ((error as any).message.includes("Network error")) {
            errorMessage = "Network error: Unable to connect to the server.";
          }
        }
        showToast(errorMessage, "error");
        setProduct(null); // Explicitly set product to null on product fetch failure
        return; // Stop execution if product fetch fails
      }

      // Attempt to fetch inventories (optional for product display)
      try {
        inventoriesData = await (apiClient as any).getAllInventories();
      } catch (inventoryError) {
        console.error(
          "Failed to fetch inventories for product page:",
          inventoryError
        );
        // Optionally show a less intrusive message or log only
        // The product details can still be displayed without the inventory list
        inventoriesData = []; // Ensure it's an empty array on error
      }

      // If product data was successfully fetched
      if (productData) {
        // Add console logs to inspect price and quantity from fetched productData
        console.log(
          "Fetched productData price:",
          productData.price,
          "Type:",
          typeof productData.price
        );
        console.log(
          "Fetched productData quantity:",
          productData.quantity,
          "Type:",
          typeof productData.quantity
        );
        setProduct(productData);
        setFormData({
          name: productData.name,
          price: productData.price,
          quantity: productData.quantity,
          description: productData.description,
          inventoryId: productData.inventoryId,
          minimumStockLevel: productData.minimumStockLevel,
        });
        setInventories(inventoriesData);
        console.log("Successfully fetched product:", productData);
      } else {
        // This case should ideally not be reached if the backend throws exceptions
        // but keeping as a safeguard.
        console.warn("API returned no data for product ID:", params.id);
        showToast("Product not found", "error");
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price <= 0 ||
      formData.quantity < 0 ||
      !formData.inventoryId
    ) {
      setFormError("All fields are required and must be valid.");
      showToast("All fields are required and must be valid.", "error");
      return;
    }
    if (formData.minimumStockLevel < 0) {
      setFormError("Minimum stock level cannot be negative.");
      showToast("Minimum stock level cannot be negative.", "error");
      return;
    }
    setSaving(true);
    try {
      console.log(
        "Attempting to update product with ID:",
        params.id,
        "with data:",
        formData
      );
      // Add console logs for price and quantity before API call
      console.log("Price being sent:", formData.price);
      console.log("Quantity being sent:", formData.quantity);

      const updatedProduct = await (apiClient as any).updateProduct(
        Number(params.id),
        formData
      );
      if (updatedProduct) {
        showToast("Product updated successfully!", "success");
        addActivity({
          type: "product_updated",
          title: "Product Updated",
          description: `Updated product \"${formData.name}\"`,
          icon: "📝",
          color: "blue",
        });
        setIsEditModalOpen(false);
        await fetchData();
        console.log("Successfully updated product:", updatedProduct);
      } else {
        const message = "Product update failed.";
        console.error(message);
        setFormError(message);
        showToast(message, "error");
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      const message = error?.message || "Failed to update product";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      console.log("Attempting to delete product with ID:", params.id);
      await apiClient.deleteProduct(Number(params.id));
      showToast("Product deleted successfully!", "success");
      addActivity({
        type: "product_deleted",
        title: "Product Deleted",
        description: `Deleted product \"${product?.name}\"`,
        icon: "🗑️",
        color: "red",
      });
      setIsDeleteModalOpen(false);
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
      showToast("Failed to delete product", "error");
    }
  };

  const getInventoryName = (inventoryId: number) => {
    const inventory = inventories.find((inv) => inv.id === inventoryId);
    return inventory ? inventory.name : "Unknown";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/dashboard/products")}>
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
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

      <div key={product?.updatedAt} className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/products")}
              className="mb-4 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Products</span>
              </div>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">Product Details</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Product</span>
              </div>
            </Button>
            <Button
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Description
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.description}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="mt-1 text-sm text-gray-900">
                  $
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.quantity.toLocaleString()} units
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Value
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  $
                  {(product.price * product.quantity).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Minimum Stock Level
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.minimumStockLevel.toLocaleString()} units
                </p>
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Inventory Location
                </h3>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <span className="mr-2">📍</span>
                  {getInventoryName(product.inventoryId)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <span className="mr-2">📅</span>
                  {new Date(product.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Last Updated
                </h3>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <span className="mr-2">🔄</span>
                  {new Date(product.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Stock Status
                </h3>
                <p
                  className={`mt-1 text-sm font-medium flex items-center ${
                    product.quantity < product.minimumStockLevel
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  <span className="mr-2">
                    {product.quantity < product.minimumStockLevel ? "🚨" : "✅"}
                  </span>
                  {product.quantity < product.minimumStockLevel
                    ? "Low Stock"
                    : "In Stock"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Product Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Product"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Wireless Headphones"
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., High-quality headphones with noise cancellation"
              required
            />
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={formData.price.toString()}
              onChange={(e) => {
                console.log("Price input raw value:", e.target.value);
                const parsedPrice = parseFloat(e.target.value);
                console.log("Price input parsed value:", parsedPrice);
                setFormData({
                  ...formData,
                  price: Number(parsedPrice), // Explicitly cast to number
                });
              }}
              placeholder="0.00"
              required
            />
            <Input
              label="Quantity"
              type="number"
              value={formData.quantity.toString()}
              onChange={(e) => {
                console.log("Quantity input raw value:", e.target.value);
                const parsedQuantity = parseInt(e.target.value);
                console.log("Quantity input parsed value:", parsedQuantity);
                setFormData({
                  ...formData,
                  quantity: Number(parsedQuantity), // Explicitly cast to number
                });
              }}
              placeholder="0"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inventory
              </label>
              <select
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.inventoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inventoryId: Number.parseInt(e.target.value),
                  })
                }
                required
              >
                <option value={0}>Select an inventory</option>
                {inventories.map((inventory) => (
                  <option key={inventory.id} value={inventory.id}>
                    {inventory.name} - {inventory.location}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Minimum Stock Level"
              type="number"
              value={formData.minimumStockLevel.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimumStockLevel: Number.parseInt(e.target.value),
                })
              }
              placeholder="10"
              required
            />
            {formError && (
              <p className="text-red-600 text-sm mb-2">{formError}</p>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white"
                disabled={saving}
              >
                <span className="relative z-10">
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </div>
                  ) : (
                    "Update Product"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Product Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Product"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}
