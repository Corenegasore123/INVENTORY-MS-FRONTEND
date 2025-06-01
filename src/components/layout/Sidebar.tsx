"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserRoles } from "@/lib/auth";
import {
  BarChart3,
  Users,
  Package,
  Tag,
  Home,
  Warehouse,
  Truck,
  BarChart,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const roles = getUserRoles();
    console.log("Sidebar - User roles:", roles);
    const isAdmin = Array.isArray(roles) && roles.includes("ADMIN");
    console.log("Sidebar - Is admin:", isAdmin);
    setUserIsAdmin(isAdmin);
  }, []);

  const adminMenuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <BarChart3 className="w-5 h-5" />,
      description: "Overview & Analytics",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="w-5 h-5" />,
      description: "Manage Users",
    },
    {
      name: "Inventories",
      href: "/admin/inventories",
      icon: <Package className="w-5 h-5" />,
      description: "All Inventories",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <Tag className="w-5 h-5" />,
      description: "All Products",
    },
    {
      name: "Transfers",
      href: "/admin/transfers",
      icon: <Truck className="w-5 h-5" />,
      description: "Manage Transfers",
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: <BarChart className="w-5 h-5" />,
      description: "View Reports",
    },
  ];

  const userMenuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      description: "Your Overview",
    },
    {
      name: "Inventories",
      href: "/dashboard/inventories",
      icon: <Package className="w-5 h-5" />,
      description: "Your Inventories",
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: <Tag className="w-5 h-5" />,
      description: "Your Products",
    },
    {
      name: "Transfers",
      href: "/dashboard/transfers",
      icon: <Truck className="w-5 h-5" />,
      description: "Manage Transfers",
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: <BarChart className="w-5 h-5" />,
      description: "View Reports",
    },
  ];

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Inventories", href: "/dashboard/inventories", icon: Warehouse },
    { name: "Transfers", href: "/dashboard/transfers", icon: Truck },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const menuItems = userIsAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-purple-900 text-white w-64 min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IM</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Inventory MS</h2>
            <p className="text-gray-400 text-sm">
              {userIsAdmin ? "Admin Panel" : "User Dashboard"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
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
                <div
                  className={`text-xs ${
                    isActive
                      ? "text-blue-100"
                      : "text-gray-500 group-hover:text-gray-400"
                  }`}
                >
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center mt-2">
          <p>© {new Date().getFullYear()} Inventory MS</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
