import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { ReactNode } from "react";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Wrapper component for testing
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should start with no authenticated user", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should restore session from localStorage", async () => {
      const mockSession = {
        userId: 1,
        firstName: "Test",
        lastName: "User",
        username: "testuser",
      };

      localStorageMock.setItem(
        "servos_mock_session",
        JSON.stringify(mockSession),
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockSession);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("Login", () => {
    it("should login with any credentials", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login("testuser", "password123");
      });

      expect(loginResult.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.username).toBe("testuser");
    });

    it("should reject empty username", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login("", "password123");
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBeDefined();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should reject empty password", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login("testuser", "");
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBeDefined();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should persist session to localStorage", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login("testuser", "password123");
      });

      const storedSession = localStorageMock.getItem("servos_mock_session");
      expect(storedSession).toBeDefined();

      const session = JSON.parse(storedSession!);
      expect(session.username).toBe("testuser");
    });
  });

  describe("Register", () => {
    it("should register a new user with valid data", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          password: "Password123!",
        });
      });

      expect(registerResult.success).toBe(true);
    });

    it("should reject registration with weak password", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          password: "weak",
        });
      });

      expect(registerResult.success).toBe(false);
      expect(registerResult.error).toBeDefined();
    });

    it("should reject registration with missing fields", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          firstName: "",
          lastName: "Doe",
          username: "johndoe",
          password: "Password123!",
        });
      });

      expect(registerResult.success).toBe(false);
      expect(registerResult.error).toBeDefined();
    });

    it("should reject duplicate username", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Register first user
      await act(async () => {
        await result.current.register({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          password: "Password123!",
        });
      });

      // Try to register with same username
      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          firstName: "Jane",
          lastName: "Smith",
          username: "johndoe",
          password: "Password456!",
        });
      });

      expect(registerResult.success).toBe(false);
      expect(registerResult.error).toContain("already taken");
    });
  });

  describe("Logout", () => {
    it("should logout and clear session", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Login first
      await act(async () => {
        await result.current.login("testuser", "password123");
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();

      const storedSession = localStorageMock.getItem("servos_mock_session");
      expect(storedSession).toBeNull();
    });
  });
});
