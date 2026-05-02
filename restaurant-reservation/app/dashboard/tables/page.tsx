'use client';

import { useEffect, useState } from 'react';
import { getTableStatuses } from '@/lib/mockData';
import type { TableInfo } from '@/types';
import TableButton from '@/components/TableButton';
import TableDetailModal from '@/components/TableDetailModal';

export default function TablesPage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load table statuses
  const loadTables = async () => {
    try {
      const tableStatuses = await getTableStatuses();
      setTables(tableStatuses);
    } catch (error) {
      console.error('Error loading table statuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTables();

    // Simulate real-time updates by polling every 2 seconds
    const interval = setInterval(loadTables, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle table click
  const handleTableClick = (table: TableInfo) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  // Calculate statistics
  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-gold">
        <h1 className="text-3xl font-bold text-brand-brown mb-2">
          Table Floor Plan 🪑
        </h1>
        <p className="text-gray-600">
          View real-time table availability and customer assignments
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Tables</p>
              <p className="text-3xl font-bold text-blue-600">{tables.length}</p>
            </div>
            <span className="text-4xl">🪑</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Available</p>
              <p className="text-3xl font-bold text-green-600">{availableCount}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Occupied</p>
              <p className="text-3xl font-bold text-red-600">{occupiedCount}</p>
            </div>
            <span className="text-4xl">🔴</span>
          </div>
        </div>
      </div>

      {/* Floor Plan Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-brand-brown">
            Restaurant Floor Plan
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-600">Occupied</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(15)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tables.map((table) => (
              <TableButton
                key={table.number}
                table={table}
                onClick={() => handleTableClick(table)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Table Detail Modal */}
      {selectedTable && (
        <TableDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          table={selectedTable}
        />
      )}
    </div>
  );
}
