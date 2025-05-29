import type { User } from "@/types"

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
    // Also set as cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
  }
}

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("userRoles")
    localStorage.removeItem("userData")
    // Remove cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRoles=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
  }
}

export const getUserRoles = (): string[] => {
  if (typeof window !== "undefined") {
    try {
      const roles = localStorage.getItem("userRoles")
      if (roles) {
        const parsedRoles = JSON.parse(roles)
        return Array.isArray(parsedRoles) ? parsedRoles : []
      }
    } catch (error) {
      console.error("Error parsing user roles:", error)
    }
  }
  return []
}

export const setUserRoles = (roles: string[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userRoles", JSON.stringify(roles))
    // Also set as cookie for middleware
    document.cookie = `userRoles=${JSON.stringify(roles)}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
  }
}

export const getUserData = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export const setUserData = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(user))
  }
}

export const isAdmin = (): boolean => {
  const roles = getUserRoles()
  return roles.includes("ADMIN")
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export const logout = (): void => {
  removeToken()
  window.location.href = "/login"
}
