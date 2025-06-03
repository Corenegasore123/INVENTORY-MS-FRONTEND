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
    <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-purple-900 text-white w-72 min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/10">
            <span className="text-white font-bold text-xl">IM</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Inventory MS
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              {userIsAdmin ? "Admin Panel" : "User Dashboard"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive
                    ? "bg-white/20"
                    : "bg-white/5 group-hover:bg-white/10"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div
                  className={`text-xs ${
                    isActive
                      ? "text-blue-100"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                >
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="text-xs text-gray-400 text-center space-y-1">
          <p className="font-medium">
            © {new Date().getFullYear()} Inventory MS
          </p>
          <p className="text-gray-500">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
