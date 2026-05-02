"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import LoginForm from "./LoginForm";

/**
 * Login page - Client Component
 * Requirements: 1.1, 1.2, 1.3, 1.8
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#5F361D] to-[#3d2313] items-center justify-center p-12">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">BOOKDINE</h1>
          <p className="text-xl italic">&quot;Taste the passion in every plate&quot;</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">Administrator</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <a href="/register" className="text-[#FACF10] hover:text-[#e0b80f] font-semibold">
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
