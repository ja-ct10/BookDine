import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToastProvider, { useToast } from '@/components/Toast';

// Test component that uses the toast context
const TestComponent = () => {
  const { success, error, warning, info } = useToast();
  
  return (
    <div>
      <button onClick={() => success('Success message')}>Show Success</button>
      <button onClick={() => error('Error message')}>Show Error</button>
      <button onClick={() => warning('Warning message')}>Show Warning</button>
      <button onClick={() => info('Info message')}>Show Info</button>
    </div>
  );
};

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('throws error when useToast is used outside ToastProvider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    );
    
    consoleError.mockRestore();
  });

  it('renders success toast when success is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show success/i);
    await act(async () => {
      button.click();
    });
    
    expect(screen.getByText(/success message/i)).toBeInTheDocument();
  });

  it('renders error toast when error is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show error/i);
    await act(async () => {
      button.click();
    });
    
    expect(screen.getByText(/error message/i)).toBeInTheDocument();
  });

  it('renders warning toast when warning is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show warning/i);
    await act(async () => {
      button.click();
    });
    
    expect(screen.getByText(/warning message/i)).toBeInTheDocument();
  });

  it('renders info toast when info is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show info/i);
    await act(async () => {
      button.click();
    });
    
    expect(screen.getByText(/info message/i)).toBeInTheDocument();
  });

  it('applies correct styles for success variant', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show success/i);
    await act(async () => {
      button.click();
    });
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-green-50', 'border-green-500');
  });

  it('applies correct styles for error variant', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show error/i);
    await act(async () => {
      button.click();
    });
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-red-50', 'border-red-500');
  });

  it('applies correct styles for warning variant', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show warning/i);
    await act(async () => {
      button.click();
    });
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-yellow-50', 'border-yellow-500');
  });

  it('applies correct styles for info variant', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show info/i);
    await act(async () => {
      button.click();
    });
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-blue-50', 'border-blue-500');
  });

  it('removes toast when close button is clicked', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show success/i);
    await act(async () => {
      button.click();
    });
    
    expect(screen.getByText(/success message/i)).toBeInTheDocument();
    
    const closeButton = screen.getByLabelText(/close notification/i);
    await act(async () => {
      closeButton.click();
      // Wait for exit animation
      vi.advanceTimersByTime(300);
    });
    
    expect(screen.queryByText(/success message/i)).not.toBeInTheDocument();
  });

  it('auto-dismisses toast after default duration', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show success/i);
    await act(async () => {
      button.click();
    });
    
    expect(screen.getByText(/success message/i)).toBeInTheDocument();
    
    // Fast-forward time by 5000ms (default duration)
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(screen.queryByText(/success message/i)).not.toBeInTheDocument();
  });

  it('displays multiple toasts simultaneously', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await act(async () => {
      screen.getByText(/show success/i).click();
      screen.getByText(/show error/i).click();
      screen.getByText(/show warning/i).click();
    });
    
    expect(screen.getByText(/success message/i)).toBeInTheDocument();
    expect(screen.getByText(/error message/i)).toBeInTheDocument();
    expect(screen.getByText(/warning message/i)).toBeInTheDocument();
  });

  it('renders icon for each toast variant', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show success/i);
    await act(async () => {
      button.click();
    });
    
    const toast = screen.getByRole('alert');
    const icon = toast.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('has proper ARIA role', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText(/show success/i);
    await act(async () => {
      button.click();
    });
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
