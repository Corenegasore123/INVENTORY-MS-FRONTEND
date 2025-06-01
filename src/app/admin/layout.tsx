"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, getUserRoles, isAdmin } from "@/lib/auth"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log("=== ADMIN LAYOUT CHECK ===")

        // Check if user has token
        const token = getToken()
        console.log("Token exists:", !!token)

        if (!token) {
          console.log("No token found, redirecting to login")
          router.replace("/login")
          return
        }

        // Check if user has admin role
        const roles = getUserRoles()
        console.log("User roles in admin layout:", roles)

        const userIsAdmin = isAdmin()
        console.log("User is admin (admin layout):", userIsAdmin)

        if (!userIsAdmin) {
          console.log("User is not admin, redirecting to dashboard")
          window.location.href = "/dashboard"
          return
        }

        console.log("Admin access granted")
        setAuthorized(true)
      } catch (error) {
        console.error("Error checking admin access:", error)
        router.replace("/login")
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to ensure client-side hydration is complete
    const timer = setTimeout(checkAccess, 300)
    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Checking admin permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Admin Dashboard" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  )
}
