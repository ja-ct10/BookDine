"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  // Static data - no loading state needed
  const stats = {
    totalReservations: 48,
    occupiedTables: 9,
    pendingReservations: 12,
    ongoingReservations: 9,
    waitlistCustomers: 5,
    completedToday: 22,
  };

  // Stat cards configuration with outlined icons
  const statCards = [
    {
      title: "Total Reservations",
      value: stats.totalReservations,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "blue",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Occupied Tables",
      value: `${stats.occupiedTables}/15`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: "amber",
      trend: "60%",
      trendUp: null,
    },
    {
      title: "Pending",
      value: stats.pendingReservations,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "yellow",
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Ongoing",
      value: stats.ongoingReservations,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "green",
      trend: "Active",
      trendUp: null,
    },
    {
      title: "Waitlist",
      value: stats.waitlistCustomers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "purple",
      trend: "5 waiting",
      trendUp: null,
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "teal",
      trend: "+5",
      trendUp: true,
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      icon: "text-blue-500",
      border: "border-blue-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: "text-amber-500",
      border: "border-amber-100",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      icon: "text-yellow-500",
      border: "border-yellow-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      icon: "text-green-500",
      border: "border-green-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      icon: "text-purple-500",
      border: "border-purple-100",
    },
    teal: {
      bg: "bg-teal-50",
      text: "text-teal-600",
      icon: "text-teal-500",
      border: "border-teal-100",
    },
  };

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-stone-50 via-white to-stone-50 min-h-screen">
      {/* Welcome Card with enhanced gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Welcome back, {user?.firstName || "Administrator"}! 👋
          </h1>
          <p className="text-amber-50 text-lg font-medium">
            You have <span className="font-bold text-white">{stats.pendingReservations}</span> pending reservations today
          </p>
        </div>
      </div>

      {/* Quick Statistics with enhanced design */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-900">
            Overview
          </h2>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => {
            const colors = colorClasses[card.color as keyof typeof colorClasses];
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-3.5 ${colors.bg} rounded-xl ${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  {card.trend && (
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      card.trendUp === true
                        ? "bg-green-100 text-green-700"
                        : card.trendUp === false
                        ? "bg-red-100 text-red-700"
                        : "bg-stone-100 text-stone-700"
                    }`}>
                      {card.trendUp === true && "↑ "}
                      {card.trendUp === false && "↓ "}
                      {card.trend}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
                  {card.title}
                </h3>
                <p className={`text-4xl font-bold ${colors.text} group-hover:scale-105 transition-transform duration-300`}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions with enhanced design */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/dashboard/reservations"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="p-3 bg-blue-500 rounded-xl text-white w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-1 group-hover:text-blue-600 transition-colors">
                Reservations
              </h3>
              <p className="text-sm text-stone-600">
                Manage all bookings
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/tables"
            className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-100/50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="p-3 bg-green-500 rounded-xl text-white w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-1 group-hover:text-green-600 transition-colors">
                Tables
              </h3>
              <p className="text-sm text-stone-600">
                View floor plan
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/waitlist"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="p-3 bg-purple-500 rounded-xl text-white w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-1 group-hover:text-purple-600 transition-colors">
                Waitlist
              </h3>
              <p className="text-sm text-stone-600">
                Add walk-ins
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/ongoing"
            className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border-2 border-amber-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="p-3 bg-amber-500 rounded-xl text-white w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-1 group-hover:text-amber-600 transition-colors">
                Ongoing
              </h3>
              <p className="text-sm text-stone-600">
                Active service
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
