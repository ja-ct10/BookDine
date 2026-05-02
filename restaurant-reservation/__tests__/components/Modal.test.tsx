import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '@/components/Modal';

describe('Modal Component', () => {
  beforeEach(() => {
    // Reset body overflow style before each test
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.style.overflow = 'unset';
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText(/test modal/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <div>Content</div>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText(/close modal/i);
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked and closeOnBackdropClick is true', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={true}>
        <div>Content</div>
      </Modal>
    );
    
    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not call onClose when backdrop is clicked and closeOnBackdropClick is false', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={false}>
        <div>Content</div>
      </Modal>
    );
    
    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when modal content is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    await user.click(screen.getByText(/modal content/i));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('applies small size class', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} size="sm">
        <div>Content</div>
      </Modal>
    );
    const modalContent = screen.getByText(/content/i).closest('div.max-w-sm');
    expect(modalContent).toBeInTheDocument();
  });

  it('applies medium size class by default', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );
    const modalContent = screen.getByText(/content/i).closest('div.max-w-md');
    expect(modalContent).toBeInTheDocument();
  });

  it('applies large size class', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} size="lg">
        <div>Content</div>
      </Modal>
    );
    const modalContent = screen.getByText(/content/i).closest('div.max-w-lg');
    expect(modalContent).toBeInTheDocument();
  });

  it('applies xl size class', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} size="xl">
        <div>Content</div>
      </Modal>
    );
    const modalContent = screen.getByText(/content/i).closest('div.max-w-xl');
    expect(modalContent).toBeInTheDocument();
  });

  it('sets body overflow to hidden when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('unset');
  });

  it('has proper ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('renders children content', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      </Modal>
    );
    expect(screen.getByText(/paragraph 1/i)).toBeInTheDocument();
    expect(screen.getByText(/paragraph 2/i)).toBeInTheDocument();
  });
});
