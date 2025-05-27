"use client"

import { useEffect } from "react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type]

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  }[type]

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md`}>
        <span className="text-lg font-bold">{icon}</span>
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200 ml-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
