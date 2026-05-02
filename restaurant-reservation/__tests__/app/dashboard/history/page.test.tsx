import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HistoryPage from '@/app/dashboard/history/page';
import * as mockData from '@/lib/mockData';
import type { Reservation } from '@/types';

// Mock the mockData module
vi.mock('@/lib/mockData', () => ({
  getReservationsByStatus: vi.fn(),
}));

// Mock the HistoryTable component
vi.mock('@/components/HistoryTable', () => ({
  default: ({ reservations }: { reservations: Reservation[] }) => (
    <div data-testid="history-table">
      <div data-testid="reservation-count">{reservations.length}</div>
    </div>
  ),
}));

describe('HistoryPage', () => {
  const mockCompletedReservations: Reservation[] = [
    {
      id: 5,
      date: '2024-01-14',
      arrivalTime: '12:00',
      departureTime: '14:00',
      firstName: 'Rosa',
      lastName: 'Martinez',
      tableNumber: 'Table No. 7',
      contactNumber: '+63 921 567 8901',
      status: 'Completed',
    },
    {
      id: 6,
      date: '2024-01-14',
      arrivalTime: '18:00',
      departureTime: '20:00',
      firstName: 'Carlos',
      lastName: 'Lopez',
      tableNumber: 'Table No. 10',
      contactNumber: '+63 922 678 9012',
      status: 'Completed',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(mockData.getReservationsByStatus).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<HistoryPage />);
    expect(screen.getByText('Loading history...')).toBeInTheDocument();
  });

  it('should fetch and display completed reservations', async () => {
    vi.mocked(mockData.getReservationsByStatus).mockResolvedValue(mockCompletedReservations);

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Customer History')).toBeInTheDocument();
    });

    expect(screen.getByText('View completed reservations and customer visit history')).toBeInTheDocument();
    expect(screen.getByTestId('history-table')).toBeInTheDocument();
    expect(screen.getByTestId('reservation-count')).toHaveTextContent('2');
  });

  it('should call getReservationsByStatus with "Completed" status', async () => {
    vi.mocked(mockData.getReservationsByStatus).mockResolvedValue(mockCompletedReservations);

    render(<HistoryPage />);

    await waitFor(() => {
      expect(mockData.getReservationsByStatus).toHaveBeenCalledWith('Completed');
    });
  });

  it('should handle empty reservations list', async () => {
    vi.mocked(mockData.getReservationsByStatus).mockResolvedValue([]);

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Customer History')).toBeInTheDocument();
    });

    expect(screen.getByTestId('reservation-count')).toHaveTextContent('0');
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(mockData.getReservationsByStatus).mockRejectedValue(new Error('Fetch failed'));

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Customer History')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching history:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
