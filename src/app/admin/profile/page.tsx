"use client"

import { useState, useEffect } from "react"
import { getUserData, getUserRoles } from "@/lib/auth"
import Card from "@/components/ui/Card"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

export default function AdminProfilePage() {
  const { toast, showToast, hideToast } = useToast()
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    createdAt: "",
  })

  useEffect(() => {
    // Get roles and ensure it's always an array
    const roles = getUserRoles()
    const validRoles = Array.isArray(roles) ? roles : []
    setUserRoles(validRoles)

    // Get user data from localStorage
    const userData = getUserData()
    console.log("Admin user data from localStorage:", userData)

    if (userData) {
      setUserInfo({
        id: userData.id || 0,
        email: userData.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        createdAt: userData.createdAt || "",
      })
    }

    setLoading(false)
  }, [])

  const getDisplayName = () => {
    if (userInfo.firstName && userInfo.lastName) {
      return `${userInfo.firstName} ${userInfo.lastName}`
    } else if (userInfo.firstName) {
      return userInfo.firstName
    } else if (userInfo.email) {
      return userInfo.email
    }
    return "Admin User"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">Welcome, {getDisplayName()}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <p className="text-gray-900 font-medium">{userInfo.firstName || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <p className="text-gray-900 font-medium">{userInfo.lastName || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <p className="text-gray-900">{userInfo.email || "Not available"}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Admin Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-gray-900 font-medium">{getDisplayName()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Level</label>
              <div className="flex space-x-2">
                {Array.isArray(userRoles) && userRoles.length > 0 ? (
                  userRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Since</label>
              <p className="text-gray-900">
                {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : "Not available"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
              <p className="text-gray-900">{userInfo.id || "Not available"}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">System Access</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
            <p className="text-gray-900">Full System Access</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Admin Action</label>
            <p className="text-gray-900">Today</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Status</label>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
