"use client";

import { useState, useEffect } from "react";
import { getUserData, getUserRoles } from "@/lib/auth";
import Card from "@/components/ui/Card";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

export default function ProfilePage() {
  const { toast, showToast, hideToast } = useToast();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    // Get roles and ensure it's always an array
    const roles = getUserRoles();
    const validRoles = Array.isArray(roles) ? roles : [];
    setUserRoles(validRoles);

    // Get user data from localStorage
    const userData = getUserData();
    console.log("User data from localStorage:", userData);

    if (userData) {
      setUserInfo({
        id: userData.id || 0,
        email: userData.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      });
    }

    setLoading(false);
  }, []);

  const getDisplayName = () => {
    if (userInfo.firstName && userInfo.lastName) {
      return `${userInfo.firstName} ${userInfo.lastName}`;
    } else if (userInfo.firstName) {
      return userInfo.firstName;
    } else if (userInfo.email) {
      return userInfo.email;
    }
    return "User";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Welcome, {getDisplayName()}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Personal Information
          </h2>
          <div className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Names
              </label>
              <p className="text-gray-900">
                {getDisplayName()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-gray-900">
                {userInfo.email || "Not available"}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="flex space-x-2">
                {Array.isArray(userRoles) && userRoles.length > 0 ? (
                  userRoles.map((role) => (
                    <span
                      key={role}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        role === "ADMIN"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    USER
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          System Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Login
            </label>
            <p className="text-gray-900">Today</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Status
            </label>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
