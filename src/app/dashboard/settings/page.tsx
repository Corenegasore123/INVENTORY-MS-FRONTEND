"use client";

import { useState } from 'react';
import { Bell, Key, Lock, Mail, User } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Tabs */}
        <div className="mb-6 w-full md:mb-0 md:w-64 md:flex-shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <User
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'
                }`}
              />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === 'account'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Key
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  activeTab === 'account' ? 'text-indigo-600' : 'text-gray-400'
                }`}
              />
              <span>Account</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === 'security'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Lock
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  activeTab === 'security' ? 'text-indigo-600' : 'text-gray-400'
                }`}
              />
              <span>Security</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Bell
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  activeTab === 'notifications' ? 'text-indigo-600' : 'text-gray-400'
                }`}
              />
              <span>Notifications</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 md:ml-8">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
      <p className="mt-1 text-sm text-gray-500">
        Update your personal information and how others see you on the platform.
      </p>

      <form className="mt-6 space-y-6">
        <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-6">
          <div className="sm:w-1/2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              defaultValue="John"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:w-1/2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              defaultValue="Doe"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue="john.doe@example.com"
              className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">
            About
          </label>
          <div className="mt-1">
            <textarea
              id="about"
              name="about"
              rows={3}
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              defaultValue="I'm an inventory manager responsible for tracking and optimizing stock levels across multiple warehouses."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Brief description for your profile. URLs are hyperlinked.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
              <User className="h-full w-full text-gray-300" />
            </span>
            <button
              type="button"
              className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Change
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
      <p className="mt-1 text-sm text-gray-500">
        Manage your account preferences and settings.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Language</h3>
          <div className="mt-2">
            <select
              id="language"
              name="language"
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Time Zone</h3>
          <div className="mt-2">
            <select
              id="timeZone"
              name="timeZone"
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              defaultValue="America/New_York"
            >
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/Denver">Mountain Time (US & Canada)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Date Format</h3>
          <div className="mt-2">
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="dateFormat-mdy"
                  name="dateFormat"
                  type="radio"
                  defaultChecked
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="dateFormat-mdy" className="ml-3 block text-sm text-gray-700">
                  MM/DD/YYYY
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="dateFormat-dmy"
                  name="dateFormat"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="dateFormat-dmy" className="ml-3 block text-sm text-gray-700">
                  DD/MM/YYYY
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="dateFormat-ymd"
                  name="dateFormat"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="dateFormat-ymd" className="ml-3 block text-sm text-gray-700">
                  YYYY-MM-DD
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="deactivate"
                name="deactivate"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="deactivate" className="font-medium text-red-600">
                Deactivate account
              </label>
              <p className="text-gray-500">
                Temporarily disable your account. You can reactivate it anytime.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
      <p className="mt-1 text-sm text-gray-500">
        Manage your password and security preferences.
      </p>

      <form className="mt-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
          <div className="mt-2 space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
          <div className="mt-2">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="twoFactor"
                  name="twoFactor"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="twoFactor" className="font-medium text-gray-700">
                  Enable two-factor authentication
                </label>
                <p className="text-gray-500">
                  Add an extra layer of security to your account by requiring both your password and a verification code.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Login Sessions</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              You're currently logged in on these devices:
            </p>
            <ul className="mt-3 divide-y divide-gray-100 rounded-md border border-gray-200">
              <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                <div className="flex w-0 flex-1 items-center">
                  <span className="ml-2 w-0 flex-1 truncate">
                    <span className="font-medium">Chrome on Windows</span>
                    <span className="block text-gray-500">Last active: Today at 2:43 PM</span>
                  </span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Logout
                  </button>
                </div>
              </li>
              <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                <div className="flex w-0 flex-1 items-center">
                  <span className="ml-2 w-0 flex-1 truncate">
                    <span className="font-medium">Safari on iPhone</span>
                    <span className="block text-gray-500">Last active: Yesterday at 10:12 AM</span>
                  </span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Logout
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
      <p className="mt-1 text-sm text-gray-500">
        Manage how and when you receive notifications.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
          <div className="mt-2 space-y-4">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="emailInventory"
                  name="emailInventory"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailInventory" className="font-medium text-gray-700">
                  Inventory alerts
                </label>
                <p className="text-gray-500">
                  Get notified when inventory levels are low or out of stock.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="emailOrders"
                  name="emailOrders"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailOrders" className="font-medium text-gray-700">
                  Order updates
                </label>
                <p className="text-gray-500">
                  Receive emails for new orders and status changes.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="emailReports"
                  name="emailReports"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailReports" className="font-medium text-gray-700">
                  Weekly reports
                </label>
                <p className="text-gray-500">
                  Get a weekly summary of your inventory and sales.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
          <div className="mt-2 space-y-4">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="pushInventory"
                  name="pushInventory"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="pushInventory" className="font-medium text-gray-700">
                  Inventory alerts
                </label>
                <p className="text-gray-500">
                  Get push notifications for low stock and inventory changes.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="pushOrders"
                  name="pushOrders"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="pushOrders" className="font-medium text-gray-700">
                  Order updates
                </label>
                <p className="text-gray-500">
                  Receive push notifications for new orders and status changes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
