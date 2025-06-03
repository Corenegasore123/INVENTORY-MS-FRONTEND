"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import type { Product } from "@/types";
import Card from "@/components/ui/Card";
import { AlertTriangle } from "lucide-react";

export default function LowStockPage() {
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const products = await apiClient.getProducts();
        const lowStock = products.filter((p) => p.quantity < 10);
        setLowStockItems(lowStock);
      } catch (error) {
        console.error("Failed to fetch low stock items:", error);
        setError("Failed to load low stock items");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading low stock items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Low Stock Alerts
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor products that need restocking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-50 to-red-100 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-red-600">
              {lowStockItems.length} items need attention
            </span>
          </div>
        </div>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockItems.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-xl font-semibold text-red-600">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${
                          product.quantity === 0
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {product.quantity} units
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.quantity === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.quantity === 0 ? "Out of Stock" : "Low Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {lowStockItems.length === 0 && (
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              All Stock Levels are Good
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              There are currently no products that need restocking. All
              inventory levels are above the minimum threshold.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
