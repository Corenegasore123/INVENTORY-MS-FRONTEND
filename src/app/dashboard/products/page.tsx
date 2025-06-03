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
import {
  Plus,
  Edit,
  Trash2,
  Grid,
  List,
  Loader2,
  Search,
  Archive,
} from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { addActivity } = useRecentActivity();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getInventoryName(product.inventoryId)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, products]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, inventoriesData] = await Promise.all([
        apiClient.getProducts().catch((error) => {
          console.error("Failed to fetch products:", error);
          showToast("Failed to load products. Please try again.", "error");
          return [];
        }),
        apiClient.getAllInventories().catch((error) => {
          console.error("Failed to fetch inventories:", error);
          showToast(
            "Failed to load inventory data. Some features may be limited.",
            "error"
          );
          return [];
        }),
      ]);

      if (productsData) {
        setProducts(productsData);
      }
      if (inventoriesData) {
        setInventories(inventoriesData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast(
        "Failed to load data. Please check your connection and try again.",
        "error"
      );
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
          await fetchData();
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
          await fetchData();
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
    try {
      await apiClient.deleteProduct(id);
      showToast("Product deleted successfully!", "success");
      await fetchData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
      showToast("Failed to delete product", "error");
    }
  };

  const handleViewDetails = (product: Product) => {
    router.push(`/dashboard/products/${product.id}`);
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

      <div key={products.length} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalog and track inventory levels
            </p>
            <div className="mt-2 flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-blue-700">
                  $
                  {products
                    .reduce(
                      (sum, product) => sum + product.price * product.quantity,
                      0
                    )
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/products/archived")}
              className="flex items-center space-x-2"
            >
              <Archive className="w-4 h-4" />
              <span>Archived Products</span>
            </Button>
            <Button onClick={openCreateModal}>
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
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
            placeholder="Search products by name, description, or inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
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
                      <p className="text-gray-600">
                        $
                        {product.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
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
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDeleteModal(true);
                      }}
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
                    {product.quantity.toLocaleString()} units
                  </span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                    {getInventoryName(product.inventoryId)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewDetails(product)}
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
                  {currentProducts.map((product) => (
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
                            <div
                              className="text-sm text-gray-500 truncate max-w-[200px]"
                              title={product.description}
                            >
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <span className="text-gray-900">
                          $
                          {product.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
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
                          onClick={() => handleViewDetails(product)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
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
              {Math.min(endIndex, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
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

        {filteredProducts.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start building your product catalog"}
              </p>
              {!searchQuery && (
                <Button onClick={openCreateModal}>
                  Add your first product
                </Button>
              )}
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
              value={formData.price.toString()}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setFormData({
                    ...formData,
                    price: value,
                  });
                }
              }}
              placeholder="0.00"
              required
            />
            <Input
              label="Quantity"
              type="number"
              value={formData.quantity.toString()}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setFormData({
                    ...formData,
                    quantity: value,
                  });
                }
              }}
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
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Product"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              onClick={() =>
                selectedProduct && handleDelete(selectedProduct.id)
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

        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Product Details"
        >
          {selectedProduct && (
            <div className="mt-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedProduct.name}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Description
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedProduct.description}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Price</h4>
                <p className="mt-1 text-sm text-gray-900">
                  $
                  {selectedProduct.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Quantity</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedProduct.quantity.toLocaleString()} units
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Minimum Stock Level
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedProduct.minimumStockLevel}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Created At
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedProduct.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Last Updated
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedProduct.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
