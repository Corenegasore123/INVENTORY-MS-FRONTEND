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
    // Remove cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
  }
}

export const getUserRoles = (): string[] => {
  if (typeof window !== "undefined") {
    const roles = localStorage.getItem("userRoles")
    return roles ? JSON.parse(roles) : []
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
