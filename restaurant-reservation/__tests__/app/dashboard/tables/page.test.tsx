import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TablesPage from '@/app/dashboard/tables/page';
import * as mockData from '@/lib/mockData';
import type { TableInfo } from '@/types';

// Mock the mockData module
vi.mock('@/lib/mockData', () => ({
  getTableStatuses: vi.fn(),
}));

describe('TablesPage', () => {
  const mockTables: TableInfo[] = [
    {
      number: 'Table No. 1',
      capacity: 2,
      status: 'available',
    },
    {
      number: 'Table No. 2',
      capacity: 2,
      status: 'available',
    },
    {
      number: 'Table No. 3',
      capacity: 4,
      status: 'occupied',
      reservation: {
        firstName: 'John',
        lastName: 'Doe',
        arrivalTime: '12:00',
        departureTime: '14:00',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockData.getTableStatuses).mockResolvedValue(mockTables);
  });

  it('should render page header', async () => {
    render(<TablesPage />);

    await waitFor(() => {
      expect(screen.getByText('Table Floor Plan 🪑')).toBeInTheDocument();
    });

    expect(
      screen.getByText('View real-time table availability and customer assignments')
    ).toBeInTheDocument();
  });

  it('should display statistics correctly', async () => {
    render(<TablesPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Tables')).toBeInTheDocument();
    });

    // Check that statistics section exists
    expect(screen.getAllByText('3').length).toBeGreaterThan(0); // Total tables
    expect(screen.getAllByText('Available').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0); // Available count
    expect(screen.getAllByText('Occupied').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0); // Occupied count
  });

  it('should render all table buttons', async () => {
    render(<TablesPage />);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(3);
    });

    // Check for table buttons by aria-label
    expect(screen.getByLabelText('Table No. 1, 2 seats, available')).toBeInTheDocument();
    expect(screen.getByLabelText('Table No. 2, 2 seats, available')).toBeInTheDocument();
    expect(screen.getByLabelText('Table No. 3, 4 seats, occupied')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    render(<TablesPage />);

    // Check for loading skeleton
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should call getTableStatuses on mount', async () => {
    render(<TablesPage />);

    await waitFor(() => {
      expect(mockData.getTableStatuses).toHaveBeenCalled();
    });
  });
});
