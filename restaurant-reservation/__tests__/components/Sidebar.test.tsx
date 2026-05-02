import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/AuthContext";
import { usePathname, useRouter } from "next/navigation";

// Mock the hooks
vi.mock("@/lib/AuthContext");
vi.mock("next/navigation");

describe("Sidebar Component", () => {
  const mockLogout = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useAuth
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
      logout: mockLogout,
    });

    // Mock useRouter
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    } as any);

    // Mock usePathname
    vi.mocked(usePathname).mockReturnValue("/dashboard");
  });

  it("should render the SERVOS branding", () => {
    render(<Sidebar />);
    expect(screen.getByText("SERVOS")).toBeInTheDocument();
    expect(screen.getByText("Restaurant Management")).toBeInTheDocument();
  });

  it("should render all navigation items", () => {
    render(<Sidebar />);
    
    const navItems = [
      "Dashboard",
      "Tables",
      "Reservations",
      "Waitlist",
      "Ongoing",
      "History",
      "Deleted",
      "Profile",
    ];

    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("should highlight the active route", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard/tables");
    render(<Sidebar />);
    
    const tablesLink = screen.getByText("Tables").closest("a");
    expect(tablesLink).toHaveClass("bg-brand-gold");
  });

  it("should call logout and redirect when sign out is clicked", () => {
    render(<Sidebar />);
    
    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should render the sign out button", () => {
    render(<Sidebar />);
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
});
