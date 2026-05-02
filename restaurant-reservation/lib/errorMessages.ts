/**
 * Error message mapping utilities for user-friendly error display
 * Requirements: 13.6
 */

// ============================================================================
// Error Message Types
// ============================================================================

export type ErrorCategory = 
  | 'authentication'
  | 'validation'
  | 'business_logic'
  | 'network'
  | 'unknown';

export interface ErrorMessage {
  title: string;
  message: string;
  category: ErrorCategory;
}

// ============================================================================
// Authentication Error Messages
// ============================================================================

const authenticationErrors: Record<string, ErrorMessage> = {
  INVALID_CREDENTIALS: {
    title: 'Login Failed',
    message: 'Invalid username or password. Please try again.',
    category: 'authentication',
  },
  USER_NOT_FOUND: {
    title: 'User Not Found',
    message: 'No account found with this username. Please check your username or register a new account.',
    category: 'authentication',
  },
  USERNAME_EXISTS: {
    title: 'Username Taken',
    message: 'This username is already taken. Please choose a different username.',
    category: 'authentication',
  },
  SESSION_EXPIRED: {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    category: 'authentication',
  },
  UNAUTHORIZED: {
    title: 'Unauthorized',
    message: 'You do not have permission to access this resource. Please log in.',
    category: 'authentication',
  },
  REGISTRATION_FAILED: {
    title: 'Registration Failed',
    message: 'Unable to create your account. Please try again.',
    category: 'authentication',
  },
};

// ============================================================================
// Validation Error Messages
// ============================================================================

const validationErrors: Record<string, ErrorMessage> = {
  REQUIRED_FIELD: {
    title: 'Required Field',
    message: 'This field is required. Please provide a value.',
    category: 'validation',
  },
  INVALID_TIME_FORMAT: {
    title: 'Invalid Time Format',
    message: 'Please enter time in HH:mm format (e.g., 14:30).',
    category: 'validation',
  },
  INVALID_DATE_FORMAT: {
    title: 'Invalid Date Format',
    message: 'Please enter date in YYYY-MM-DD format.',
    category: 'validation',
  },
  INVALID_CONTACT_NUMBER: {
    title: 'Invalid Contact Number',
    message: 'Please enter a valid contact number with only digits, spaces, and phone characters.',
    category: 'validation',
  },
  PASSWORD_TOO_SHORT: {
    title: 'Password Too Short',
    message: 'Password must be at least 8 characters long.',
    category: 'validation',
  },
  PASSWORD_COMPLEXITY: {
    title: 'Password Requirements Not Met',
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    category: 'validation',
  },
  PASSWORDS_DO_NOT_MATCH: {
    title: 'Passwords Do Not Match',
    message: 'The passwords you entered do not match. Please try again.',
    category: 'validation',
  },
  INVALID_TIME_RANGE: {
    title: 'Invalid Time Range',
    message: 'Departure time must be after arrival time.',
    category: 'validation',
  },
  OUTSIDE_OPERATING_HOURS: {
    title: 'Outside Operating Hours',
    message: 'Reservation times must be within operating hours (11:00 AM - 9:00 PM).',
    category: 'validation',
  },
  USERNAME_TOO_SHORT: {
    title: 'Username Too Short',
    message: 'Username must be at least 3 characters long.',
    category: 'validation',
  },
};

// ============================================================================
// Business Logic Error Messages
// ============================================================================

