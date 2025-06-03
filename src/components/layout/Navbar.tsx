"use client";

import { useState, useEffect } from "react";
import { logout, isAdmin, getUserRoles, getUserData } from "@/lib/auth";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [userName, setUserName] = useState("");
  const userIsAdmin = isAdmin();

  useEffect(() => {
    // Get user data from localStorage
    const userData = getUserData();

    if (userData) {
      // Set user name from stored data
      const fullName = `${userData.firstName} ${userData.lastName}`.trim();
      setUserName(fullName || userData.email);

      // Generate initials from name
      if (userData.firstName && userData.lastName) {
        setUserInitials(
          `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`
        );
      } else if (userData.firstName) {
        setUserInitials(userData.firstName.charAt(0));
      } else if (userData.email) {
        setUserInitials(userData.email.charAt(0).toUpperCase());
      } else {
        setUserInitials("U");
      }
    } else {
      // Fallback if no user data is available
      const roles = getUserRoles();
      if (roles.includes("ADMIN")) {
        setUserName("Admin User");
        setUserInitials("AU");
      } else {
        setUserName("User");
        setUserInitials("U");
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-all duration-200 p-2 rounded-lg hover:bg-gray-50/80"
              >
                <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                  <span className="text-white text-sm font-semibold">
                    {userInitials}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userIsAdmin ? "Administrator" : "User"}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400 transition-transform duration-200"
                  style={{
                    transform: isDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transform transition-all duration-200 ease-out">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userIsAdmin ? "Administrator" : "User"}
                    </p>
                  </div>
                  <a
                    href={userIsAdmin ? "/admin/profile" : "/dashboard/profile"}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span>Profile</span>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-purple-50 rounded-lg">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span>Settings</span>
                    </div>
                  </a>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-red-50 rounded-lg">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </div>
                        <span>Sign out</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
