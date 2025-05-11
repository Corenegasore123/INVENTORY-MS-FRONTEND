// This file contains the API service for communicating with the Spring Boot backend

// Base API URL - would be set from environment variables in a real application
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Try to get error message from the response
    let errorMessage
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || `Error: ${response.status}`
    } catch (e) {
      errorMessage = `Error: ${response.status} ${response.statusText}`
    }
    throw new Error(errorMessage)
  }

  // Check if response has content
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    return handleResponse(response)
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    return handleResponse(response)
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    return handleResponse(response)
  },
}

// Inventory API
export const inventoryApi = {
  getAllInventories: async () => {
    const response = await fetch(`${API_BASE_URL}/inventories`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },

  getInventoryById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/inventories/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },

  createInventory: async (inventoryData: any) => {
    const response = await fetch(`${API_BASE_URL}/inventories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(inventoryData),
    })

    return handleResponse(response)
  },

  updateInventory: async (id: string, inventoryData: any) => {
    const response = await fetch(`${API_BASE_URL}/inventories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(inventoryData),
    })

    return handleResponse(response)
  },

  deleteInventory: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/inventories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },
}

// Product API
export const productApi = {
  getAllProducts: async (params?: {
    page?: number
    size?: number
    sort?: string
    search?: string
    inventoryId?: string
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams()
    if (params) {
      if (params.page !== undefined) queryParams.append("page", params.page.toString())
      if (params.size !== undefined) queryParams.append("size", params.size.toString())
      if (params.sort) queryParams.append("sort", params.sort)
      if (params.search) queryParams.append("search", params.search)
      if (params.inventoryId) queryParams.append("inventoryId", params.inventoryId)
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

    const response = await fetch(`${API_BASE_URL}/products${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },

  getProductById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },

  createProduct: async (productData: any) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    })

    return handleResponse(response)
  },

  updateProduct: async (id: string, productData: any) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    })

    return handleResponse(response)
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },
}

// User API
export const userApi = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },

  getUserById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },

  createUser: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    })

    return handleResponse(response)
  },

  updateUser: async (id: string, userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    })

    return handleResponse(response)
  },

  deleteUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },
}

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },

  getRecentActivity: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/activity`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },

  getChartData: async (chartType: string, period: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/charts?type=${chartType}&period=${period}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return handleResponse(response)
  },
}
