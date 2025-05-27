export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  roles: string[]
  createdAt: string
}

export interface Inventory {
  id: number
  name: string
  location: string
  products: Product[]
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  price: number
  quantity: number
  description: string
  inventoryId: number
  createdAt: string
  updatedAt: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface UserDTO {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface InventoryDTO {
  name: string
  location: string
}

export interface ProductDTO {
  name: string
  price: number
  quantity: number
  description: string
  inventoryId: number
}

export interface AuthResponse {
  token: string
  roles: string[]
}

export interface DashboardStats {
  totalInventories: number
  totalProducts: number
  totalUsers?: number
  lowStockProducts: number
}
