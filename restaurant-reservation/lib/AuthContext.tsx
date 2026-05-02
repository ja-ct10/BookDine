"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Session, User } from "@/types";
import { ERROR_CODES, getErrorMessage } from "./errorMessages";

/**
 * Authentication Context for managing mock authentication state
 * Requirements: 1.8, 1.10
 * 
 * This context provides:
 * - User authentication state
 * - Login/logout functions
 * - Session persistence via localStorage
 */

// ============================================================================
// Types
// ============================================================================

interface AuthContextType {
  user: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
  SESSION: "servos_mock_session",
  USERS: "servos_mock_users",
} as const;

// Initial mock users
const INITIAL_USERS: User[] = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    username: "admin",
    password: "admin123", // Plain text for mock
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Loads users from localStorage or returns initial users
 */
function loadUsers(): User[] {
  if (typeof window === "undefined") return INITIAL_USERS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default users
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  } catch (error) {
    console.error("Error loading users from localStorage:", error);
    return INITIAL_USERS;
  }
}

/**
 * Saves users to localStorage
 */
function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users to localStorage:", error);
  }
}

/**
 * Loads session from localStorage
 */
function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading session from localStorage:", error);
    return null;
  }
}

/**
 * Saves session to localStorage
 */
function saveSession(session: Session | null): void {
  if (typeof window === "undefined") return;
  
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  } catch (error) {
    console.error("Error saving session to localStorage:", error);
  }
}

/**
 * Validates password complexity
 * Requirements: 1.5
 */
function validatePasswordComplexity(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character" };
  }
  return { valid: true };
}

// ============================================================================
// Provider Component
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const session = loadSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  /**
   * Mock login function - accepts any credentials
   * Requirements: 1.1, 1.2, 1.3, 1.8
   */
  const login = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Validate input
    if (!username || !password) {
      const errorMsg = getErrorMessage(ERROR_CODES.REQUIRED_FIELD);
      return { success: false, error: errorMsg.message };
    }

    // For mock authentication, we accept any credentials
    // But we'll check if the user exists in our mock users list
    const users = loadUsers();
    let mockUser = users.find((u) => u.username === username);

    // If user doesn't exist, create a mock user with the provided credentials
    if (!mockUser) {
      mockUser = {
        id: Date.now(),
        firstName: "Mock",
        lastName: "User",
        username: username,
        password: password,
      };
      users.push(mockUser);
      saveUsers(users);
    }

    // Create session
    const session: Session = {
      userId: mockUser.id,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      username: mockUser.username,
    };

    setUser(session);
    saveSession(session);

    return { success: true };
  };

  /**
   * Mock registration function
   * Requirements: 1.4, 1.5, 1.6, 1.7, 1.9
   */
  const register = async (userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Validate input
    if (!userData.firstName || !userData.lastName || !userData.username || !userData.password) {
      const errorMsg = getErrorMessage(ERROR_CODES.REQUIRED_FIELD);
      return { success: false, error: errorMsg.message };
    }

    // Validate password complexity
    const passwordValidation = validatePasswordComplexity(userData.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    // Check if username already exists
    const users = loadUsers();
    const existingUser = users.find((u) => u.username === userData.username);
    if (existingUser) {
      const errorMsg = getErrorMessage(ERROR_CODES.USERNAME_EXISTS);
      return { success: false, error: errorMsg.message };
    }

    // Create new user
    const newUser: User = {
      id: Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      password: userData.password, // Plain text for mock
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true };
  };

  /**
   * Logout function
   * Requirements: 1.10
   */
  const logout = () => {
    setUser(null);
    saveSession(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the current session from localStorage (for server-side checks)
 */
export function getStoredSession(): Session | null {
  return loadSession();
}

/**
 * Clears the stored session (for server-side logout)
 */
export function clearStoredSession(): void {
  saveSession(null);
}
