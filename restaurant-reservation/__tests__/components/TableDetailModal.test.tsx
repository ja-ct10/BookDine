import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TableDetailModal from '@/components/TableDetailModal';
import type { TableInfo } from '@/types';

describe('TableDetailModal', () => {
  const mockAvailableTable: TableInfo = {
    number: 'Table No. 5',
    capacity: 4,
    status: 'available',
  };

  const mockOccupiedTable: TableInfo = {
    number: 'Table No. 8',
    capacity: 6,
    status: 'occupied',
    reservation: {
      firstName: 'John',
      lastName: 'Doe',
      arrivalTime: '12:00',
      departureTime: '14:00',
    },
  };

  it('should render available table details', () => {
    const handleClose = vi.fn();
    render(
      <TableDetailModal
        isOpen={true}
        onClose={handleClose}
        table={mockAvailableTable}
      />
    );

    expect(screen.getByText('Table No. 5')).toBeInTheDocument();
    expect(screen.getByText('✅ Available')).toBeInTheDocument();
    expect(screen.getByText('4 seats')).toBeInTheDocument();
    expect(screen.getByText('Table Available')).toBeInTheDocument();
    expect(
      screen.getByText('This table is currently available for new reservations.')
    ).toBeInTheDocument();
  });

  it('should render occupied table details with customer information', () => {
    const handleClose = vi.fn();
    render(
      <TableDetailModal
        isOpen={true}
        onClose={handleClose}
        table={mockOccupiedTable}
      />
    );

    expect(screen.getByText('Table No. 8')).toBeInTheDocument();
    expect(screen.getByText('🔴 Occupied')).toBeInTheDocument();
    expect(screen.getByText('6 seats')).toBeInTheDocument();
    expect(screen.getByText('Current Reservation')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <TableDetailModal
        isOpen={true}
        onClose={handleClose}
        table={mockAvailableTable}
      />
    );

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not render when isOpen is false', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <TableDetailModal
        isOpen={false}
        onClose={handleClose}
        table={mockAvailableTable}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
