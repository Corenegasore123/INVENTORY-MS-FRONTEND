"use client";

import type React from "react";

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
import { Plus, Edit, Trash2, Grid, List, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { addActivity } = useRecentActivity();
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductDTO>({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    inventoryId: 0,
    minimumStockLevel: 10,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, inventoriesData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getInventories(),
      ]);
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
    setCreating(true);
    try {
      if (editingProduct) {
        const updatedProduct = await apiClient.updateProduct(
          editingProduct.id,
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
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData({
            name: "",
            price: 0,
            quantity: 0,
            description: "",
            inventoryId: 0,
            minimumStockLevel: 10,
          });
          fetchData();
        }
      } else {
        const newProduct = await apiClient.createProduct(formData);
        if (newProduct) {
          showToast("Product created successfully!", "success");
          const inventory = inventories.find(
            (inv) => inv.id === formData.inventoryId
          );
          addActivity({
            type: "product_created",
            title: "New Product Added",
            description: `Added \"${formData.name}\" to ${
              inventory?.name || "inventory"
            }`,
            icon: "🏷️",
            color: "green",
          });
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData({
            name: "",
            price: 0,
            quantity: 0,
            description: "",
            inventoryId: 0,
            minimumStockLevel: 10,
          });
          fetchData();
        }
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      const message = error?.message || "Failed to save product";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      inventoryId: product.inventoryId,
      minimumStockLevel: product.minimumStockLevel,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId !== null) {
      try {
        await apiClient.deleteProduct(deletingId);
        showToast("Product deleted successfully!", "success");
        fetchData();
      } catch (error) {
        console.error("Failed to delete product:", error);
        showToast("Failed to delete product", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      quantity: 0,
      description: "",
      inventoryId: 0,
      minimumStockLevel: 10,
    });
    setIsModalOpen(true);
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
          <p className="text-gray-600">Loading products...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalog and track inventory levels
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
                <span>Add Product</span>
              </div>
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} hover>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-lg">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-gray-600">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                      title="Edit product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span
                    className={`px-3 py-1 rounded-full font-medium ${
                      product.quantity < 10
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {product.quantity} in stock
                  </span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                    {getInventoryName(product.inventoryId)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    router.push(`/dashboard/products/${product.id}`)
                  }
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
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
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
                  {products.map((product) => (
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
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.quantity < 10
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.quantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getInventoryName(product.inventoryId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/products/${product.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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

        {products.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏷️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                Start building your product catalog
              </p>
              <Button onClick={openCreateModal}>Add your first product</Button>
            </div>
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? "Edit Product" : "Add New Product"}
        >
          <form onSubmit={handleSubmit}>
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
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number.parseFloat(e.target.value),
                })
              }
              placeholder="0.00"
              required
            />
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
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Product description..."
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inventory Location
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
              label="Minimum Stock"
              type="number"
              value={formData.minimumStockLevel}
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
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Create Product"
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
          title="Delete Product?"
        >
          <div className="flex flex-col items-center justify-center p-4">
            <Trash2 className="w-10 h-10 text-red-500 mb-4" />
            <p className="mb-4 text-center text-gray-700">
              Are you sure you want to delete this product? This action cannot
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
