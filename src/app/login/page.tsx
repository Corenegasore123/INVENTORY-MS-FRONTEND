"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { setToken, setUserRoles, setUserData } from "@/lib/auth"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Attempting login with:", { email, password })
      const response = await apiClient.login({ email, password })
      console.log("Login response:", response)

      // Store token and roles
      setToken(response.token)
      setUserRoles(response.roles)

      // Check if we have temp user data from signup
      const tempUserData = localStorage.getItem("tempUserData")
      let userData

      if (response.user && response.user.firstName && response.user.lastName) {
        // Use API response if it has complete data
        userData = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          roles: response.roles
        }
      } else if (tempUserData) {
        // Use temp data from signup if API doesn't have complete data
        const parsedTempData = JSON.parse(tempUserData)
        userData = {
          ...parsedTempData,
          id: response.user?.id || parsedTempData.id,
          roles: response.roles,
        }
        localStorage.removeItem("tempUserData")
      } else {
        // Create minimal user data if nothing else is available
        userData = {
          id: response.user?.id || 0,
          email: response.user?.email || email,
          firstName: response.user?.firstName || "",
          lastName: response.user?.lastName || "",
          roles: response.roles
        }
      }

      setUserData(userData)

      console.log("Complete user data stored:", userData)
      console.log("Verifying localStorage:", localStorage.getItem("userData"))

      showToast("Login successful! Redirecting...", "success")

      // Determine redirect path
      const isAdmin = response.roles.includes("ADMIN")
      const redirectPath = isAdmin ? "/admin" : "/dashboard"

      console.log("Redirecting to:", redirectPath)

      // Force redirect after a short delay
      setTimeout(() => {
        window.location.href = redirectPath
      }, 1000)
    } catch (err) {
      console.error("Login error:", err)
      showToast("Invalid email or password. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">IM</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <Link href="/" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                  ← Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
