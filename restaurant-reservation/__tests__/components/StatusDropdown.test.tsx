import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StatusDropdown from '@/components/StatusDropdown';
import { ToastProvider } from '@/components/Toast';
import type { Reservation } from '@/types';

// Mock the mockData module
vi.mock('@/lib/mockData', () => ({
  updateReservationStatus: vi.fn().mockResolvedValue({
    id: 1,
    status: 'Arrived',
  }),
}));

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mockReservation: Reservation = {
  id: 1,
  date: getTodayDate(),
  arrivalTime: '12:00',
  departureTime: '14:00',
  firstName: 'Maria',
  lastName: 'Santos',
  tableNumber: 'Table No. 5',
  contactNumber: '+63 917 123 4567',
  status: 'Pending',
};

describe('StatusDropdown', () => {
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithToast = (component: React.ReactElement) => {
    return render(<ToastProvider>{component}</ToastProvider>);
  };

  it('should render status dropdown with current status', () => {
    renderWithToast(
      <StatusDropdown reservation={mockReservation} onStatusChange={mockOnStatusChange} />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('Pending');
  });

  it('should display all status options', () => {
    renderWithToast(
      <StatusDropdown reservation={mockReservation} onStatusChange={mockOnStatusChange} />
    );

    const select = screen.getByRole('combobox');
    const options = Array.from(select.querySelectorAll('option')).map(
      (option) => option.value
    );

    expect(options).toEqual(['Pending', 'Waiting', 'Arrived', 'Completed', 'Cancelled']);
  });

  it('should show confirmation modal for cancellation', async () => {
    renderWithToast(
      <StatusDropdown reservation={mockReservation} onStatusChange={mockOnStatusChange} />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Cancelled' } });

    await waitFor(() => {
      expect(screen.getByText('Confirm Cancellation')).toBeInTheDocument();
      expect(screen.getByText(/Maria Santos/)).toBeInTheDocument();
    });
  });

  it('should prevent status change to Arrived before arrival time', async () => {
    const futureReservation: Reservation = {
      ...mockReservation,
      arrivalTime: '23:59', // Future time
    };

    renderWithToast(
      <StatusDropdown reservation={futureReservation} onStatusChange={mockOnStatusChange} />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Arrived' } });

    await waitFor(() => {
      expect(screen.getByText(/Cannot mark as arrived before arrival time/)).toBeInTheDocument();
    });
  });

  it('should prevent status change for non-today reservations except cancellation', async () => {
    const futureReservation: Reservation = {
      ...mockReservation,
      date: '2025-12-31',
    };

    renderWithToast(
      <StatusDropdown reservation={futureReservation} onStatusChange={mockOnStatusChange} />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Arrived' } });

    await waitFor(() => {
      expect(
        screen.getByText(/Status can only be changed for today's reservations/)
      ).toBeInTheDocument();
    });
  });

  it('should apply correct color classes for different statuses', () => {
    const statuses: Array<{ status: Reservation['status']; colorClass: string }> = [
      { status: 'Pending', colorClass: 'bg-yellow-100' },
      { status: 'Waiting', colorClass: 'bg-blue-100' },
      { status: 'Arrived', colorClass: 'bg-green-100' },
      { status: 'Completed', colorClass: 'bg-gray-100' },
      { status: 'Cancelled', colorClass: 'bg-red-100' },
    ];

    statuses.forEach(({ status, colorClass }) => {
      const { container } = renderWithToast(
        <StatusDropdown
          reservation={{ ...mockReservation, status }}
          onStatusChange={mockOnStatusChange}
        />
      );

      const select = container.querySelector('select');
      expect(select).toHaveClass(colorClass);
    });
  });
});
