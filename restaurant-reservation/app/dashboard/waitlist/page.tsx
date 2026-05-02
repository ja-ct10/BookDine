'use client';

import React, { useState, useCallback } from 'react';
import { getReservationsByStatus } from '@/lib/mockData';
import type { Reservation } from '@/types';
import WaitlistTable from '@/components/WaitlistTable';
import AddCustomerModal from '@/components/AddCustomerModal';
import Button from '@/components/Button';

const WaitlistPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch waitlist reservations
  const fetchReservations = useCallback(async () => {
    try {
      const data = await getReservationsByStatus('Waiting');
      setReservations(data);
    } catch (error) {
      console.error('Error fetching waitlist reservations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Handle refresh after adding customer
  const handleRefresh = () => {
    fetchReservations();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading waitlist...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Waitlist</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage customers waiting for table availability
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Customer
        </Button>
      </div>

      {/* Waitlist Table */}
      <WaitlistTable
        reservations={reservations}
        onRefresh={handleRefresh}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default WaitlistPage;
