"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { DashboardStats } from "@/types"
import Card from "@/components/ui/Card"
import SimpleChart from "@/components/charts/SimpleChart"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInventories: 0,
    totalProducts: 0,
    totalUsers: 0,
    lowStockProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [inventories, products, users] = await Promise.all([
          apiClient.getAllInventories(),
          apiClient.getAllProducts(),
          apiClient.getAllUsers(),
        ])

        const lowStock = products.filter((p) => p.quantity < 10).length

        setStats({
          totalInventories: inventories.length,
          totalProducts: products.length,
          totalUsers: users.length,
          lowStockProducts: lowStock,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const chartData = [
    { label: "Users", value: stats.totalUsers || 0, color: "#3B82F6" },
    { label: "Inventories", value: stats.totalInventories, color: "#10B981" },
    { label: "Products", value: stats.totalProducts, color: "#F59E0B" },
    { label: "Low Stock", value: stats.lowStockProducts, color: "#EF4444" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard 🛡️</h1>
        <p className="text-purple-100 text-lg">Monitor and manage your entire inventory system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
              <p className="text-sm text-blue-600 mt-1">Active accounts</p>
            </div>
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">👥</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Total Inventories</p>
              <p className="text-3xl font-bold text-green-900">{stats.totalInventories}</p>
              <p className="text-sm text-green-600 mt-1">All locations</p>
            </div>
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">📦</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.totalProducts}</p>
              <p className="text-sm text-yellow-600 mt-1">Items tracked</p>
            </div>
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">🏷️</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-900">{stats.lowStockProducts}</p>
              <p className="text-sm text-red-600 mt-1">Need attention</p>
            </div>
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">⚠️</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <SimpleChart data={chartData} title="System Overview" />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Admin Actions</h3>
          <div className="space-y-4">
            <a
              href="/admin/users"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white">👥</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-600">View and manage user accounts</p>
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
              href="/admin/inventories"
              className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white">📦</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">View All Inventories</p>
                <p className="text-sm text-gray-600">Monitor all inventory locations</p>
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

            <a
              href="/admin/products"
              className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all group"
            >
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white">🏷️</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">View All Products</p>
                <p className="text-sm text-gray-600">Monitor all products across system</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {stats.lowStockProducts > 0 && (
              <div className="flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">System Alert</p>
                  <p className="text-sm text-gray-600">{stats.lowStockProducts} items across system need restocking</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <h3 className="text-lg font-semibold mb-6 text-gray-900">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <p className="font-medium text-gray-900">System Health</p>
            <p className="text-sm text-green-600">All systems operational</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-2xl">📊</span>
            </div>
            <p className="font-medium text-gray-900">Data Sync</p>
            <p className="text-sm text-blue-600">Real-time updates active</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-2xl">🔒</span>
            </div>
            <p className="font-medium text-gray-900">Security</p>
            <p className="text-sm text-purple-600">All systems secure</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
