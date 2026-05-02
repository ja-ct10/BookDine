'use client';

import React, { useEffect, useState } from 'react';
import { getReservationsByStatus } from '@/lib/mockData';
import type { Reservation } from '@/types';
import ReservationTable from '@/components/ReservationTable';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending reservations
  const fetchReservations = async () => {
    try {
      const data = await getReservationsByStatus('Pending');
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
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
        <div className="text-lg text-gray-600">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        <p className="text-gray-600 mt-2">
          Manage pending reservations and update their status
        </p>
      </div>

      <ReservationTable
        reservations={reservations}
        onRefresh={fetchReservations}
      />
    </div>
  );
}
