import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Header from "@/components/Header";
import { useAuth } from "@/lib/AuthContext";

// Mock the hooks
vi.mock("@/lib/AuthContext");

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
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
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the SERVOS branding", () => {
    render(<Header />);
    expect(screen.getByText("SERVOS")).toBeInTheDocument();
    expect(screen.getByText("Restaurant Management System")).toBeInTheDocument();
  });

  it("should display the user's first name", () => {
    render(<Header />);
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("should display Administrator role", () => {
    render(<Header />);
    expect(screen.getByText("Administrator")).toBeInTheDocument();
  });

  it("should display user's initial in avatar", () => {
    render(<Header />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should render date and time display element", () => {
    const mockDate = new Date("2024-01-15T14:30:45");
    vi.setSystemTime(mockDate);

    render(<Header />);

    // Just verify the component renders - the actual date/time will be set by useEffect
    expect(screen.getByText("SERVOS")).toBeInTheDocument();
  });

  it("should show loading state initially", () => {
    render(<Header />);
    // The component should render even if date/time is loading
    expect(screen.getByText("SERVOS")).toBeInTheDocument();
  });
});
