"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { isAdmin } from "@/lib/auth"

export default function Sidebar() {
  const pathname = usePathname()
  const userIsAdmin = isAdmin()

  const adminMenuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊", description: "Overview & Analytics" },
    { name: "Users", href: "/admin/users", icon: "👥", description: "Manage Users" },
    { name: "Inventories", href: "/admin/inventories", icon: "📦", description: "All Inventories" },
    { name: "Products", href: "/admin/products", icon: "🏷️", description: "All Products" },
  ]

  const userMenuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊", description: "Your Overview" },
    { name: "Inventories", href: "/dashboard/inventories", icon: "📦", description: "Your Inventories" },
    { name: "Products", href: "/dashboard/products", icon: "🏷️", description: "Your Products" },
  ]

  const menuItems = userIsAdmin ? adminMenuItems : userMenuItems

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IM</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Inventory MS</h2>
            <p className="text-gray-400 text-sm">{userIsAdmin ? "Admin Panel" : "User Dashboard"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className={`text-xs ${isActive ? "text-blue-100" : "text-gray-500 group-hover:text-gray-400"}`}>
                  {item.description}
                </div>
              </div>
              {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          <p>© 2024 Inventory MS</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
