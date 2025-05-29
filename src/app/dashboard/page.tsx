"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { DashboardStats, Inventory, Product } from "@/types"
import Card from "@/components/ui/Card"
import SimpleChart from "@/components/charts/SimpleChart"
import { useRecentActivity } from "@/hooks/useRecentActivity"
export default function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInventories: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  })
  const [recentInventories, setRecentInventories] = useState<Inventory[]>([])
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { activities } = useRecentActivity()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [inventories, products] = await Promise.all([apiClient.getInventories(), apiClient.getProducts()])

        const lowStock = products.filter((p) => p.quantity < 10).length

        setStats({
          totalInventories: inventories.length,
          totalProducts: products.length,
          lowStockProducts: lowStock,
        })

        setRecentInventories(inventories.slice(0, 5))
        setRecentProducts(products.slice(0, 5))
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const chartData = [
    { label: "Inventories", value: stats.totalInventories, color: "#10B981" },
    { label: "Products", value: stats.totalProducts, color: "#F59E0B" },
    { label: "Low Stock", value: stats.lowStockProducts, color: "#EF4444" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100 text-lg">Here's what's happening with your inventory today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">My Inventories</p>
              <p className="text-3xl font-bold text-green-900">{stats.totalInventories}</p>
              <p className="text-sm text-green-600 mt-1">Active locations</p>
            </div>
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">📦</span>
            </div>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalProducts}</p>
              <p className="text-sm text-blue-600 mt-1">Items tracked</p>
            </div>
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">🏷️</span>
            </div>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Low Stock Alert</p>
              <p className="text-3xl font-bold text-red-900">{stats.lowStockProducts}</p>
              <p className="text-sm text-red-600 mt-1">Items need restocking</p>
            </div>
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">⚠️</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SimpleChart data={chartData} title="Inventory Overview" />

        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Recent Activity</h3>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.color === "green"
                        ? "bg-green-100"
                        : activity.color === "blue"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">Start by creating inventories and products</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold mb-6 text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/inventories"
            className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white">📦</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Manage Inventories</p>
              <p className="text-sm text-gray-600">Add, edit, or view your inventories</p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="/dashboard/products"
            className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white">🏷️</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-600">Add, edit, or view your products</p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {stats.lowStockProducts > 0 && (
          <div className="mt-4 flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white">⚠️</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Low Stock Alert</p>
              <p className="text-sm text-gray-600">{stats.lowStockProducts} items need restocking</p>
            </div>
          </div>
        )}
      </Card>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Inventories</h3>
            <a href="/dashboard/inventories" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {recentInventories.map((inventory) => (
              <div
                key={inventory.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{inventory.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{inventory.name}</p>
                    <p className="text-sm text-gray-600">{inventory.location}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(inventory.createdAt).toLocaleDateString()}
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
                <a href="/dashboard/inventories" className="text-blue-600 hover:text-blue-800 font-medium">
                  Create your first inventory →
                </a>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
            <a href="/dashboard/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold">{product.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price}</p>
                    <p className="text-xs text-gray-500">Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    product.quantity < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.quantity} in stock
                </span>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No products yet</p>
                <a href="/dashboard/products" className="text-blue-600 hover:text-blue-800 font-medium">
                  Add your first product →
                </a>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
