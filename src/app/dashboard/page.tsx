"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { DashboardStats, Inventory, Product } from "@/types"
import Card from "@/components/ui/Card"
import SimpleChart from "@/components/charts/SimpleChart"

export default function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInventories: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  })
  const [recentInventories, setRecentInventories] = useState<Inventory[]>([])
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📦</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">My Inventories</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalInventories}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🏷️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">My Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚠️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.lowStockProducts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart data={chartData} title="Inventory Overview" />

        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.totalInventories} inventories managed</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.totalProducts} products tracked</span>
            </div>
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{stats.lowStockProducts} items need restocking</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Inventories</h3>
          <div className="space-y-3">
            {recentInventories.map((inventory) => (
              <div key={inventory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{inventory.name}</p>
                  <p className="text-sm text-gray-600">{inventory.location}</p>
                </div>
                <span className="text-sm text-gray-500">{inventory.products?.length || 0} products</span>
              </div>
            ))}
            {recentInventories.length === 0 && <p className="text-gray-500 text-center py-4">No inventories yet</p>}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    product.quantity < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.quantity} in stock
                </span>
              </div>
            ))}
            {recentProducts.length === 0 && <p className="text-gray-500 text-center py-4">No products yet</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
