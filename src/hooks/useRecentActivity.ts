"use client"

import { useState, useEffect } from "react"
import type { RecentActivity } from "@/types"

export function useRecentActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([])

  useEffect(() => {
    // Load activities from localStorage on mount
    const stored = localStorage.getItem("recentActivities")
    if (stored) {
      try {
        setActivities(JSON.parse(stored))
      } catch (error) {
        console.error("Error loading activities:", error)
      }
    }
  }, [])

  const addActivity = (activity: Omit<RecentActivity, "id" | "timestamp">) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    const updatedActivities = [newActivity, ...activities].slice(0, 10) // Keep only last 10
    setActivities(updatedActivities)
    localStorage.setItem("recentActivities", JSON.stringify(updatedActivities))
  }

  return { activities, addActivity }
}
