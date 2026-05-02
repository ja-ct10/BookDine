import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardLayout from "@/app/dashboard/layout";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

// Mock the hooks and components
vi.mock("@/lib/AuthContext");
vi.mock("next/navigation");
vi.mock("@/components/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("@/components/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

describe("DashboardLayout Component", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useRouter
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    } as any);
  });

  it("should show loading state while checking authentication", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should redirect to login if not authenticated", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("should render dashboard layout when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render children in main content area", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <DashboardLayout>
        <div data-testid="child-content">Child Content</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });
});
