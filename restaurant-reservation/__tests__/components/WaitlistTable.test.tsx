import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WaitlistTable from '@/components/WaitlistTable';
import type { Reservation } from '@/types';

// Mock StatusDropdown
vi.mock('@/components/StatusDropdown', () => ({
  default: ({ reservation }: { reservation: Reservation }) => (
    <div data-testid={`status-${reservation.id}`}>{reservation.status}</div>
  ),
}));

describe('WaitlistTable', () => {
  const mockReservations: Reservation[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      date: '2024-01-15',
      arrivalTime: '12:00',
      departureTime: '14:00',
      tableNumber: 'Table No. 1',
      contactNumber: '+63 917 123 4567',
      status: 'Waiting',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      date: '2024-01-15',
      arrivalTime: '13:00',
      departureTime: '15:00',
      tableNumber: 'Table No. 2',
      contactNumber: '+63 918 234 5678',
      status: 'Waiting',
    },
  ];

  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the waitlist table with reservations', () => {
    render(
      <WaitlistTable
        reservations={mockReservations}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
  });

  it('should display empty state when no reservations', () => {
    render(
      <WaitlistTable
        reservations={[]}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('No customers in waitlist')).toBeInTheDocument();
  });

  it('should filter reservations by search query', async () => {
    render(
      <WaitlistTable
        reservations={mockReservations}
        onRefresh={mockOnRefresh}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search by first name or last name/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.queryByText('Jane')).not.toBeInTheDocument();
    });
  });

  it('should display "no results" message when search has no matches', async () => {
    render(
      <WaitlistTable
        reservations={mockReservations}
        onRefresh={mockOnRefresh}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search by first name or last name/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

    await waitFor(() => {
      expect(screen.getByText('No customers found matching your search')).toBeInTheDocument();
    });
  });

  it('should sort reservations by column', async () => {
    render(
      <WaitlistTable
        reservations={mockReservations}
        onRefresh={mockOnRefresh}
      />
    );

    const firstNameHeader = screen.getByText('First Name').closest('th');
    expect(firstNameHeader).toBeInTheDocument();

    if (firstNameHeader) {
      fireEvent.click(firstNameHeader);
    }

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // First row is header, second should be Jane (alphabetically first)
      expect(rows[1]).toHaveTextContent('Jane');
    });
  });

  it('should call onRefresh every 2 seconds', async () => {
    render(
      <WaitlistTable
        reservations={mockReservations}
        onRefresh={mockOnRefresh}
      />
    );

    expect(mockOnRefresh).not.toHaveBeenCalled();

    // Advance time by 2 seconds
    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    // Advance time by another 2 seconds
    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(2);
    });
  });

  it('should display all required columns', () => {
    render(
      <WaitlistTable
        reservations={mockReservations}
        onRefresh={mockOnRefresh}
      />
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
  });
});
