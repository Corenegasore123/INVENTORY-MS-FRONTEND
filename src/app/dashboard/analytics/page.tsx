"use client"

import { useState } from "react"
import { BarChart3, LineChart, PieChart } from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            View detailed analytics and insights about your inventory and products
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            id="timeRange"
            name="timeRange"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticCard
          title="Total Products"
          value="1,284"
          change="+12.5%"
          trend="up"
        />
        <AnalyticCard
          title="Active Inventories"
          value="32"
          change="+3.2%"
          trend="up"
        />
        <AnalyticCard
          title="Low Stock Items"
          value="24"
          change="-2.1%"
          trend="down"
        />
        <AnalyticCard
          title="Inventory Value"
          value="$142,384"
          change="+8.1%"
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Inventory Overview"
          description="Distribution of products across inventories"
          icon={<PieChart className="h-5 w-5" />}
        />
        <ChartCard
          title="Product Categories"
          description="Distribution of products by category"
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5">
        <ChartCard
          title="Inventory Value Trend"
          description="Total inventory value over time"
          icon={<LineChart className="h-5 w-5" />}
        />
      </div>

      {/* Detailed Stats */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Detailed Statistics</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Products
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Avg. Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Total Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <StatRow
                category="Electronics"
                products={532}
                avgQuantity={24}
                totalValue="$78,450"
                percentage={55}
              />
              <StatRow
                category="Furniture"
                products={328}
                avgQuantity={12}
                totalValue="$42,210"
                percentage={30}
              />
              <StatRow
                category="Clothing"
                products={215}
                avgQuantity={36}
                totalValue="$12,680"
                percentage={9}
              />
              <StatRow
                category="Accessories"
                products={189}
                avgQuantity={48}
                totalValue="$9,044"
                percentage={6}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AnalyticCard({
  title,
  value,
  change,
  trend,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">{value}</dd>
          </div>
          <div className={`flex items-center ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            <span className="text-sm font-medium">{change}</span>
            <svg
              className={`ml-1 h-5 w-5 ${trend === "up" ? "text-green-500" : "text-red-500"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d={
                  trend === "up"
                    ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                }
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChartCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">{icon}</div>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="h-64 w-full bg-gray-50 flex items-center justify-center">
          {/* This would be replaced with an actual chart component */}
          <div className="text-center text-gray-500">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">Chart visualization would appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({
  category,
  products,
  avgQuantity,
  totalValue,
  percentage,
}: {
  category: string
  products: number
  avgQuantity: number
  totalValue: string
  percentage: number
}) {
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{category}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{products}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{avgQuantity}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{totalValue}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        <div className="flex items-center">
          <span className="mr-2">{percentage}%</span>
          <div className="relative h-2 w-24 overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute h-full rounded-full bg-indigo-600"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </td>
    </tr>
  )
}
