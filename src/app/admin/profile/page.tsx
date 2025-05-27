"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getUserRoles } from "@/lib/auth"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

export default function AdminProfilePage() {
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  useEffect(() => {
    const roles = getUserRoles()
    setUserRoles(roles)

    // In a real app, you'd fetch user data from the API
    setFormData({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Admin profile update:", formData)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Button type="submit">Update Profile</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Admin Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Level</label>
              <div className="flex space-x-2">
                {userRoles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Since</label>
              <p className="text-gray-900">January 2024</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Admin Action</label>
              <p className="text-gray-900">Today at 1:15 PM</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Admin Settings</h2>
        <div className="space-y-4">
          <Button variant="outline">System Configuration</Button>
          <Button variant="outline">User Management</Button>
          <Button variant="outline">Security Settings</Button>
        </div>
      </Card>
    </div>
  )
}
