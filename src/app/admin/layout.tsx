"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, isAdmin } from "@/lib/auth"
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
    console.log("Admin layout - checking auth")

    // Add a small delay to ensure localStorage is available
    const checkAuth = () => {
      // Check authentication
      if (!isAuthenticated()) {
        console.log("Not authenticated, redirecting to login")
        router.push("/login")
        return
      }

      // Check admin role
      if (!isAdmin()) {
        console.log("Not admin, redirecting to dashboard")
        router.push("/dashboard")
        return
      }

      console.log("Admin access granted")
      setAuthorized(true)
      setLoading(false)
    }

    // Small delay to ensure everything is loaded
    const timer = setTimeout(checkAuth, 100)
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
          <p className="text-gray-600">Redirecting...</p>
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
