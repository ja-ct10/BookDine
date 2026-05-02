'use client';

import React, { useEffect, useState } from 'react';
import { getReservationsByStatus } from '@/lib/mockData';
import type { Reservation } from '@/types';
import HistoryTable from '@/components/HistoryTable';

export default function HistoryPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch completed reservations
  const fetchReservations = async () => {
    try {
      const data = await getReservationsByStatus('Completed');
      setReservations(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customer History</h1>
        <p className="text-gray-600 mt-2">
          View completed reservations and customer visit history
        </p>
      </div>

      <HistoryTable reservations={reservations} />
    </div>
  );
}
