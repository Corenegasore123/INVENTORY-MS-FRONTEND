import type { ReactNode, ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
  children: ReactNode
}

export default function Button({ variant = "primary", size = "md", children, className = "", ...props }: ButtonProps) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow-md",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
    outline:
      "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:ring-blue-500 shadow-sm",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