const businessLogicErrors: Record<string, ErrorMessage> = {
  TABLE_UNAVAILABLE: {
    title: 'Table Unavailable',
    message: 'The selected table is not available for the specified time range. The customer has been added to the waitlist.',
    category: 'business_logic',
  },
  CANNOT_MARK_ARRIVED_EARLY: {
    title: 'Cannot Mark as Arrived',
    message: 'Cannot mark reservation as arrived before the scheduled arrival time.',
    category: 'business_logic',
  },
  CANNOT_CHANGE_PAST_RESERVATION: {
    title: 'Cannot Modify Past Reservation',
    message: 'Cannot change the status of a reservation from a past date (except for cancellations).',
    category: 'business_logic',
  },
  RESERVATION_NOT_FOUND: {
    title: 'Reservation Not Found',
    message: 'The requested reservation could not be found.',
    category: 'business_logic',
  },
  CANNOT_RESTORE_NON_PENDING: {
    title: 'Cannot Restore',
    message: 'Only reservations with Pending status can be restored.',
    category: 'business_logic',
  },
  ALREADY_CANCELLED: {
    title: 'Already Cancelled',
    message: 'This reservation has already been cancelled.',
    category: 'business_logic',
  },
  INVALID_STATUS_TRANSITION: {
    title: 'Invalid Status Change',
    message: 'This status change is not allowed for the current reservation state.',
    category: 'business_logic',
  },
};

// ============================================================================
// Network Error Messages
// ============================================================================

const networkErrors: Record<string, ErrorMessage> = {
  NETWORK_ERROR: {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    category: 'network',
  },
  TIMEOUT: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    category: 'network',
  },
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'An error occurred on the server. Please try again later.',
    category: 'network',
  },
};

// ============================================================================
// Generic Error Messages
// ============================================================================

const genericErrors: Record<string, ErrorMessage> = {
  UNKNOWN_ERROR: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again.',
    category: 'unknown',
  },
  OPERATION_FAILED: {
    title: 'Operation Failed',
    message: 'The operation could not be completed. Please try again.',
    category: 'unknown',
  },
};

// ============================================================================
// Error Message Mapping
// ============================================================================

