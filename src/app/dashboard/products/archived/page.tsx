"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import type { Product } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Archive, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useRecentActivity } from "@/hooks/useRecentActivity";

export default function ArchivedProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { addActivity } = useRecentActivity();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchivedProducts();
  }, []);

  const fetchArchivedProducts = async () => {
    try {
      setLoading(true);
      const archivedProducts = await apiClient.getArchivedProducts();
      setProducts(archivedProducts);
    } catch (error) {
      console.error("Failed to fetch archived products:", error);
      showToast("Failed to load archived products", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading archived products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Archived Products
          </h1>
          <p className="text-gray-600">
            View products that have been archived due to transfer history
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
          className="flex items-center gap-2 px-4 py-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Archived Products
          </h3>
          <p className="text-gray-500">
            There are no archived products at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} hover>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Archive className="w-6 h-6 text-gray-500" />
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
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Quantity: {product.quantity}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
