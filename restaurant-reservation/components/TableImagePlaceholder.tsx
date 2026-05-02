'use client';

import React from 'react';

interface TableImagePlaceholderProps {
  capacity: number;
}

/**
 * Fallback placeholder for table images
 * Displays a simple SVG representation when the actual image fails to load
 */
const TableImagePlaceholder: React.FC<TableImagePlaceholderProps> = ({
  capacity,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-cream to-gray-100 rounded-lg">
      <div className="text-center">
        {/* Table Icon */}
        <svg
          className="w-24 h-24 mx-auto text-brand-brown opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        
        {/* Capacity Text */}
        <div className="mt-4 text-brand-brown font-semibold text-lg">
          {capacity}-Seat Table
        </div>
        
        {/* Seats Icons */}
        <div className="mt-2 flex items-center justify-center gap-1">
          {Array.from({ length: Math.min(capacity, 8) }).map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 text-brand-brown opacity-40"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableImagePlaceholder;
