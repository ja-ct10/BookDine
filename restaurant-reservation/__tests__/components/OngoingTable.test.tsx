import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OngoingTable from '@/components/OngoingTable';
import { ToastProvider } from '@/components/Toast';
import * as mockData from '@/lib/mockData';
import type { Reservation } from '@/types';

// Mock the mockData module
vi.mock('@/lib/mockData', async () => {
  const actual = await vi.importActual('@/lib/mockData');
  return {
    ...actual,
    updateReservationStatuses: vi.fn(),
  };
});

// Mock StatusDropdown component
vi.mock('@/components/StatusDropdown', () => ({
  default: ({ reservation }: { reservation: Reservation }) => (
    <div data-testid={`status-dropdown-${reservation.id}`}>
      {reservation.status}
    </div>
  ),
}));

describe('OngoingTable', () => {
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
    {
      id: 3,
      date: '2024-01-15',
      arrivalTime: '14:00',
      departureTime: '16:00',
      firstName: 'Bob',
      lastName: 'Johnson',
      tableNumber: 'Table No. 3',
      contactNumber: '+63 919 345 6789',
      status: 'Arrived',
    },
  ];

  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockData.updateReservationStatuses).mockResolvedValue({
      updated: 0,
      movedToBackup: 0,
    });
  });

  const renderWithToast = (component: React.ReactElement) => {
    return render(<ToastProvider>{component}</ToastProvider>);
  };

  it('should render all ongoing reservations', () => {
    renderWithToast(<OngoingTable reservations={mockReservations} onRefresh={mockOnRefresh} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Johnson')).toBeInTheDocument();
  });

  it('should display search input', () => {
    renderWithToast(<OngoingTable reservations={mockReservations} onRefresh={mockOnRefresh} />);

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should filter reservations by first name', async () => {
    const user = userEvent.setup();
    renderWithToast(<OngoingTable reservations={mockReservations} onRefresh={mockOnRefresh} />);

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    await user.clear(searchInput);
    await user.type(searchInput, 'John');

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  it('should filter reservations by last name', async () => {
    const user = userEvent.setup();
    renderWithToast(<OngoingTable reservations={mockReservations} onRefresh={mockOnRefresh} />);

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    await user.clear(searchInput);
    await user.type(searchInput, 'Smith');

    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });

  it('should display message when no reservations match search', async () => {
    const user = userEvent.setup();
    renderWithToast(<OngoingTable reservations={mockReservations} onRefresh={mockOnRefresh} />);

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    await user.clear(searchInput);
    await user.type(searchInput, 'NonExistent');

    await waitFor(() => {
      expect(screen.getByText('No ongoing reservations found matching your search')).toBeInTheDocument();
    });
  });

  it('should display message when no ongoing reservations', () => {
    renderWithToast(<OngoingTable reservations={[]} onRefresh={mockOnRefresh} />);

    expect(screen.getByText('No ongoing reservations')).toBeInTheDocument();
  });

  it('should sort reservations by column', async () => {
    const user = userEvent.setup();
    renderWithToast(<OngoingTable reservations={mockReservations} onRefresh={mockOnRefresh} />);

    const firstNameHeader = screen.getByText('First Name').closest('th');
    expect(firstNameHeader).toBeInTheDocument();

    // Click to sort ascending
    await user.click(firstNameHeader!);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1]; // Skip header row
      expect(within(firstDataRow).getByText('Bob')).toBeInTheDocument();
    });
  });

  it('should render StatusDropdown for each reservation', () => {
    renderWithToast(<OngoingTable reservations={mockReservations} onRefresh={mockOnRefresh} />);

    expect(screen.getByTestId('status-dropdown-1')).toBeInTheDocument();
    expect(screen.getByTestId('status-dropdown-2')).toBeInTheDocument();
    expect(screen.getByTestId('status-dropdown-3')).toBeInTheDocument();
  });

  it('should display all table columns', () => {
    renderWithToast(<OngoingTable reservations={mockReservations} onRefresh={mockOnRefresh} />);

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
