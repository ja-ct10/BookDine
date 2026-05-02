import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TableButton from '@/components/TableButton';
import type { TableInfo } from '@/types';

describe('TableButton', () => {
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

  it('should render available table with correct styling', () => {
    const handleClick = vi.fn();
    render(<TableButton table={mockAvailableTable} onClick={handleClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-green-500');
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should render occupied table with correct styling', () => {
    const handleClick = vi.fn();
    render(<TableButton table={mockOccupiedTable} onClick={handleClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-red-500');
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Occupied')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<TableButton table={mockAvailableTable} onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    const handleClick = vi.fn();
    render(<TableButton table={mockAvailableTable} onClick={handleClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Table No. 5, 4 seats, available'
    );
  });
});
