import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCustomerModal from '@/components/AddCustomerModal';
import * as mockData from '@/lib/mockData';

// Mock the mockData module
vi.mock('@/lib/mockData', () => ({
  getTableConfigurations: vi.fn(() => [
    { number: 'Table No. 1', capacity: 2 },
    { number: 'Table No. 2', capacity: 2 },
    { number: 'Table No. 3', capacity: 4 },
  ]),
  checkTableAvailability: vi.fn(() => Promise.resolve(true)),
  createMockReservation: vi.fn(() => Promise.resolve({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    date: '2024-01-15',
    arrivalTime: '12:00',
    departureTime: '14:00',
    tableNumber: 'Table No. 1',
    contactNumber: '+63 917 123 4567',
    status: 'Arrived',
  })),
}));

// Mock Toast
vi.mock('@/components/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

describe('AddCustomerModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal when open', () => {
    render(
      <AddCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <AddCustomerModal
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText('Add Customer')).not.toBeInTheDocument();
  });

  it('should display table selection dropdown', () => {
    render(
      <AddCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const tableSelect = screen.getByLabelText(/table number/i);
    expect(tableSelect).toBeInTheDocument();
    
    // Check that tables are in the dropdown
    expect(screen.getByText('Table No. 1 - 2 seats')).toBeInTheDocument();
    expect(screen.getByText('Table No. 2 - 2 seats')).toBeInTheDocument();
    expect(screen.getByText('Table No. 3 - 4 seats')).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    render(
      <AddCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add customer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fix the validation errors/i)).toBeInTheDocument();
    });
  });

  it('should call onSuccess and onClose after successful submission', async () => {
    render(
      <AddCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/departure time/i), {
      target: { value: '14:00' },
    });
    fireEvent.change(screen.getByLabelText(/table number/i), {
      target: { value: 'Table No. 1' },
    });
    fireEvent.change(screen.getByLabelText(/contact number/i), {
      target: { value: '+63 917 123 4567' },
    });

    const submitButton = screen.getByRole('button', { name: /add customer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockData.createMockReservation).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should display table preview when table is selected', async () => {
    render(
      <AddCustomerModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const tableSelect = screen.getByLabelText(/table number/i);
    fireEvent.change(tableSelect, { target: { value: 'Table No. 1' } });

    await waitFor(() => {
      expect(screen.getByText('Table Preview')).toBeInTheDocument();
    });
  });
});
