// User related types
export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    role: "Admin" | "Manager" | "User"
    status: "Active" | "Inactive"
    lastLogin?: string
    avatar?: string
  }
  
  export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
  }
  
  export interface RegisterData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    agreeToTerms: boolean
  }
  
  // Inventory related types
  export interface Inventory {
    id: string
    name: string
    location: string
    description?: string
    productCount: number
    totalValue: string
    status: "Active" | "Inactive"
    lastUpdated: string
  }
  
  export interface InventoryFormData {
    name: string
    location: string
    description?: string
    status: "Active" | "Inactive"
  }
  
  // Product related types
  export interface Product {
    id: string
    name: string
    sku: string
    description?: string
    category: string
    inventoryId: string
    inventoryName: string
    quantity: number
    price: string
    status: "In Stock" | "Low Stock" | "Out of Stock"
    image?: string
  }
  
  export interface ProductFormData {
    name: string
    sku: string
    description?: string
    category: string
    inventoryId: string
    quantity: number
    price: number
  }
  
  // Dashboard related types
  export interface DashboardStats {
    totalProducts: number
    totalInventories: number
    lowStockItems: number
    totalValue: string
    productChange: string
    inventoryChange: string
    lowStockChange: string
    valueChange: string
  }
  
  export interface ActivityItem {
    id: string
    title: string
    description: string
    time: string
    type: "product" | "inventory" | "user" | "system"
  }
  
  export interface ChartData {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string
      borderColor?: string
    }[]
  }
  
  // Pagination and filtering
  export interface PaginatedResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
    first: boolean
    last: boolean
  }
  
  export interface FilterParams {
    page?: number
    size?: number
    sort?: string
    search?: string
    status?: string
    category?: string
    inventoryId?: string
  }
  