"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
    });

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8, // Backend requires >= 8
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  };

  const isPasswordValid = () => {
    return (
      formData.password === formData.confirmPassword &&
      Object.values(passwordValidation).every(Boolean)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    hideToast(); // Hide any existing toast

    // Frontend Validation
    if (!isPasswordValid()) {
      if (formData.password !== formData.confirmPassword) {
        showToast("Passwords do not match", "error");
      } else {
        showToast("Password does not meet all requirements", "error");
      }
      setLoading(false);
      return;
    }

    try {
      const newUser = await apiClient.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Store the new user data temporarily for the redirect
      const userData = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roles: newUser.roles || ["USER"],
        createdAt: newUser.createdAt || new Date().toISOString(),
      };

      // Store in localStorage temporarily
      localStorage.setItem("tempUserData", JSON.stringify(userData));

      showToast(
        "Account created successfully! Redirecting to login...",
        "success"
      );

      // Redirect to login after success
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Signup error:", err);
      // Display specific error message from backend if available
      showToast(err.message || "Failed to create account", "error");
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
            Create your account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              sign in to your existing account
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
                className="grid grid-cols-2 gap-4"
              >
                <Input
                  label="First name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
                <Input
                  label="Last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </motion.div>

              {/* Password Validation Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-2 space-y-2"
              >
                <p className="text-sm font-medium text-gray-700">
                  Password Requirements:
                </p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center text-sm ${
                      passwordValidation.length
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.length ? (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    At least 8 characters long
                  </li>
                  <li
                    className={`flex items-center text-sm ${
                      passwordValidation.uppercase
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.uppercase ? (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Contains uppercase letter
                  </li>
                  <li
                    className={`flex items-center text-sm ${
                      passwordValidation.lowercase
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.lowercase ? (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Contains lowercase letter
                  </li>
                  <li
                    className={`flex items-center text-sm ${
                      passwordValidation.number
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.number ? (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Contains number
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Button
                  type="submit"
                  className="w-full group relative overflow-hidden"
                  disabled={loading || !isPasswordValid()}
                >
                  <span className="relative z-10">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
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
