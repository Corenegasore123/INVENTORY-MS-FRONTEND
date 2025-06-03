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
  type: "WAREHOUSE" | "STORE" | "DISTRIBUTION_CENTER"
  capacity: number
  ownerName: string
  totalProducts: number
  capacityUsedPercentage: number
  createdAt: string
  updatedAt: string
  products?: Product[]
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
  type: "WAREHOUSE" | "STORE" | "DISTRIBUTION_CENTER"
  capacity: number
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
  totalValue: number
}

export interface RecentActivity {
  id: string
  type: "inventory_created" | "product_created" | "inventory_updated" | "product_updated" | "transfer_created" | "transfer_completed" | "transfer_cancelled" | "transfer_updated" | "product_deleted" | "inventory_deleted" | "product_archived"
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
  currentQuantity: number;
  transferQuantity: number;
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
  archived: boolean;
}

export interface StockReportDTO {
  lowStockProducts: LowStockProductDTO[]
  allProducts: ProductStockDTO[]
  totalLowStockItems: number
  totalProducts: number
}

export interface LowStockProductDTO {
  id: number
  name: string
  currentQuantity: number
  minimumStockLevel: number
  inventoryName: string
  location: string
}

export interface ProductStockDTO {
  id: number
  name: string
  currentQuantity: number
  minimumStockLevel: number
  inventoryName: string
  location: string
}

export interface ProductReportDTO {
  id: number
  name: string
  price: number
  quantity: number
  minimumStockLevel: number
  description: string
  inventoryName: string
  location: string
  userEmail: string
  createdAt: string
  updatedAt: string
}

export interface InventoryReportDTO {
  id: number
  name: string
  location: string
  userEmail: string
  totalProducts: number
  totalNetPrice: number
  createdAt: string
  updatedAt: string
}
