"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { format } from "date-fns";

/**
 * User Profile Page
 * Requirements: 9.1, 9.2, 9.3, 9.4
 * 
 * Displays user profile information including:
 * - First Name, Last Name, Username
 * - Role (System Administrator)
 * - Masked password display
 * - Current date and time
 */

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#5F361D] mb-2">User Profile</h1>
        <p className="text-gray-600">View your account information and details</p>
      </div>

      {/* Current Date and Time Card */}
      <div className="bg-gradient-to-r from-[#5F361D] to-[#7d4a2a] rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Current Date & Time</p>
            <p className="text-2xl font-bold">
              {format(currentDateTime, "MMMM dd, yyyy")}
            </p>
            <p className="text-xl font-semibold mt-1">
              {format(currentDateTime, "hh:mm:ss a")}
            </p>
          </div>
          <div className="text-6xl opacity-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="bg-[#FACF10] px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#5F361D]">Account Information</h2>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                First Name
              </label>
              <div className="bg-[#F6EFBD] border border-gray-300 rounded-lg px-4 py-3">
                <p className="text-gray-900 font-medium">{user.firstName}</p>
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Last Name
              </label>
              <div className="bg-[#F6EFBD] border border-gray-300 rounded-lg px-4 py-3">
                <p className="text-gray-900 font-medium">{user.lastName}</p>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="bg-[#F6EFBD] border border-gray-300 rounded-lg px-4 py-3">
                <p className="text-gray-900 font-medium">{user.username}</p>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Role
              </label>
              <div className="bg-[#F6EFBD] border border-gray-300 rounded-lg px-4 py-3">
                <p className="text-gray-900 font-medium">System Administrator</p>
              </div>
            </div>

            {/* Password (Masked) */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="bg-[#F6EFBD] border border-gray-300 rounded-lg px-4 py-3">
                <p className="text-gray-900 font-medium tracking-wider">
                  ••••••••••••
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password is masked for security purposes
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <span>
              Account created for user ID: {user.userId}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Profile Information</p>
            <p>
              This profile displays your account information. As a System Administrator,
              you have full access to all reservation management features including
              table management, reservations, waitlist, and customer history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
