'use client';

import React, { useState, useEffect } from 'react';
import OngoingTable from '@/components/OngoingTable';
import { getReservationsByStatus } from '@/lib/mockData';
import type { Reservation } from '@/types';

/**
 * Ongoing Reservations Page
 * 
 * Displays all reservations with Status='Arrived' (currently active reservations).
 * Implements real-time updates and automatic status transitions when departure time passes.
 * 
 * Requirements: 6.1
 */
export default function OngoingPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ongoing reservations
  const fetchReservations = async () => {
    try {
      const data = await getReservationsByStatus('Arrived');
      setReservations(data);
    } catch (error) {
      console.error('Error fetching ongoing reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchReservations();
  }, []);

  // Refresh handler for child component
  const handleRefresh = () => {
    fetchReservations();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading ongoing reservations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ongoing Reservations</h1>
          <p className="text-gray-600 mt-1">
            Currently active reservations ({reservations.length})
          </p>
        </div>
      </div>

      <OngoingTable reservations={reservations} onRefresh={handleRefresh} />
    </div>
  );
}
