import type React from "react"
import { BarChart3, BoxIcon, DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's an overview of your inventory management system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value="1,284"
          change="+12.5%"
          trend="up"
          icon={<BoxIcon className="h-6 w-6 text-indigo-600" />}
        />
        <StatCard
          title="Total Inventory"
          value="32"
          change="+3.2%"
          trend="up"
          icon={<Package className="h-6 w-6 text-green-600" />}
        />
        <StatCard
          title="Low Stock Items"
          value="24"
          change="-2.1%"
          trend="down"
          icon={<ShoppingCart className="h-6 w-6 text-amber-600" />}
        />
        <StatCard
          title="Total Value"
          value="$142,384"
          change="+8.1%"
          trend="up"
          icon={<DollarSign className="h-6 w-6 text-purple-600" />}
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Inventory Overview</h2>
            <select className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="h-64 w-full bg-gray-50 flex items-center justify-center">
            {/* This would be replaced with an actual chart component */}
            <BarChart3 className="h-24 w-24 text-gray-300" />
            <span className="ml-2 text-gray-500">Inventory Chart</span>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Product Categories</h2>
            <select className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Furniture</option>
              <option>Clothing</option>
            </select>
          </div>
          <div className="h-64 w-full bg-gray-50 flex items-center justify-center">
            {/* This would be replaced with an actual chart component */}
            <BarChart3 className="h-24 w-24 text-gray-300" />
            <span className="ml-2 text-gray-500">Categories Chart</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="rounded-lg border bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <ActivityItem
              title="New product added"
              description="Wireless Headphones XZ-400"
              time="2 hours ago"
              icon={<BoxIcon className="h-5 w-5 text-indigo-500" />}
            />
            <ActivityItem
              title="Inventory updated"
              description="Main Warehouse - 24 items added"
              time="5 hours ago"
              icon={<Package className="h-5 w-5 text-green-500" />}
            />
            <ActivityItem
              title="Low stock alert"
              description="Smartphone Case X12 - Only 3 left"
              time="1 day ago"
              icon={<ShoppingCart className="h-5 w-5 text-amber-500" />}
            />
            <ActivityItem
              title="New user joined"
              description="Sarah Johnson (sarah@example.com)"
              time="2 days ago"
              icon={<Users className="h-5 w-5 text-purple-500" />}
            />
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <Link href="/dashboard/activity" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all activity
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Add New Product"
          description="Create a new product in your inventory"
          buttonText="Add Product"
          href="/dashboard/products/new"
          icon={<BoxIcon className="h-6 w-6" />}
        />
        <QuickActionCard
          title="Create Inventory"
          description="Set up a new inventory location"
          buttonText="Create Inventory"
          href="/dashboard/inventories/new"
          icon={<Package className="h-6 w-6" />}
        />
        <QuickActionCard
          title="Generate Report"
          description="Create a custom inventory report"
          buttonText="Generate Report"
          href="/dashboard/reports/new"
          icon={<BarChart3 className="h-6 w-6" />}
        />
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="flex items-center">
          {trend === "up" ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span className={`ml-2 text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {change}
          </span>
          <span className="ml-2 text-sm text-gray-500">from last month</span>
        </div>
      </div>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string
  description: string
  time: string
  icon: React.ReactNode
}) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50">{icon}</div>
        <div className="ml-4 flex-1">
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  buttonText,
  href,
  icon,
}: {
  title: string
  description: string
  buttonText: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">{icon}</div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-6">
          <Link
            href={href}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  )
}
