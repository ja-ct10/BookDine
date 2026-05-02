import { z } from "zod";

/**
 * Validation utilities for the restaurant reservation system.
 * Provides functions for validating time formats, operating hours,
 * password complexity, and other business rules.
 */

// ============================================================================
// Constants
// ============================================================================

const OPERATING_HOURS = {
  START: "11:00",
  END: "21:00", // 9:00 PM in 24-hour format
} as const;

const TIME_FORMAT_REGEX = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;

// ============================================================================
// Zod Schemas
// ============================================================================

/**
 * Schema for time format validation (HH:mm)
 */
export const timeFormatSchema = z
  .string()
  .regex(TIME_FORMAT_REGEX, "Time must be in HH:mm format (e.g., 14:30)");

/**
 * Schema for password complexity validation
 * Requirements: 8+ chars, uppercase, lowercase, number, special character
 */
export const passwordComplexitySchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

/**
 * Schema for contact number validation
 */
export const contactNumberSchema = z
  .string()
  .min(1, "Contact number is required")
  .regex(PHONE_REGEX, "Contact number must contain only digits, spaces, and valid phone characters");

/**
 * Schema for date validation (YYYY-MM-DD)
 */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

/**
 * Schema for required string fields
 */
export const requiredStringSchema = z
  .string()
  .min(1, "This field is required")
  .trim();

/**
 * Schema for login form validation
 */
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Schema for registration form validation
 */
export const registrationSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").trim(),
    lastName: z.string().min(1, "Last name is required").trim(),
    username: z.string().min(1, "Username is required").trim(),
    password: passwordComplexitySchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates time format (HH:mm)
 * @param time - Time string to validate
 * @returns true if valid, false otherwise
 */
