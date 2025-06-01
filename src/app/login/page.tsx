"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { setToken, setUserRoles, setUserData, isAdmin } from "@/lib/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    hideToast();

    try {
      console.log("=== LOGIN ATTEMPT ===");
      console.log("Email:", email);

      const response = await apiClient.login({ email, password });
      console.log("=== LOGIN RESPONSE ===");
      console.log("Full response:", response);

      // Ensure user object and roles exist in the response
      if (!response.user || !response.user.roles) {
        throw new Error(
          "Invalid response format from server: missing user or roles."
        );
      }

      // Clear any existing data first
      console.log("Clearing localStorage...");
      localStorage.clear();
      console.log("localStorage cleared.");

      // Store token first
      console.log("Setting token...");
      setToken(response.token);
      console.log("✅ Token stored");

      // Store roles
      console.log("Setting user roles with:", response.user.roles);
      setUserRoles([response.user.roles]);
      console.log("✅ Roles stored");

      // Prepare user data
      console.log("Preparing user data...");
      const tempUserData =
        typeof window !== "undefined"
          ? localStorage.getItem("tempUserData")
          : null;
      let userData;

      // Always prefer user data from the direct response
      userData = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName || "",
        lastName: response.user.lastName || "",
        roles: [response.user.roles],
        createdAt: response.user.createdAt || new Date().toISOString(),
      };

      // If for some reason user data is incomplete from backend but exists in temp data, merge (less likely now)
      if (
        tempUserData &&
        (!userData.firstName || !userData.lastName || userData.id === 0)
      ) {
        console.log(
          "Merging with temporary user data due to incomplete backend response."
        );
        const parsedTempData = JSON.parse(tempUserData);
        userData = {
          ...parsedTempData,
          ...userData,
          id:
            userData.id !== 0
              ? userData.id
              : response.user?.id || parsedTempData.id,
          roles:
            userData.roles.length > 0
              ? userData.roles
              : parsedTempData.roles || [],
        };
        localStorage.removeItem("tempUserData");
      }

      console.log("User data prepared:", userData);
      // Store user data
      console.log("Setting user data...");
      setUserData(userData);
      console.log("✅ User data stored:", userData);

      // Test isAdmin function after storing data
      console.log("=== TESTING isAdmin() AFTER STORAGE ===");
      console.log("Checking isAdmin()...");
      const adminCheck = isAdmin();
      console.log("isAdmin() result:", adminCheck);
      console.log("=== isAdmin() TEST COMPLETE ===");

      console.log("Showing success toast...");
      showToast("Login successful! Redirecting...", "success");

      // Redirect based on admin status
      setTimeout(() => {
        if (adminCheck) {
          console.log("=== ADMIN REDIRECT ===");
          window.location.href = "/admin";
        } else {
          console.log("=== USER REDIRECT ===");
          window.location.href = "/dashboard";
        }
      }, 2000);
    } catch (err: any) {
      console.error("Login error caught in catch block:", err);
      showToast(
        err.message || "Invalid email or password. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-lg">IM</span>
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          >
            Sign in to your account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            Or{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              create a new account
            </Link>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 transform hover:shadow-2xl transition-all">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  className="w-full group relative overflow-hidden"
                  disabled={loading}
                >
                  <span className="relative z-10">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6"
            >
              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors group"
                >
                  <span className="inline-block transform group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>{" "}
                  Back to home
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
