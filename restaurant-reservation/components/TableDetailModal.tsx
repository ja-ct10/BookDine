'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import TableImagePlaceholder from './TableImagePlaceholder';
import type { TableInfo } from '@/types';

export interface TableDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableInfo;
}

const TableDetailModal: React.FC<TableDetailModalProps> = ({
  isOpen,
  onClose,
  table,
}) => {
  const isAvailable = table.status === 'available';
  const [imageError, setImageError] = useState(false);

  // Get the appropriate table image based on capacity
  const getTableImage = (capacity: number): string => {
    return `/tables/table-${capacity}-seats.png`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
      closeOnBackdropClick={true}
    >
      <div className="relative">
        {/* Hero Section with Image */}
        <div className="relative h-72 -mt-6 -mx-6 mb-6 overflow-hidden rounded-t-xl bg-gray-100">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            {imageError ? (
              <div className="w-full h-full bg-gradient-to-br from-brand-cream via-amber-50 to-orange-50">
                <TableImagePlaceholder capacity={table.capacity} />
              </div>
            ) : (
              <>
                <img
                  src={getTableImage(table.capacity)}
                  alt={`${table.capacity}-seat dining table`}
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            )}
          </div>

          {/* Floating Status Badge */}
          <div className="absolute top-4 right-4">
            <div
              className={`
                px-4 py-2 rounded-full text-white font-semibold text-sm shadow-xl backdrop-blur-sm
                ${isAvailable ? 'bg-green-500/90' : 'bg-red-500/90'}
              `}
            >
              {isAvailable ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Available
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Occupied
                </span>
              )}
            </div>
          </div>

          {/* Table Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {table.number}
                </h2>
                <div className="flex items-center gap-2 text-white/90">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-lg font-medium">{table.capacity} Seats</span>
                </div>
              </div>
              
              {/* Capacity Badge */}
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <span className="text-white font-semibold text-sm">
                  Capacity: {table.capacity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {/* Reservation Details or Available State */}
          {!isAvailable && table.reservation ? (
            <div className="space-y-4">
              {/* Current Reservation Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Reservation</h3>
                  <p className="text-sm text-gray-500">Table is currently occupied</p>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
                <div className="space-y-4">
                  {/* Customer Name */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Guest Name</p>
                      <p className="text-lg font-bold text-gray-900">
                        {table.reservation.firstName} {table.reservation.lastName}
                      </p>
                    </div>
                  </div>

                  {/* Time Information */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Arrival Time */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-red-100">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <p className="text-xs font-medium text-gray-500 uppercase">Arrival</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{table.reservation.arrivalTime}</p>
                    </div>

                    {/* Departure Time */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-red-100">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <p className="text-xs font-medium text-gray-500 uppercase">Departure</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{table.reservation.departureTime}</p>
                    </div>
                  </div>

                  {/* Duration Info */}
                  <div className="flex items-center gap-2 pt-2 border-t border-red-200">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      In use until <span className="font-semibold text-gray-900">{table.reservation.departureTime}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Available State */
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Table Available
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Ready for {table.capacity} guests
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-brand-brown mb-1">
                {table.number.replace('Table No. ', '')}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Table Number</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-brand-brown mb-1">
                {table.capacity}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Seats</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <div className={`text-2xl font-bold mb-1 ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {isAvailable ? '✓' : '✕'}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Status</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Close
          </button>
          {isAvailable && (
            <button
              className="px-6 py-2.5 bg-brand-brown text-white rounded-lg hover:bg-[#4a2816] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-brand-brown focus:ring-offset-2 shadow-md"
            >
              Reserve Table
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TableDetailModal;
