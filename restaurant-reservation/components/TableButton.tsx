'use client';

import React from 'react';
import type { TableInfo } from '@/types';

export interface TableButtonProps {
  table: TableInfo;
  onClick: () => void;
}

const TableButton: React.FC<TableButtonProps> = ({ table, onClick }) => {
  // Determine status colors
  const isAvailable = table.status === 'available';
  const statusColor = isAvailable
    ? 'bg-green-500 hover:bg-green-600'
    : 'bg-red-500 hover:bg-red-600';
  const borderColor = isAvailable ? 'border-green-600' : 'border-red-600';
  const textColor = 'text-white';

  // Extract table number (e.g., "Table No. 1" -> "1")
  const tableNumber = table.number.replace('Table No. ', '');

  return (
    <button
      onClick={onClick}
      className={`
        relative aspect-square rounded-lg shadow-md
        ${statusColor} ${textColor}
        border-2 ${borderColor}
        transition-all duration-200
        hover:shadow-lg hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2
        active:scale-95
        flex flex-col items-center justify-center
        p-4
      `}
      aria-label={`${table.number}, ${table.capacity} seats, ${table.status}`}
    >
      {/* Status Indicator Badge */}
      <div
        className={`
          absolute top-2 right-2 w-3 h-3 rounded-full
          ${isAvailable ? 'bg-green-200' : 'bg-red-200'}
          animate-pulse
        `}
        aria-hidden="true"
      ></div>

      {/* Table Number */}
      <div className="text-3xl font-bold mb-1">{tableNumber}</div>

      {/* Capacity */}
      <div className="flex items-center gap-1 text-sm font-medium">
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        <span>{table.capacity}</span>
      </div>

      {/* Status Label */}
      <div className="text-xs font-semibold mt-2 uppercase tracking-wide">
        {isAvailable ? 'Available' : 'Occupied'}
      </div>

      {/* Customer Info (if occupied) */}
      {!isAvailable && table.reservation && (
        <div className="text-xs mt-1 opacity-90 text-center">
          {table.reservation.firstName} {table.reservation.lastName}
        </div>
      )}
    </button>
  );
};

export default TableButton;
