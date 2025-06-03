"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import type { DashboardStats, Inventory, Product } from "@/types";
import Card from "@/components/ui/Card";
import SimpleChart from "@/components/charts/SimpleChart";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import {
  Package,
  Tag,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInventories: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalValue: 0,
  });
  const [recentInventories, setRecentInventories] = useState<Inventory[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { activities } = useRecentActivity();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [inventories, products] = await Promise.all([
          apiClient.getInventories(),
          apiClient.getProducts(),
        ]);

        const lowStock = products.filter((p) => p.quantity < 10).length;
        const totalValue = products.reduce(
          (sum, p) => sum + p.price * p.quantity,
          0
        );

        setStats({
          totalInventories: inventories.length,
          totalProducts: products.length,
          lowStockProducts: lowStock,
          totalValue: totalValue,
        });

        setRecentInventories(inventories.slice(0, 5));
        setRecentProducts(products.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = [
    { label: "Inventories", value: stats.totalInventories, color: "#10B981" },
    { label: "Products", value: stats.totalProducts, color: "#F59E0B" },
    { label: "Low Stock", value: stats.lowStockProducts, color: "#EF4444" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-3">Welcome back! 👋</h1>
          <p className="text-blue-100 text-lg font-medium">
            Here's what's happening with your inventory today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">
                My Inventories
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {stats.totalInventories.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-1">Active locations</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Package className="text-white w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">
                Total Products
              </p>
              <p className="text-3xl font-bold text-green-900">
                {stats.totalProducts.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">Items tracked</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Tag className="text-white w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">
                Total Value
              </p>
              <p className="text-2xl font-bold text-purple-900">
                $
                {stats.totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-purple-600 mt-1">Inventory worth</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/dashboard/low-stock")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">
                  Low Stock Alert
                </p>
                <p className="text-3xl font-bold text-red-900">
                  {stats.lowStockProducts.toLocaleString()}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Items need restocking
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-sm">
                <AlertTriangle className="text-white w-8 h-8" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Inventory Overview
          </h3>
          <SimpleChart data={chartData} title="Inventory Distribution" />
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                      activity.color === "green"
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : activity.color === "blue"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-gradient-to-br from-gray-500 to-gray-600"
                    }`}
                  >
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <ClipboardList className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No recent activity</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start by creating inventories and products
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center">
          <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/inventories"
            className="flex items-center p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-sm">
              <Package className="text-white w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Manage Inventories</p>
              <p className="text-sm text-gray-600">
                Add, edit, or view your inventories
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </a>

          <a
            href="/dashboard/products"
            className="flex items-center p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-sm">
              <Tag className="text-white w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-600">
                Add, edit, or view your products
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </a>
        </div>
      </Card>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Inventories
            </h3>
            <button
              onClick={() => router.push("/dashboard/inventories")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {recentInventories.slice(0, 4).map((inventory) => (
              <div
                key={inventory.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {inventory.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {inventory.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {inventory.location}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                  {inventory.products?.length || 0} products
                </span>
              </div>
            ))}
            {recentInventories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No inventories yet</p>
                <a
                  href="/dashboard/inventories"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create your first inventory →
                </a>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Products
            </h3>
            <button
              onClick={() => router.push("/dashboard/products")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {recentProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    product.quantity < 10
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.quantity} in stock
                </span>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No products yet</p>
                <a
                  href="/dashboard/products"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Add your first product →
                </a>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
