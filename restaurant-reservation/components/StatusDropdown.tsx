'use client';

import React, { useState } from 'react';
import type { Reservation, ReservationStatus } from '@/types';
import { updateReservationStatus } from '@/lib/mockData';
import { useToast } from './Toast';
import { formatErrorForToast } from '@/lib/errorMessages';
import Modal from './Modal';
import Button from './Button';

interface StatusDropdownProps {
  reservation: Reservation;
  onStatusChange: () => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  reservation,
  onStatusChange,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ReservationStatus | null>(null);
  const toast = useToast();

  const statusOptions: ReservationStatus[] = [
    'Pending',
    'Waiting',
    'Arrived',
    'Completed',
    'Cancelled',
  ];

  // Get status badge color
  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Waiting':
        return 'bg-blue-100 text-blue-800';
      case 'Arrived':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get current time in HH:mm format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Validate status change
  const validateStatusChange = (newStatus: ReservationStatus): { valid: boolean; error?: string } => {
    const today = getTodayDate();
    const currentTime = getCurrentTime();

    // Cancellation is always allowed
    if (newStatus === 'Cancelled') {
      return { valid: true };
    }

    // Status changes only for today's reservations (except cancellations)
    if (reservation.date !== today) {
      return {
        valid: false,
        error: 'Status can only be changed for today\'s reservations (except cancellations)',
      };
    }

    // Arrived status validation
    if (newStatus === 'Arrived') {
      // Check if current time >= arrival time AND date is today
      if (currentTime < reservation.arrivalTime) {
        return {
          valid: false,
          error: `Cannot mark as arrived before arrival time (${reservation.arrivalTime})`,
        };
      }
    }

    return { valid: true };
  };

  // Handle status change
  const handleStatusChange = async (newStatus: ReservationStatus) => {
    if (newStatus === reservation.status) return;

    // Show confirmation modal for cancellation
    if (newStatus === 'Cancelled') {
      setPendingStatus(newStatus);
      setConfirmModalOpen(true);
      return;
    }

    // Validate status change
    const validation = validateStatusChange(newStatus);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid status change');
      return;
    }

    // Update status
    await performStatusUpdate(newStatus);
  };

  // Perform the actual status update
  const performStatusUpdate = async (newStatus: ReservationStatus) => {
    setIsChanging(true);
    try {
      const result = await updateReservationStatus(reservation.id, newStatus);
      if (result) {
        toast.success(`Status updated to ${newStatus}`);
        onStatusChange();
      } else {
        toast.error('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = formatErrorForToast(error);
      toast.error(errorMessage);
    } finally {
      setIsChanging(false);
    }
  };

  // Handle cancellation confirmation
  const handleCancelConfirm = async () => {
    if (pendingStatus === 'Cancelled') {
      await performStatusUpdate(pendingStatus);
    }
    setConfirmModalOpen(false);
    setPendingStatus(null);
  };

  return (
    <>
      <select
        value={reservation.status}
        onChange={(e) => handleStatusChange(e.target.value as ReservationStatus)}
        disabled={isChanging}
        className={`
          px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-brand-brown
          ${getStatusColor(reservation.status)}
          ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Cancellation"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to cancel the reservation for{' '}
            <span className="font-semibold">
              {reservation.firstName} {reservation.lastName}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-600">
            Date: {reservation.date} at {reservation.arrivalTime}
          </p>
          <p className="text-sm text-gray-600">
            Table: {reservation.tableNumber}
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmModalOpen(false);
                setPendingStatus(null);
              }}
            >
              No, Keep It
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelConfirm}
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StatusDropdown;
