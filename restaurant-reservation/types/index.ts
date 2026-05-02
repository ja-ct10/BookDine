// User and Authentication Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string; // hashed
}

export interface Session {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
}

// Reservation Types
export type ReservationStatus =
  | "Pending"
  | "Waiting"
  | "Arrived"
  | "Completed"
  | "Cancelled";

export interface Reservation {
  id: number;
  date: string; // YYYY-MM-DD
  arrivalTime: string; // HH:mm
  departureTime: string; // HH:mm
  firstName: string;
  lastName: string;
  tableNumber: string;
  contactNumber: string;
  status: ReservationStatus;
}

// Table Types
export interface TableInfo {
  number: string;
  capacity: number;
  status: "available" | "occupied";
  reservation?: {
    firstName: string;
    lastName: string;
    arrivalTime: string;
    departureTime: string;
  };
}

// Waitlist Types
export interface WaitlistCustomerData {
  firstName: string;
  lastName: string;
  date: string;
  arrivalTime: string;
  departureTime: string;
  tableNumber: string;
  contactNumber: string;
}

// Result Type for Server Actions
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
