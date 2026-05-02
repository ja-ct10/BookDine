'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import TablePreviewCarousel from './TablePreviewCarousel';
import { useToast } from './Toast';
import { formatErrorForToast } from '@/lib/errorMessages';
import {
  validateCustomerData,
  validateReservationTimeRange,
  validateContactNumber,
} from '@/lib/validation';
import {
  getTableConfigurations,
  checkTableAvailability,
  createMockReservation,
} from '@/lib/mockData';
import type { WaitlistCustomerData } from '@/types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get current time in HH:mm format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Form state
  const [formData, setFormData] = useState<WaitlistCustomerData>({
    firstName: '',
    lastName: '',
    date: getTodayDate(),
    arrivalTime: getCurrentTime(),
    departureTime: '',
    tableNumber: '',
    contactNumber: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        date: getTodayDate(),
        arrivalTime: getCurrentTime(),
        departureTime: '',
        tableNumber: '',
        contactNumber: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  // Get table configurations
  const tables = getTableConfigurations();

  // Get selected table info
  const selectedTable = tables.find((t) => t.number === formData.tableNumber);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // Clear general error when any field changes
    if (errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  // Handle input blur with validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validate specific fields on blur
    if (name === 'departureTime' && value && formData.arrivalTime) {
      const timeRangeResult = validateReservationTimeRange(
        formData.arrivalTime,
        formData.departureTime
      );
      if (!timeRangeResult.success) {
        setErrors((prev) => ({
          ...prev,
          departureTime: timeRangeResult.error || 'Invalid time range',
        }));
      }
    }
    
    if (name === 'contactNumber' && value) {
      const contactResult = validateContactNumber(value);
      if (!contactResult.success) {
        setErrors((prev) => ({
          ...prev,
          contactNumber: contactResult.error || 'Invalid contact number',
        }));
      }
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate customer data
    const validationResult = validateCustomerData(formData);
    if (!validationResult.success) {
      // Parse the error message to extract field-specific errors
      if (validationResult.error?.includes('Missing required fields')) {
        const missingFields = validationResult.error
          .replace('Missing required fields: ', '')
          .split(', ');
        missingFields.forEach((field) => {
          const fieldKey = field
            .toLowerCase()
            .replace(/ /g, '')
            .replace('number', 'Number');
          newErrors[fieldKey] = `${field} is required`;
        });
      } else {
        // General validation error
        newErrors.general = validationResult.error || 'Validation failed';
      }
    }

    // Additional time range validation
    const timeRangeResult = validateReservationTimeRange(
      formData.arrivalTime,
      formData.departureTime
    );
    if (!timeRangeResult.success) {
      newErrors.departureTime = timeRangeResult.error || 'Invalid time range';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);

    try {
      // Check table availability
      const isAvailable = await checkTableAvailability(
        formData.date,
        formData.tableNumber,
        formData.arrivalTime,
        formData.departureTime
      );

      // Create reservation with appropriate status
      const status = isAvailable ? 'Arrived' : 'Waiting';

      await createMockReservation({
        firstName: formData.firstName,
        lastName: formData.lastName,
        date: formData.date,
        arrivalTime: formData.arrivalTime,
        departureTime: formData.departureTime,
        tableNumber: formData.tableNumber,
        contactNumber: formData.contactNumber,
        status,
      });

      // Show success message
      if (isAvailable) {
        toast.success(
          `Customer ${formData.firstName} ${formData.lastName} has been seated at ${formData.tableNumber}`
        );
      } else {
        toast.success(
          `Customer ${formData.firstName} ${formData.lastName} has been added to the waitlist`
        );
      }

      // Close modal and refresh
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error adding customer:', error);
      const errorMessage = formatErrorForToast(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Customer"
      size="lg"
      closeOnBackdropClick={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.firstName}
            placeholder="Enter first name"
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastName}
            placeholder="Enter last name"
            required
          />
        </div>

        {/* Date Field */}
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.date}
          required
        />

        {/* Time Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Arrival Time"
            name="arrivalTime"
            type="time"
            value={formData.arrivalTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.arrivalTime}
            helperText="Automatically set to current time"
            required
          />
          <Input
            label="Departure Time"
            name="departureTime"
            type="time"
            value={formData.departureTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.departureTime}
            placeholder="HH:mm"
            required
          />
        </div>

        {/* Table Selection */}
        <div>
          <label
            htmlFor="tableNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Table Number
          </label>
          <select
            id="tableNumber"
            name="tableNumber"
            value={formData.tableNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              errors.tableNumber
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-brand-brown focus:border-brand-brown"
            }`}
            required
            aria-invalid={!!errors.tableNumber}
            aria-describedby={errors.tableNumber ? "tableNumber-error" : undefined}
          >
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table.number} value={table.number}>
                {table.number} - {table.capacity} seats
              </option>
            ))}
          </select>
          {errors.tableNumber && (
            <p id="tableNumber-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.tableNumber}
            </p>
          )}
        </div>

        {/* Table Preview */}
        {selectedTable && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Table Preview
            </h3>
            <TablePreviewCarousel
              tableNumber={selectedTable.number}
              capacity={selectedTable.capacity}
            />
          </div>
        )}

        {/* Contact Number */}
        <Input
          label="Contact Number"
          name="contactNumber"
          type="tel"
          value={formData.contactNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.contactNumber}
          placeholder="+63 917 123 4567"
          required
        />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Add Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
