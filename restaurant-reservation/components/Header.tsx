"use client";

import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";

/**
 * Header Component - Modern SaaS Design
 * Requirements: 2.4, 2.5
 */
export default function Header() {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  // Update date and time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format: "Jan 15, 2024 • 2:30 PM"
      const dateStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      
      setCurrentDateTime(`${dateStr} • ${timeStr}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side - Logo (mobile only) */}
        <div className="lg:hidden flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">S</span>
          </div>
        </div>

        {/* Right side - Date/Time, Notifications, User */}
        <div className="ml-auto flex items-center gap-4">
          {/* Date and Time */}
          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{currentDateTime || "Loading..."}</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-lg transition-colors duration-150">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-stone-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-stone-500">Administrator</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                <span className="text-white text-sm font-semibold">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
