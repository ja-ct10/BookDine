import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HistoryTable from '@/components/HistoryTable';
import type { Reservation } from '@/types';

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

describe('HistoryTable', () => {
  it('should render history table with completed reservations', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    expect(screen.getByText('Rosa')).toBeInTheDocument();
    expect(screen.getByText('Martinez')).toBeInTheDocument();
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('Lopez')).toBeInTheDocument();
  });

  it('should display all required columns', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

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

  it('should NOT display Actions column (read-only)', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  it('should NOT have delete buttons (read-only)', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should filter reservations by search query', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    fireEvent.change(searchInput, { target: { value: 'Rosa' } });

    expect(screen.getByText('Rosa')).toBeInTheDocument();
    expect(screen.queryByText('Carlos')).not.toBeInTheDocument();
  });

  it('should filter by last name', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    fireEvent.change(searchInput, { target: { value: 'Lopez' } });

    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.queryByText('Rosa')).not.toBeInTheDocument();
  });

  it('should sort reservations by column', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    const firstNameHeader = screen.getByText('First Name').closest('th');
    fireEvent.click(firstNameHeader!);

    const rows = screen.getAllByRole('row');
    // First row is header, second should be Carlos (alphabetically before Rosa)
    expect(rows[1]).toHaveTextContent('Carlos');
  });

  it('should toggle sort direction on repeated clicks', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    const firstNameHeader = screen.getByText('First Name').closest('th');
    
    // First click - ascending
    fireEvent.click(firstNameHeader!);
    let rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Carlos');

    // Second click - descending
    fireEvent.click(firstNameHeader!);
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Rosa');
  });

  it('should display empty state when no reservations', () => {
    render(<HistoryTable reservations={[]} />);

    expect(screen.getByText('No completed reservations')).toBeInTheDocument();
  });

  it('should display empty state when search has no results', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    const searchInput = screen.getByPlaceholderText('Search by first name or last name...');
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

    expect(screen.getByText('No history found matching your search')).toBeInTheDocument();
  });

  it('should display Completed status badge', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    const statusBadges = screen.getAllByText('Completed');
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  it('should be responsive with overflow-x-auto', () => {
    const { container } = render(<HistoryTable reservations={mockCompletedReservations} />);

    const tableContainer = container.querySelector('.overflow-x-auto');
    expect(tableContainer).toBeInTheDocument();
  });

  it('should display all reservation data correctly', () => {
    render(<HistoryTable reservations={mockCompletedReservations} />);

    // Check first reservation data
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getAllByText('2024-01-14').length).toBeGreaterThan(0);
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('Table No. 7')).toBeInTheDocument();
    expect(screen.getByText('+63 921 567 8901')).toBeInTheDocument();
  });
});
