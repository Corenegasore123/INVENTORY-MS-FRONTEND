import type {
  LoginDTO,
  AuthResponse,
  UserDTO,
  User,
  Inventory,
  InventoryDTO,
  Product,
  ProductDTO,
  UserProfile,
  TransferDTO,
  TransferResponseDTO,
  StockReportDTO,
  ProductReportDTO,
  InventoryReportDTO,
} from "@/types"

const API_BASE_URL = "http://localhost:8081/api"

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Handle query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Create a new options object for fetch to avoid mutating the original and include headers
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(), // Start with auth headers (includes Content-Type if set there)
        ...options.headers, // Allow overriding or adding other headers from options
      },
    };

    // Remove params from fetchOptions as they are already in the URL
    if ((fetchOptions as any).params) {
        delete (fetchOptions as any).params;
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      let errorData;
      try {
        // Attempt to parse error response as JSON
        errorData = await response.json();
        // If JSON has a message or error field, use it
        if (errorData && (errorData.message || errorData.error)) {
             throw new Error(errorData.message || errorData.error);
        }
      } catch (e) {
        // If response is not JSON or doesn't have expected fields, use status text
         console.error("Failed to parse error response as JSON or extract message:", e);
      }
       // Fallback to a generic HTTP error message
      throw new Error(`HTTP error! status: ${response.status}, text: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    console.log("Attempting login with credentials:", credentials)
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    console.log("Login API response:", response)

    // Ensure we have user data in the response
    if (!response.user) {
      console.warn("No user data in login response, creating minimal user object")
      // Create a minimal user object with required 'roles' property
      response.user = {
        id: 0,
        email: credentials.email,
        firstName: "",
        lastName: "",
        roles: "USER", // Added default roles property, assuming USER is a safe default
        createdAt: new Date().toISOString(), // Add a default createdAt
      }
    }

    return response
  }

  async register(userData: UserDTO): Promise<User> {
    console.log("Attempting registration with data:", userData)
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async validateToken(): Promise<string> {
    return this.request("/auth/validate-token")
  }

  async getAllUsers(): Promise<User[]> {
    return this.request("/auth/users")
  }

  // User profile endpoints
  async getUserProfile(): Promise<UserProfile> {
    return this.request("/users/profile")
  }

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    return this.request("/users/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  // Admin endpoints
  async getAdminUsers(): Promise<User[]> {
    return this.request("/admin/users")
  }

  // Inventory endpoints
  async getInventories(): Promise<Inventory[]> {
    return this.request("/inventories")
  }

  async getAllInventories(): Promise<Inventory[]> {
    return this.request("/inventories/all")
  }

  async createInventory(data: InventoryDTO): Promise<Inventory> {
    return this.request("/inventories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateInventory(id: number, data: InventoryDTO): Promise<Inventory> {
    return this.request(`/inventories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteInventory(id: number): Promise<void> {
    return this.request(`/inventories/${id}`, {
      method: "DELETE",
    })
  }

  // Product endpoints
  async getProducts(): Promise<Product[]> {
    return this.request("/products")
  }

  async getAllProducts(): Promise<Product[]> {
    return this.request("/products/all")
  }

  async createProduct(data: ProductDTO): Promise<Product> {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProduct(id: number, data: ProductDTO): Promise<Product> {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: number): Promise<void> {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    })
  }

  // Transfer endpoints
  async getTransfers(): Promise<TransferResponseDTO[]> {
    const response = await this.request<TransferResponseDTO[]>("/transfers")
    return response
  }

  async createTransfer(transfer: TransferDTO): Promise<TransferResponseDTO> {
    const response = await this.request<TransferResponseDTO>("/transfers", {
      method: "POST",
      body: JSON.stringify(transfer),
    })
    return response
  }

  async updateTransferStatus(
    id: number,
    status: "PENDING" | "COMPLETED" | "CANCELLED"
  ): Promise<TransferResponseDTO> {
    const response = await this.request<TransferResponseDTO>(`/transfers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
    return response
  }

  async deleteTransfer(id: number): Promise<void> {
    await this.request(`/transfers/${id}`, {
      method: "DELETE",
    })
  }

  // Report endpoints
  async getStockReport(): Promise<StockReportDTO> {
    const response = await this.request<StockReportDTO>("/reports/stock")
    return response
  }

  async getStockReportByDateRange(startDate: string, endDate: string): Promise<StockReportDTO> {
    const response = await this.request<StockReportDTO>("/reports/stock", {
      params: { startDate, endDate },
    })
    return response
  }

  async getProductReport(): Promise<ProductReportDTO[]> {
    const response = await this.request<ProductReportDTO[]>("/reports/products")
    return response
  }

  async getProductReportByDateRange(startDate: string, endDate: string): Promise<ProductReportDTO[]> {
    const response = await this.request<ProductReportDTO[]>("/reports/products", {
      params: { startDate, endDate },
    })
    return response
  }

  async getInventoryReport(): Promise<InventoryReportDTO[]> {
    const response = await this.request<InventoryReportDTO[]>("/reports/inventories")
    return response
  }

  async getInventoryReportByDateRange(startDate: string, endDate: string): Promise<InventoryReportDTO[]> {
    const response = await this.request<InventoryReportDTO[]>("/reports/inventories", {
      params: { startDate, endDate },
    })
    return response
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
