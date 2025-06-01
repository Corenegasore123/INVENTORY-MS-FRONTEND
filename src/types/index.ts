export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  roles: string
  createdAt?: string
}

export interface UserProfile {
  id: number
  email: string
  firstName: string
  lastName: string
  roles: string[]
  createdAt: string
  lastLogin?: string
}

export interface Inventory {
  id: number
  name: string
  location: string
  products?: Product[]
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
  minimumStockLevel: number
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
  minimumStockLevel: number
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    firstName: string
    lastName: string
    roles: string
    createdAt?: string
  }
}

export interface DashboardStats {
  totalInventories: number
  totalProducts: number
  totalUsers?: number
  lowStockProducts: number
}

export interface RecentActivity {
  id: string
  type: "inventory_created" | "product_created" | "inventory_updated" | "product_updated" | "transfer_created" | "transfer_completed" | "transfer_cancelled" | "transfer_updated"
  title: string
  description: string
  timestamp: string
  icon: string
  color: string
}

export interface TransferDTO {
  productId: number;
  sourceInventoryId: number;
  destinationInventoryId: number;
  quantity: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

export interface TransferResponseDTO {
  id: number;
  productId: number;
  productName: string;
  sourceInventoryId: number;
  sourceInventoryName: string;
  destinationInventoryId: number;
  destinationInventoryName: string;
  quantity: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface StockReportDTO {
  totalProducts: number
  totalValue: number
  lowStockProducts: Product[]
  outOfStockProducts: Product[]
}

export interface ProductReportDTO {
  productId: number
  productName: string
  totalQuantity: number
  totalValue: number
  averagePrice: number
}

export interface InventoryReportDTO {
  inventoryId: number
  inventoryName: string
  totalProducts: number
  totalValue: number
  averageProductValue: number
}
