"use client"

import { useState } from "react"
import { BarChart3, CheckCircle, Edit, Lock, Search, Settings, Trash2, User, UserPlus, Users } from "lucide-react"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-05-15T10:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    status: "Active",
    lastLogin: "2023-05-14T08:45:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2023-05-12T14:20:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2023-04-28T09:15:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "Manager",
    status: "Active",
    lastLogin: "2023-05-10T16:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState(mockUsers)

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage users, roles, and system settings</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === "users"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Users className="mr-2 inline-block h-5 w-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === "roles"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Lock className="mr-2 inline-block h-5 w-5" />
            Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === "system"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Settings className="mr-2 inline-block h-5 w-5" />
            System Settings
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === "logs"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="mr-2 inline-block h-5 w-5" />
            Activity Logs
          </button>
        </nav>
      </div>

      {/* Users Tab Content */}
      {activeTab === "users" && (
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Last Login
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "Manager"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new user.</p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Roles Tab Content */}
      {activeTab === "roles" && (
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-gray-900">Roles & Permissions</h2>
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Role
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <RoleCard
              name="Admin"
              description="Full access to all resources"
              userCount={1}
              permissions={[
                { name: "User Management", granted: true },
                { name: "Inventory Management", granted: true },
                { name: "Product Management", granted: true },
                { name: "Reports & Analytics", granted: true },
                { name: "System Settings", granted: true },
              ]}
            />
            <RoleCard
              name="Manager"
              description="Can manage inventory and products"
              userCount={2}
              permissions={[
                { name: "User Management", granted: false },
                { name: "Inventory Management", granted: true },
                { name: "Product Management", granted: true },
                { name: "Reports & Analytics", granted: true },
                { name: "System Settings", granted: false },
              ]}
            />
            <RoleCard
              name="User"
              description="Basic access to view inventory and products"
              userCount={2}
              permissions={[
                { name: "User Management", granted: false },
                { name: "Inventory Management", granted: false },
                { name: "Product Management", granted: false },
                { name: "Reports & Analytics", granted: false },
                { name: "System Settings", granted: false },
              ]}
            />
          </div>
        </div>
      )}

      {/* System Settings Tab Content */}
      {activeTab === "system" && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">System Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Configure global system settings and preferences</p>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
                <div className="mt-5 space-y-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      defaultValue="InventoryPro Inc."
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      Default Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      defaultValue="America/New_York"
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                      Default Date Format
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      defaultValue="MM/DD/YYYY"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save Settings
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Email Configuration</h3>
                <div className="mt-5 space-y-6">
                  <div>
                    <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700">
                      SMTP Server
                    </label>
                    <input
                      type="text"
                      name="smtpServer"
                      id="smtpServer"
                      defaultValue="smtp.example.com"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      name="smtpPort"
                      id="smtpPort"
                      defaultValue="587"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="emailFrom" className="block text-sm font-medium text-gray-700">
                      From Email Address
                    </label>
                    <input
                      type="email"
                      name="emailFrom"
                      id="emailFrom"
                      defaultValue="noreply@inventorypro.com"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save Email Settings
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">API Configuration</h3>
                <div className="mt-5 space-y-6">
                  <div>
                    <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700">
                      Spring Boot API URL
                    </label>
                    <input
                      type="text"
                      name="apiUrl"
                      id="apiUrl"
                      defaultValue="https://api.example.com/v1"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <input
                      type="password"
                      name="apiKey"
                      id="apiKey"
                      defaultValue="••••••••••••••••"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="enableApi"
                        name="enableApi"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableApi" className="font-medium text-gray-700">
                        Enable API Access
                      </label>
                      <p className="text-gray-500">Allow external applications to access the system via API.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save API Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs Tab Content */}
      {activeTab === "logs" && (
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-gray-900">Activity Logs</h2>
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Export Logs
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Timestamp
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Action
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <LogRow
                  timestamp="2023-05-15 10:30:25"
                  user="John Doe"
                  action="Login"
                  details="User logged in successfully"
                  ipAddress="192.168.1.1"
                />
                <LogRow
                  timestamp="2023-05-15 10:35:12"
                  user="John Doe"
                  action="Create"
                  details="Added new product: Wireless Headphones XZ-400"
                  ipAddress="192.168.1.1"
                />
                <LogRow
                  timestamp="2023-05-14 15:22:45"
                  user="Jane Smith"
                  action="Update"
                  details="Updated inventory: Main Warehouse"
                  ipAddress="192.168.1.2"
                />
                <LogRow
                  timestamp="2023-05-14 14:18:30"
                  user="Jane Smith"
                  action="Login"
                  details="User logged in successfully"
                  ipAddress="192.168.1.2"
                />
                <LogRow
                  timestamp="2023-05-13 09:45:10"
                  user="Robert Johnson"
                  action="Delete"
                  details="Deleted product: Outdated Tablet Model"
                  ipAddress="192.168.1.3"
                />
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function RoleCard({
  name,
  description,
  userCount,
  permissions,
}: {
  name: string
  description: string
  userCount: number
  permissions: { name: string; granted: boolean }[]
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex items-center">
            <span className="mr-4 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
              {userCount} {userCount === 1 ? "user" : "users"}
            </span>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Edit className="mr-2 h-4 w-4 text-gray-500" />
              Edit
            </button>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Permissions</h4>
          <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {permissions.map((permission) => (
              <li key={permission.name} className="flex items-center">
                {permission.granted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-gray-300" />
                )}
                <span className={`ml-2 text-sm ${permission.granted ? "text-gray-900" : "text-gray-500"}`}>
                  {permission.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function LogRow({
  timestamp,
  user,
  action,
  details,
  ipAddress,
}: {
  timestamp: string
  user: string
  action: string
  details: string
  ipAddress: string
}) {
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{timestamp}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            action === "Login"
              ? "bg-blue-100 text-blue-800"
              : action === "Create"
                ? "bg-green-100 text-green-800"
                : action === "Update"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
          }`}
        >
          {action}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{details}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{ipAddress}</td>
    </tr>
  )
}