const allErrors = {
  ...authenticationErrors,
  ...validationErrors,
  ...businessLogicErrors,
  ...networkErrors,
  ...genericErrors,
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Get a user-friendly error message for a given error code
 * @param errorCode - The error code to look up
 * @returns ErrorMessage object with title, message, and category
 */
export function getErrorMessage(errorCode: string): ErrorMessage {
  const normalizedCode = errorCode.toUpperCase().replace(/\s+/g, '_');
  return allErrors[normalizedCode] || genericErrors.UNKNOWN_ERROR;
}

/**
 * Get a user-friendly error message from an error string
 * Attempts to match common error patterns and return appropriate messages
 * @param errorString - The error string to parse
 * @returns ErrorMessage object with title, message, and category
 */
export function parseErrorString(errorString: string): ErrorMessage {
  const lowerError = errorString.toLowerCase();

  // Authentication errors
  if (lowerError.includes('invalid') && (lowerError.includes('username') || lowerError.includes('password') || lowerError.includes('credentials'))) {
    return authenticationErrors.INVALID_CREDENTIALS;
  }
  if (lowerError.includes('username') && (lowerError.includes('exists') || lowerError.includes('taken') || lowerError.includes('already'))) {
    return authenticationErrors.USERNAME_EXISTS;
  }
  if (lowerError.includes('session') && lowerError.includes('expired')) {
    return authenticationErrors.SESSION_EXPIRED;
  }
  if (lowerError.includes('unauthorized') || lowerError.includes('not authorized')) {
    return authenticationErrors.UNAUTHORIZED;
  }

  // Validation errors
  if (lowerError.includes('required') || lowerError.includes('missing')) {
    return validationErrors.REQUIRED_FIELD;
  }
  if (lowerError.includes('time') && lowerError.includes('format')) {
    return validationErrors.INVALID_TIME_FORMAT;
  }
  if (lowerError.includes('date') && lowerError.includes('format')) {
    return validationErrors.INVALID_DATE_FORMAT;
  }
  if (lowerError.includes('contact') && lowerError.includes('number')) {
    return validationErrors.INVALID_CONTACT_NUMBER;
  }
  if (lowerError.includes('password') && (lowerError.includes('short') || lowerError.includes('8 characters'))) {
    return validationErrors.PASSWORD_TOO_SHORT;
  }
  if (lowerError.includes('password') && (lowerError.includes('complexity') || lowerError.includes('uppercase') || lowerError.includes('lowercase') || lowerError.includes('special'))) {
    return validationErrors.PASSWORD_COMPLEXITY;
  }
  if (lowerError.includes('password') && lowerError.includes('match')) {
    return validationErrors.PASSWORDS_DO_NOT_MATCH;
  }
  if (lowerError.includes('departure') && lowerError.includes('arrival')) {
    return validationErrors.INVALID_TIME_RANGE;
  }
  if (lowerError.includes('operating hours')) {
    return validationErrors.OUTSIDE_OPERATING_HOURS;
  }

  // Business logic errors
  if (lowerError.includes('table') && (lowerError.includes('unavailable') || lowerError.includes('not available'))) {
    return businessLogicErrors.TABLE_UNAVAILABLE;
  }
  if (lowerError.includes('arrived') && lowerError.includes('arrival time')) {
    return businessLogicErrors.CANNOT_MARK_ARRIVED_EARLY;
  }
  if (lowerError.includes('reservation') && lowerError.includes('not found')) {
    return businessLogicErrors.RESERVATION_NOT_FOUND;
  }
  if (lowerError.includes('restore') && lowerError.includes('pending')) {
    return businessLogicErrors.CANNOT_RESTORE_NON_PENDING;
  }

  // Network errors
  if (lowerError.includes('network') || lowerError.includes('connection')) {
    return networkErrors.NETWORK_ERROR;
  }
  if (lowerError.includes('timeout')) {
    return networkErrors.TIMEOUT;
  }
  if (lowerError.includes('server') || lowerError.includes('500') || lowerError.includes('503')) {
    return networkErrors.SERVER_ERROR;
  }

  // Default to unknown error
  return genericErrors.UNKNOWN_ERROR;
}

/**
 * Format an error for display in a toast notification
 * @param error - Error string, Error object, or error code
 * @returns Formatted error message string
 */
export function formatErrorForToast(error: string | Error | unknown): string {
  let errorString: string;

  if (error instanceof Error) {
    errorString = error.message;
  } else if (typeof error === 'string') {
    errorString = error;
  } else {
    errorString = 'An unexpected error occurred';
  }

  const errorMessage = parseErrorString(errorString);
  return errorMessage.message;
}

/**
 * Format an error for display with title and message
 * @param error - Error string, Error object, or error code
 * @returns ErrorMessage object with title and message
 */
export function formatError(error: string | Error | unknown): ErrorMessage {
  let errorString: string;

  if (error instanceof Error) {
    errorString = error.message;
  } else if (typeof error === 'string') {
    errorString = error;
  } else {
    errorString = 'An unexpected error occurred';
  }

  return parseErrorString(errorString);
}

// ============================================================================
// Error Code Constants (for use in application code)
// ============================================================================

export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USERNAME_EXISTS: 'USERNAME_EXISTS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',

  // Validation
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_TIME_FORMAT: 'INVALID_TIME_FORMAT',
  INVALID_DATE_FORMAT: 'INVALID_DATE_FORMAT',
  INVALID_CONTACT_NUMBER: 'INVALID_CONTACT_NUMBER',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  PASSWORD_COMPLEXITY: 'PASSWORD_COMPLEXITY',
  PASSWORDS_DO_NOT_MATCH: 'PASSWORDS_DO_NOT_MATCH',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  OUTSIDE_OPERATING_HOURS: 'OUTSIDE_OPERATING_HOURS',
  USERNAME_TOO_SHORT: 'USERNAME_TOO_SHORT',

  // Business Logic
  TABLE_UNAVAILABLE: 'TABLE_UNAVAILABLE',
  CANNOT_MARK_ARRIVED_EARLY: 'CANNOT_MARK_ARRIVED_EARLY',
  CANNOT_CHANGE_PAST_RESERVATION: 'CANNOT_CHANGE_PAST_RESERVATION',
  RESERVATION_NOT_FOUND: 'RESERVATION_NOT_FOUND',
  CANNOT_RESTORE_NON_PENDING: 'CANNOT_RESTORE_NON_PENDING',
  ALREADY_CANCELLED: 'ALREADY_CANCELLED',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',

  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',

  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
