"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import RegisterForm from "./RegisterForm";

/**
 * Registration page - Client Component
 * Requirements: 1.4, 1.5, 1.6, 1.7, 1.9
 */
export default function RegisterPage() {
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

  // Don't render registration form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#5F361D] to-[#3d2313] items-center justify-center p-12">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">SERVOS</h1>
          <p className="text-xl italic">&quot;Taste the passion in every plate&quot;</p>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Register</h2>
            <p className="text-gray-600">Create Administrator Account</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <a href="/login" className="text-[#FACF10] hover:text-[#e0b80f] font-semibold">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
