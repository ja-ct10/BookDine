'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TablePreviewCarouselProps {
  tableNumber: string;
  capacity: number;
}

const TablePreviewCarousel: React.FC<TablePreviewCarouselProps> = ({
  tableNumber,
  capacity,
}) => {
  const [currentView, setCurrentView] = useState(0);

  // Extract table number from "Table No. X" format
  const tableNum = tableNumber.replace('Table No. ', '');

  // Determine image paths based on table number
  // Tables 1-11, 14, 15 have individual images
  // Tables 12-13 share images (Table12and13.png)
  // Tables 5-6 share images (Table5and6.png)
  // Tables 8-9 share images (Table8and9.png)
  const getImagePaths = (): string[] => {
    const num = parseInt(tableNum);
    
    if (num === 12 || num === 13) {
      return ['/images/Table12and13.png', '/images/Table12and13.1.png'];
    } else if (num === 5 || num === 6) {
      return ['/images/Table5and6.png', '/images/Table5and6.1.png'];
    } else if (num === 8 || num === 9) {
      return ['/images/Table8and9.png', '/images/Table8and9.1.png'];
    } else {
      return [`/images/Table${tableNum}.png`, `/images/Table${tableNum}.1.png`];
    }
  };

  const imagePaths = getImagePaths();
  const totalViews = imagePaths.length;

  const handlePrevious = () => {
    setCurrentView((prev) => (prev === 0 ? totalViews - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentView((prev) => (prev === totalViews - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Image Display */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
        <div className="relative w-full h-full">
          <Image
            src={imagePaths[currentView]}
            alt={`${tableNumber} - View ${currentView + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        {totalViews > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-brown"
              aria-label="Previous view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-brown"
              aria-label="Next view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* View Indicator */}
        {totalViews > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: totalViews }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentView(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentView
                    ? 'bg-brand-brown w-6'
                    : 'bg-white/70 hover:bg-white'
                }`}
                aria-label={`View ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Table Information */}
      <div className="flex items-center justify-between px-2">
        <div>
          <p className="text-sm font-medium text-gray-900">{tableNumber}</p>
          <p className="text-xs text-gray-600">
            View {currentView + 1} of {totalViews}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-brand-brown"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-sm font-semibold text-brand-brown">
            {capacity} {capacity === 1 ? 'seat' : 'seats'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TablePreviewCarousel;
