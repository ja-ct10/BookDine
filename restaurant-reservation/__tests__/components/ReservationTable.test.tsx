import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReservationTable from '@/components/ReservationTable';
import { ToastProvider } from '@/components/Toast';
import type { Reservation } from '@/types';

// Mock the mockData module
vi.mock('@/lib/mockData', () => ({
  deleteMockReservation: vi.fn().mockResolvedValue(true),
}));

const mockReservations: Reservation[] = [
  {
    id: 1,
    date: '2024-01-15',
    arrivalTime: '12:00',
    departureTime: '14:00',
    firstName: 'Maria',
    lastName: 'Santos',
    tableNumber: 'Table No. 5',
    contactNumber: '+63 917 123 4567',
    status: 'Pending',
  },
  {
    id: 2,
    date: '2024-01-15',
    arrivalTime: '18:00',
    departureTime: '20:00',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    tableNumber: 'Table No. 8',
    contactNumber: '+63 918 234 5678',
    status: 'Pending',
  },
];

describe('ReservationTable', () => {
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderWithToast = (component: React.ReactElement) => {
    return render(<ToastProvider>{component}</ToastProvider>);
  };

  it('should render reservation table with data', () => {
    renderWithToast(
      <ReservationTable reservations={mockReservations} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('Santos')).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Dela Cruz')).toBeInTheDocument();
  });

  it('should display all required columns', () => {
    renderWithToast(
      <ReservationTable reservations={mockReservations} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Arrival Time')).toBeInTheDocument();
    expect(screen.getByText('Departure Time')).toBeInTheDocument();
    expect(screen.getByText('Table Number')).toBeInTheDocument();
    expect(screen.getByText('Contact Number')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should filter reservations by search query', () => {
    renderWithToast(
      <ReservationTable reservations={mockReservations} onRefresh={mockOnRefresh} />
    );

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    fireEvent.change(searchInput, { target: { value: 'Maria' } });

    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.queryByText('Juan')).not.toBeInTheDocument();
  });

  it('should sort reservations by column', () => {
    renderWithToast(
      <ReservationTable reservations={mockReservations} onRefresh={mockOnRefresh} />
    );

    const firstNameHeader = screen.getByText('First Name').closest('th');
    fireEvent.click(firstNameHeader!);

    const rows = screen.getAllByRole('row');
    // First row is header, second should be Juan (alphabetically before Maria)
    expect(rows[1]).toHaveTextContent('Juan');
  });

  it('should have delete buttons for each reservation', () => {
    renderWithToast(
      <ReservationTable reservations={mockReservations} onRefresh={mockOnRefresh} />
    );

    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(2);
  });

  it('should display empty state when no reservations', () => {
    renderWithToast(
      <ReservationTable reservations={[]} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('No pending reservations')).toBeInTheDocument();
  });

  it('should display empty state when search has no results', () => {
    renderWithToast(
      <ReservationTable reservations={mockReservations} onRefresh={mockOnRefresh} />
    );

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

    expect(screen.getByText('No reservations found matching your search')).toBeInTheDocument();
  });
});