export function validateTimeFormat(time: string): boolean {
  try {
    timeFormatSchema.parse(time);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates that a time is within operating hours (11:00 AM - 9:00 PM)
 * @param time - Time string in HH:mm format
 * @returns true if within operating hours, false otherwise
 */
export function validateOperatingHours(time: string): boolean {
  if (!validateTimeFormat(time)) {
    return false;
  }

  const [hours, minutes] = time.split(":").map(Number);
  const timeInMinutes = hours * 60 + minutes;

  const [startHours, startMinutes] = OPERATING_HOURS.START.split(":").map(Number);
  const startInMinutes = startHours * 60 + startMinutes;

  const [endHours, endMinutes] = OPERATING_HOURS.END.split(":").map(Number);
  const endInMinutes = endHours * 60 + endMinutes;

  return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
}

/**
 * Validates password complexity requirements
 * @param password - Password string to validate
 * @returns Object with success status and error message if invalid
 */
export function validatePasswordComplexity(
  password: string,
): { success: boolean; error?: string } {
  try {
    passwordComplexitySchema.parse(password);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Invalid password" };
  }
}

/**
 * Validates that departure time is after arrival time
 * @param arrivalTime - Arrival time in HH:mm format
 * @param departureTime - Departure time in HH:mm format
 * @returns Object with success status and error message if invalid
 */
export function validateTimeRange(
  arrivalTime: string,
  departureTime: string,
): { success: boolean; error?: string } {
  if (!validateTimeFormat(arrivalTime)) {
    return {
      success: false,
      error: "Arrival time must be in HH:mm format (e.g., 14:30)",
    };
  }

  if (!validateTimeFormat(departureTime)) {
    return {
      success: false,
      error: "Departure time must be in HH:mm format (e.g., 14:30)",
    };
  }

  const [arrivalHours, arrivalMinutes] = arrivalTime.split(":").map(Number);
  const arrivalInMinutes = arrivalHours * 60 + arrivalMinutes;

  const [departureHours, departureMinutes] = departureTime.split(":").map(Number);
  const departureInMinutes = departureHours * 60 + departureMinutes;

  if (departureInMinutes <= arrivalInMinutes) {
    return {
      success: false,
      error: "Departure time must be after arrival time",
    };
  }

  return { success: true };
}

/**
 * Validates contact number format
 * @param contactNumber - Contact number string to validate
 * @returns Object with success status and error message if invalid
 */
export function validateContactNumber(
  contactNumber: string,
): { success: boolean; error?: string } {
  try {
    contactNumberSchema.parse(contactNumber);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Invalid contact number" };
  }
}

/**
 * Validates that all required fields are present and non-empty
 * @param fields - Object with field names and values
 * @returns Object with success status and error message if invalid
 */
export function validateRequiredFields(
  fields: Record<string, string | undefined | null>,
): { success: boolean; error?: string; missingFields?: string[] } {
  const missingFields: string[] = [];

  for (const [fieldName, fieldValue] of Object.entries(fields)) {
    if (!fieldValue || fieldValue.trim() === "") {
      missingFields.push(fieldName);
    }
  }

  if (missingFields.length > 0) {
    return {
      success: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
      missingFields,
    };
  }

  return { success: true };
}

// ============================================================================
// Composite Validation Functions
// ============================================================================

/**
 * Validates a complete reservation time range including operating hours
 * @param arrivalTime - Arrival time in HH:mm format
 * @param departureTime - Departure time in HH:mm format
 * @returns Object with success status and error message if invalid
 */
export function validateReservationTimeRange(
  arrivalTime: string,
  departureTime: string,
): { success: boolean; error?: string } {
  // Validate time range (departure after arrival)
  const timeRangeResult = validateTimeRange(arrivalTime, departureTime);
  if (!timeRangeResult.success) {
    return timeRangeResult;
  }

  // Validate arrival time is within operating hours
  if (!validateOperatingHours(arrivalTime)) {
    return {
      success: false,
      error: `Arrival time must be within operating hours (${OPERATING_HOURS.START} - ${OPERATING_HOURS.END})`,
    };
  }

  // Validate departure time is within operating hours
  if (!validateOperatingHours(departureTime)) {
    return {
      success: false,
      error: `Departure time must be within operating hours (${OPERATING_HOURS.START} - ${OPERATING_HOURS.END})`,
    };
  }

  return { success: true };
}

/**
 * Validates customer data for waitlist/reservation creation
 * @param data - Customer data object
 * @returns Object with success status and error message if invalid
 */
export function validateCustomerData(data: {
  firstName: string;
  lastName: string;
  date: string;
  arrivalTime: string;
  departureTime: string;
  tableNumber: string;
  contactNumber: string;
}): { success: boolean; error?: string } {
  // Validate required fields
  const requiredFieldsResult = validateRequiredFields({
    "First Name": data.firstName,
    "Last Name": data.lastName,
    Date: data.date,
    "Arrival Time": data.arrivalTime,
    "Departure Time": data.departureTime,
    "Table Number": data.tableNumber,
    "Contact Number": data.contactNumber,
  });

  if (!requiredFieldsResult.success) {
    return requiredFieldsResult;
  }

  // Validate date format
  try {
    dateSchema.parse(data.date);
  } catch {
    return {
      success: false,
      error: "Date must be in YYYY-MM-DD format",
    };
  }

  // Validate time range and operating hours
  const timeRangeResult = validateReservationTimeRange(
    data.arrivalTime,
    data.departureTime,
  );
  if (!timeRangeResult.success) {
    return timeRangeResult;
  }

  // Validate contact number
  const contactNumberResult = validateContactNumber(data.contactNumber);
  if (!contactNumberResult.success) {
    return contactNumberResult;
  }

  return { success: true };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the operating hours for display purposes
 * @returns Object with start and end times
 */
export function getOperatingHours() {
  return {
    start: OPERATING_HOURS.START,
    end: OPERATING_HOURS.END,
    display: `${OPERATING_HOURS.START} - ${OPERATING_HOURS.END}`,
  };
}

/**
 * Formats a validation error for display
 * @param error - Error message or ZodError
 * @returns Formatted error message
 */
export function formatValidationError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((e: z.ZodIssue) => e.message).join(", ");
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Validation error occurred";
}
