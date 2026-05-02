'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { Reservation } from '@/types';
import StatusDropdown from './StatusDropdown';
import Modal from './Modal';
import Button from './Button';
import { useToast } from './Toast';
import { deleteMockReservation } from '@/lib/mockData';

interface ReservationTableProps {
  reservations: Reservation[];
  onRefresh: () => void;
}

type SortField = keyof Reservation;
type SortDirection = 'asc' | 'desc';

const ReservationTable: React.FC<ReservationTableProps> = ({
  reservations,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const toast = useToast();

  // Real-time updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onRefresh();
    }, 2000);

    return () => clearInterval(interval);
  }, [onRefresh]);

  // Filter reservations by search query
  const filteredReservations = useMemo(() => {
    if (!searchQuery.trim()) return reservations;

    const lowerQuery = searchQuery.toLowerCase().trim();
    return reservations.filter(
      (r) =>
        r.firstName.toLowerCase().includes(lowerQuery) ||
        r.lastName.toLowerCase().includes(lowerQuery)
    );
  }, [reservations, searchQuery]);

  // Sort reservations
  const sortedReservations = useMemo(() => {
    const sorted = [...filteredReservations];
    sorted.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredReservations, sortField, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle delete button click
  const handleDeleteClick = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!reservationToDelete) return;

    try {
      const success = await deleteMockReservation(reservationToDelete.id);
      if (success) {
        toast.success('Reservation deleted successfully');
        onRefresh();
      } else {
        toast.error('Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('An error occurred while deleting the reservation');
    } finally {
      setDeleteModalOpen(false);
      setReservationToDelete(null);
    }
  };

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by first name or last name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID
                  {renderSortIcon('id')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center gap-1">
                  First Name
                  {renderSortIcon('firstName')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center gap-1">
                  Last Name
                  {renderSortIcon('lastName')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  {renderSortIcon('date')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('arrivalTime')}
              >
                <div className="flex items-center gap-1">
                  Arrival Time
                  {renderSortIcon('arrivalTime')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('departureTime')}
              >
                <div className="flex items-center gap-1">
                  Departure Time
                  {renderSortIcon('departureTime')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('tableNumber')}
              >
                <div className="flex items-center gap-1">
                  Table Number
                  {renderSortIcon('tableNumber')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('contactNumber')}
              >
                <div className="flex items-center gap-1">
                  Contact Number
                  {renderSortIcon('contactNumber')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedReservations.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  {searchQuery ? 'No reservations found matching your search' : 'No pending reservations'}
                </td>
              </tr>
            ) : (
              sortedReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.firstName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.arrivalTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.departureTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.tableNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.contactNumber}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusDropdown
                      reservation={reservation}
                      onStatusChange={onRefresh}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteClick(reservation)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      aria-label={`Delete reservation for ${reservation.firstName} ${reservation.lastName}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the reservation for{' '}
            <span className="font-semibold">
              {reservationToDelete?.firstName} {reservationToDelete?.lastName}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-600">
            This reservation will be moved to the backup storage and can be restored later.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReservationTable;
