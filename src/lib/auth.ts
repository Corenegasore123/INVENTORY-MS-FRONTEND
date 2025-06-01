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
      // First try to get from localStorage
      const roles = localStorage.getItem("userRoles")
      console.log("getUserRoles - Raw userRoles from localStorage:", roles)

      if (roles) {
        const parsedRoles = JSON.parse(roles)
        console.log("getUserRoles - Parsed userRoles:", parsedRoles)
        console.log("getUserRoles - Type of parsed roles:", typeof parsedRoles)
        console.log("getUserRoles - Is array:", Array.isArray(parsedRoles))

        if (Array.isArray(parsedRoles)) {
          console.log("getUserRoles - Returning array:", parsedRoles)
          return parsedRoles
        } else {
          console.log("getUserRoles - Not an array, returning empty array")
          return []
        }
      }

      // Fallback: try to get from userData
      const userData = localStorage.getItem("userData")
      if (userData) {
        const user = JSON.parse(userData)
        console.log("getUserRoles - UserData roles fallback:", user.roles)
        return Array.isArray(user.roles) ? user.roles : []
      }
    } catch (error) {
      console.error("getUserRoles - Error parsing user roles:", error)
    }
  }
  console.log("getUserRoles - Returning empty array (fallback)")
  return []
}

export const setUserRoles = (roles: string[]): void => {
  if (typeof window !== "undefined") {
    console.log("setUserRoles - Setting user roles:", roles)
    console.log("setUserRoles - Type of roles:", typeof roles)
    console.log("setUserRoles - Is array:", Array.isArray(roles))

    localStorage.setItem("userRoles", JSON.stringify(roles))

    // Verify it was stored correctly
    const stored = localStorage.getItem("userRoles")
    console.log("setUserRoles - Verification - stored value:", stored)
    console.log("setUserRoles - Verification - parsed value:", JSON.parse(stored || "[]"))

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
    console.log("setUserData - Setting user data:", user)
    localStorage.setItem("userData", JSON.stringify(user))
  }
}

export const isAdmin = (): boolean => {
  console.log("=== isAdmin() function called ===")

  // Check if we're in browser environment
  if (typeof window === "undefined") {
    console.log("isAdmin - Not in browser environment, returning false")
    return false
  }

  // Get roles directly from localStorage to avoid any function call issues
  const rolesString = localStorage.getItem("userRoles")
  console.log("isAdmin - Raw roles string from localStorage:", rolesString)
  console.log("isAdmin - Type of roles string:", typeof rolesString)

  if (!rolesString) {
    console.log("isAdmin - No roles string found, returning false")
    return false
  }

  try {
    const roles = JSON.parse(rolesString)
    console.log("isAdmin - Parsed roles:", roles)
    console.log("isAdmin - Type of parsed roles:", typeof roles)
    console.log("isAdmin - Is array:", Array.isArray(roles))

    if (!Array.isArray(roles)) {
      console.log("isAdmin - Roles is not an array, returning false")
      return false
    }

    console.log("isAdmin - Roles array length:", roles.length)
    console.log("isAdmin - Roles array contents:", roles)

    // Check each role individually
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i]
      console.log(`isAdmin - Role ${i}:`, role)
      console.log(`isAdmin - Role ${i} type:`, typeof role)
      console.log(`isAdmin - Role ${i} === "ADMIN":`, role === "ADMIN")
      console.log(`isAdmin - Role ${i} length:`, role?.length)
      // console.log(`isAdmin - Role ${i} charCodes:`, role ? Array.from(role).map((ch) => ch.charCodeAt(0)) : "N/A")

      if (role === "ADMIN") {
        console.log("isAdmin - Found ADMIN role, returning true")
        return true
      }
    }

    // Also try includes method
    const includesResult = roles.includes("ADMIN")
    console.log("isAdmin - roles.includes('ADMIN'):", includesResult)

    // Try indexOf method
    const indexOfResult = roles.indexOf("ADMIN")
    console.log("isAdmin - roles.indexOf('ADMIN'):", indexOfResult)

    // Try find method
    const findResult = roles.find((role) => role === "ADMIN")
    console.log("isAdmin - roles.find(role => role === 'ADMIN'):", findResult)

    console.log("isAdmin - No ADMIN role found, returning false")
    return false
  } catch (error) {
    console.error("isAdmin - Error parsing roles:", error)
    return false
  }
}

export const isAuthenticated = (): boolean => {
  const token = getToken()
  const authenticated = !!token
  console.log("isAuthenticated:", authenticated)
  return authenticated
}

export const logout = (): void => {
  removeToken()
  window.location.href = "/login"
}
