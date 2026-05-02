import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import OngoingPage from '@/app/dashboard/ongoing/page';
import * as mockData from '@/lib/mockData';
import type { Reservation } from '@/types';

// Mock the mockData module
vi.mock('@/lib/mockData', () => ({
  getReservationsByStatus: vi.fn(),
}));

// Mock the OngoingTable component
vi.mock('@/components/OngoingTable', () => ({
  default: ({ reservations, onRefresh }: { reservations: Reservation[]; onRefresh: () => void }) => (
    <div data-testid="ongoing-table">
      <div data-testid="reservation-count">{reservations.length}</div>
      <button onClick={onRefresh} data-testid="refresh-button">Refresh</button>
    </div>
  ),
}));

describe('OngoingPage', () => {
  const mockReservations: Reservation[] = [
    {
      id: 1,
      date: '2024-01-15',
      arrivalTime: '12:00',
      departureTime: '14:00',
      firstName: 'John',
      lastName: 'Doe',
      tableNumber: 'Table No. 5',
      contactNumber: '+63 917 123 4567',
      status: 'Arrived',
    },
    {
      id: 2,
      date: '2024-01-15',
      arrivalTime: '13:00',
      departureTime: '15:00',
      firstName: 'Jane',
      lastName: 'Smith',
      tableNumber: 'Table No. 8',
      contactNumber: '+63 918 234 5678',
      status: 'Arrived',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(mockData.getReservationsByStatus).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<OngoingPage />);
    expect(screen.getByText('Loading ongoing reservations...')).toBeInTheDocument();
  });

  it('should fetch and display ongoing reservations', async () => {
    vi.mocked(mockData.getReservationsByStatus).mockResolvedValue(mockReservations);

    render(<OngoingPage />);

    await waitFor(() => {
      expect(screen.getByText('Ongoing Reservations')).toBeInTheDocument();
    });

    expect(screen.getByText('Currently active reservations (2)')).toBeInTheDocument();
    expect(screen.getByTestId('ongoing-table')).toBeInTheDocument();
    expect(screen.getByTestId('reservation-count')).toHaveTextContent('2');
  });

  it('should call getReservationsByStatus with "Arrived" status', async () => {
    vi.mocked(mockData.getReservationsByStatus).mockResolvedValue(mockReservations);

    render(<OngoingPage />);

    await waitFor(() => {
      expect(mockData.getReservationsByStatus).toHaveBeenCalledWith('Arrived');
    });
  });

  it('should handle empty reservations list', async () => {
    vi.mocked(mockData.getReservationsByStatus).mockResolvedValue([]);

    render(<OngoingPage />);

    await waitFor(() => {
      expect(screen.getByText('Currently active reservations (0)')).toBeInTheDocument();
    });

    expect(screen.getByTestId('reservation-count')).toHaveTextContent('0');
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(mockData.getReservationsByStatus).mockRejectedValue(new Error('Fetch failed'));

    render(<OngoingPage />);

    await waitFor(() => {
      expect(screen.getByText('Ongoing Reservations')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching ongoing reservations:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
