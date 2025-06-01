"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import type { Product, Inventory, ProductDTO } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductDTO>({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    inventoryId: 0,
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const [productsData, inventoriesData] = await Promise.all([
          apiClient.getProducts(),
          apiClient.getInventories(),
        ]);

        const currentProduct = productsData.find(
          (prod) => prod.id === Number(params.id)
        );
        const productInventory = inventoriesData.find(
          (inv) => inv.id === currentProduct?.inventoryId
        );

        setProduct(currentProduct || null);
        setInventory(productInventory || null);
        setInventories(inventoriesData);

        if (currentProduct) {
          setFormData({
            name: currentProduct.name,
            price: currentProduct.price,
            quantity: currentProduct.quantity,
            description: currentProduct.description,
            inventoryId: currentProduct.inventoryId,
          });
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProductDetails();
    }
  }, [params.id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await apiClient.updateProduct(product.id, formData);
      setIsEditModalOpen(false);
      // Refresh product data
      window.location.reload();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await apiClient.deleteProduct(product.id);
        router.push("/dashboard/products");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">${product.price}</p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={() => setIsEditModalOpen(true)}>Edit Product</Button>
          <Button onClick={handleDelete} variant="danger">
            Delete Product
          </Button>
          <Button onClick={() => router.back()} variant="outline">
            Back
          </Button>
        </div>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Product Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="text-gray-900">{product.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <p className="text-gray-900">${product.price}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity in Stock
              </label>
              <p className="text-gray-900">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.quantity < 10
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.quantity} units
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <p className="text-gray-900">{product.description}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Inventory Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inventory Name
              </label>
              <p className="text-gray-900">{inventory?.name || "Unknown"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <p className="text-gray-900">
                {inventory?.location || "Unknown"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created Date
              </label>
              {/* {new Date(product.createdAt).toLocaleDateString()} */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Updated
              </label>
              {/* {new Date(product.updatedAt).toLocaleDateString()} */}
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              ${(product.price * product.quantity).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {product.quantity}
            </p>
            <p className="text-sm text-gray-600">Units Available</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p
              className={`text-2xl font-bold ${
                product.quantity < 10
                  ? "text-red-600"
                  : product.quantity < 50
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {product.quantity < 10
                ? "Low"
                : product.quantity < 50
                ? "Medium"
                : "High"}
            </p>
            <p className="text-sm text-gray-600">Stock Level</p>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        <form onSubmit={handleEdit}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inventory
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.inventoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  inventoryId: Number.parseInt(e.target.value),
                })
              }
              required
            >
              {inventories.map((inventory) => (
                <option key={inventory.id} value={inventory.id}>
                  {inventory.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
