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
} from "@/types"

const API_BASE_URL = "http://localhost:8081/api"

class ApiClient {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    console.log("API Request:", url, config)

    try {
      const response = await fetch(url, config)
      console.log("API Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log("API Response data:", data)
      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
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
      response.user = {
        id: 0,
        email: credentials.email,
        firstName: "",
        lastName: "",
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
}

export const apiClient = new ApiClient()
