"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { registrationSchema, passwordComplexitySchema } from "@/lib/validation";
import { formatErrorForToast } from "@/lib/errorMessages";
import { z } from "zod";

/**
 * Registration form client component with inline validation
 * Requirements: 1.4, 1.5, 1.6, 1.7, 1.9, 13.1, 13.2, 13.5, 13.6, 13.7
 */
export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Clear error for a specific field
  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate a single field
  const validateField = (fieldName: string, value: string) => {
    try {
      if (fieldName === "firstName") {
        registrationSchema.shape.firstName.parse(value);
      } else if (fieldName === "lastName") {
        registrationSchema.shape.lastName.parse(value);
      } else if (fieldName === "username") {
        registrationSchema.shape.username.parse(value);
      } else if (fieldName === "password") {
        passwordComplexitySchema.parse(value);
      } else if (fieldName === "confirmPassword") {
        if (value !== formData.password) {
          throw new z.ZodError([
            {
              code: "custom",
              path: ["confirmPassword"],
              message: "Passwords do not match",
            },
          ]);
        }
      }
      clearFieldError(fieldName);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error.issues[0].message,
        }));
      }
    }
  };

  // Handle input change with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    clearFieldError(name);
    // Also clear confirmPassword error if password changes
    if (name === "password" && errors.confirmPassword) {
      clearFieldError("confirmPassword");
    }
  };

  // Handle input blur with validation
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setIsPending(true);

    // Validate form data
    try {
      registrationSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        setIsPending(false);
        return;
      }
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
      });

      if (!result.success) {
        const errorMessage = formatErrorForToast(result.error || "Registration failed");
        setErrors({ general: errorMessage });
      } else {
        setSuccess(true);
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      const errorMessage = formatErrorForToast(err);
      setErrors({ general: errorMessage });
      console.error("Registration error:", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = () => {
    setErrors({});
    setSuccess(false);
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    const form = document.querySelector("form") as HTMLFormElement;
    form?.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General error message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
          {errors.general}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded" role="alert">
          Registration successful! Redirecting to login...
        </div>
      )}

      {/* First Name field */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
          FIRST NAME
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={`w-full px-4 py-3 border-b-2 transition-colors focus:outline-none ${
            errors.firstName
              ? "border-red-500 focus:border-red-600"
              : "border-gray-300 focus:border-[#5F361D]"
          }`}
          placeholder="Enter your first name"
          disabled={isPending || success}
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? "firstName-error" : undefined}
        />
        {errors.firstName && (
          <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.firstName}
          </p>
        )}
      </div>

      {/* Last Name field */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
          LAST NAME
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={`w-full px-4 py-3 border-b-2 transition-colors focus:outline-none ${
            errors.lastName
              ? "border-red-500 focus:border-red-600"
              : "border-gray-300 focus:border-[#5F361D]"
          }`}
          placeholder="Enter your last name"
          disabled={isPending || success}
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? "lastName-error" : undefined}
        />
        {errors.lastName && (
          <p id="lastName-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.lastName}
          </p>
        )}
      </div>

      {/* Username field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          minLength={3}
          className={`w-full px-4 py-3 border-b-2 transition-colors focus:outline-none ${
            errors.username
              ? "border-red-500 focus:border-red-600"
              : "border-gray-300 focus:border-[#5F361D]"
          }`}
          placeholder="Enter your username (min 3 characters)"
          disabled={isPending || success}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <p id="username-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.username}
          </p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          PASSWORD
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            minLength={8}
            className={`w-full px-4 py-3 border-b-2 transition-colors focus:outline-none pr-12 ${
              errors.password
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 focus:border-[#5F361D]"
            }`}
            placeholder="Min 8 chars, uppercase, lowercase, number, special"
            disabled={isPending || success}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : "password-helper"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.password}
          </p>
        ) : (
          <p id="password-helper" className="mt-1 text-xs text-gray-500">
            Must contain: uppercase, lowercase, number, and special character
          </p>
        )}
      </div>

      {/* Confirm Password field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          CONFIRM PASSWORD
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`w-full px-4 py-3 border-b-2 transition-colors focus:outline-none pr-12 ${
              errors.confirmPassword
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 focus:border-[#5F361D]"
            }`}
            placeholder="Re-enter your password"
            disabled={isPending || success}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending || success}
          className="flex-1 bg-[#1c2120] hover:bg-[#2d3432] text-white font-semibold py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending || success}
          className="flex-1 bg-[#5F361D] hover:bg-[#4a2a17] text-white font-semibold py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
