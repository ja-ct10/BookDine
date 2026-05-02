/**
 * Mock Data Utilities for Restaurant Reservation System
 * 
 * This module provides mock data and utility functions to simulate
 * backend operations for rapid UI development and testing.
 * All data is stored in memory and can be persisted to localStorage.
 */

import type {
  User,
  Reservation,
  ReservationStatus,
  TableInfo,
  WaitlistCustomerData,
} from "@/types";

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
  USERS: "servos_mock_users",
  RESERVATIONS: "servos_mock_reservations",
  BACKUP: "servos_mock_backup",
  NEXT_ID: "servos_next_id",
} as const;

// Table configuration matching the existing system
const TABLE_CONFIG = [
  { number: "Table No. 1", capacity: 2 },
  { number: "Table No. 2", capacity: 2 },
  { number: "Table No. 3", capacity: 4 },
  { number: "Table No. 4", capacity: 4 },
  { number: "Table No. 5", capacity: 4 },
  { number: "Table No. 6", capacity: 4 },
  { number: "Table No. 7", capacity: 6 },
  { number: "Table No. 8", capacity: 6 },
  { number: "Table No. 9", capacity: 6 },
  { number: "Table No. 10", capacity: 6 },
  { number: "Table No. 11", capacity: 6 },
  { number: "Table No. 12", capacity: 8 },
  { number: "Table No. 13", capacity: 8 },
  { number: "Table No. 14", capacity: 8 },
  { number: "Table No. 15", capacity: 8 },
] as const;

// ============================================================================
// Initial Mock Data
// ============================================================================

const INITIAL_USERS: User[] = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    username: "admin",
    password: "$2a$10$rZ8qNqZ7qZ8qNqZ7qZ8qNuK8qNqZ7qZ8qNqZ7qZ8qNqZ7qZ8qNqZ7q", // "admin123"
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Manager",
    username: "jmanager",
    password: "$2a$10$rZ8qNqZ7qZ8qNqZ7qZ8qNuK8qNqZ7qZ8qNqZ7qZ8qNqZ7qZ8qNqZ7q", // "Password123!"
  },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    date: getTodayDate(),
    arrivalTime: "12:00",
    departureTime: "14:00",
    firstName: "Maria",
    lastName: "Santos",
    tableNumber: "Table No. 5",
    contactNumber: "+63 917 123 4567",
    status: "Pending",
  },
  {
    id: 2,
    date: getTodayDate(),
    arrivalTime: "13:00",
    departureTime: "15:00",
    firstName: "Juan",
    lastName: "Dela Cruz",
    tableNumber: "Table No. 8",
    contactNumber: "+63 918 234 5678",
    status: "Arrived",
  },
  {
    id: 3,
    date: getTodayDate(),
    arrivalTime: "18:00",
    departureTime: "20:00",
    firstName: "Ana",
    lastName: "Reyes",
    tableNumber: "Table No. 12",
    contactNumber: "+63 919 345 6789",
    status: "Pending",
  },
  {
    id: 4,
    date: getTodayDate(),
    arrivalTime: "19:00",
    departureTime: "21:00",
    firstName: "Pedro",
    lastName: "Garcia",
    tableNumber: "Table No. 3",
    contactNumber: "+63 920 456 7890",
    status: "Waiting",
  },
  {
    id: 5,
    date: getYesterdayDate(),
    arrivalTime: "12:00",
    departureTime: "14:00",
    firstName: "Rosa",
    lastName: "Martinez",
    tableNumber: "Table No. 7",
    contactNumber: "+63 921 567 8901",
    status: "Completed",
  },
  {
    id: 6,
    date: getYesterdayDate(),
    arrivalTime: "18:00",
    departureTime: "20:00",
    firstName: "Carlos",
    lastName: "Lopez",
    tableNumber: "Table No. 10",
    contactNumber: "+63 922 678 9012",
    status: "Completed",
  },
  {
    id: 7,
    date: getTomorrowDate(),
    arrivalTime: "12:30",
    departureTime: "14:30",
    firstName: "Elena",
    lastName: "Fernandez",
    tableNumber: "Table No. 4",
    contactNumber: "+63 923 789 0123",
    status: "Pending",
  },
  {
    id: 8,
    date: getTodayDate(),
    arrivalTime: "14:00",
    departureTime: "16:00",
    firstName: "Miguel",
    lastName: "Torres",
    tableNumber: "Table No. 15",
    contactNumber: "+63 924 890 1234",
    status: "Arrived",
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  const today = new Date();
  return formatDate(today);
}

/**
 * Gets yesterday's date in YYYY-MM-DD format
 */
function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

/**
 * Gets tomorrow's date in YYYY-MM-DD format
 */
function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

/**
 * Formats a Date object to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Gets current time in HH:mm format
 */
function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Simulates async operation with delay
 */
async function simulateDelay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a random ID for new records
 */
function generateId(): number {
  if (typeof window === "undefined") return Date.now();
  
  const stored = localStorage.getItem(STORAGE_KEYS.NEXT_ID);
  const nextId = stored ? parseInt(stored, 10) : 1000;
  localStorage.setItem(STORAGE_KEYS.NEXT_ID, String(nextId + 1));
  return nextId;
}

// ============================================================================
// LocalStorage Persistence
// ============================================================================

/**
 * Loads data from localStorage or returns initial data
 */
function loadFromStorage<T>(key: string, initialData: T): T {
  if (typeof window === "undefined") return initialData;
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialData;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return initialData;
  }
}

/**
 * Saves data to localStorage
 */
function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/**
 * Clears all mock data from localStorage
 */
export function clearMockData(): void {
  if (typeof window === "undefined") return;
  
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Resets mock data to initial state
 */
export function resetMockData(): void {
  saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  saveToStorage(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
  saveToStorage(STORAGE_KEYS.BACKUP, []);
  saveToStorage(STORAGE_KEYS.NEXT_ID, "1000");
}

// ============================================================================
// User Operations
// ============================================================================

/**
 * Gets all users from mock data
 */
export async function getMockUsers(): Promise<User[]> {
  await simulateDelay();
  return loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
}

/**
 * Finds a user by username
 */
export async function findUserByUsername(
  username: string,
): Promise<User | null> {
  await simulateDelay();
  const users = loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  return users.find((u) => u.username === username) || null;
}

/**
 * Finds a user by ID
 */
export async function findUserById(id: number): Promise<User | null> {
  await simulateDelay();
  const users = loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  return users.find((u) => u.id === id) || null;
}

/**
 * Creates a new user
 */
export async function createMockUser(
  userData: Omit<User, "id">,
): Promise<User> {
  await simulateDelay();
  const users = loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  
  const newUser: User = {
    id: generateId(),
    ...userData,
  };
  
  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);
  
  return newUser;
}

// ============================================================================
// Reservation Operations
// ============================================================================

/**
 * Gets all reservations from mock data
 */
export async function getMockReservations(): Promise<Reservation[]> {
  await simulateDelay();
  return loadFromStorage(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
}

/**
 * Gets reservations filtered by status
 */
export async function getReservationsByStatus(
  status: ReservationStatus,
): Promise<Reservation[]> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  return reservations.filter((r) => r.status === status);
}

/**
 * Gets reservations filtered by date
 */
export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  return reservations.filter((r) => r.date === date);
}

/**
 * Finds a reservation by ID
 */
export async function findReservationById(
  id: number,
): Promise<Reservation | null> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  return reservations.find((r) => r.id === id) || null;
}

/**
 * Searches reservations by first name or last name
 */
export async function searchReservations(
  query: string,
): Promise<Reservation[]> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return reservations;
  
  return reservations.filter(
    (r) =>
      r.firstName.toLowerCase().includes(lowerQuery) ||
      r.lastName.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Creates a new reservation
 */
export async function createMockReservation(
  reservationData: Omit<Reservation, "id">,
): Promise<Reservation> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  
  const newReservation: Reservation = {
    id: generateId(),
    ...reservationData,
  };
  
  reservations.push(newReservation);
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  
  return newReservation;
}

/**
 * Updates a reservation's status
 */
export async function updateReservationStatus(
  id: number,
  status: ReservationStatus,
): Promise<Reservation | null> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  
  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) return null;
  
  reservations[index].status = status;
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  
  return reservations[index];
}

/**
 * Updates a reservation
 */
export async function updateMockReservation(
  id: number,
  updates: Partial<Omit<Reservation, "id">>,
): Promise<Reservation | null> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  
  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) return null;
  
  reservations[index] = { ...reservations[index], ...updates };
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  
  return reservations[index];
}

/**
 * Deletes a reservation (moves to backup)
 */
export async function deleteMockReservation(id: number): Promise<boolean> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  const backup = loadFromStorage<Reservation[]>(STORAGE_KEYS.BACKUP, []);
  
  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) return false;
  
  const [deleted] = reservations.splice(index, 1);
  backup.push(deleted);
  
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  saveToStorage(STORAGE_KEYS.BACKUP, backup);
  
  return true;
}

// ============================================================================
// Backup Operations
// ============================================================================

/**
 * Gets all deleted/cancelled reservations from backup
 */
export async function getMockBackup(): Promise<Reservation[]> {
  await simulateDelay();
  return loadFromStorage<Reservation[]>(STORAGE_KEYS.BACKUP, []);
}

/**
 * Restores a reservation from backup
 */
export async function restoreMockReservation(id: number): Promise<boolean> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  const backup = loadFromStorage<Reservation[]>(STORAGE_KEYS.BACKUP, []);
  
  const index = backup.findIndex((r) => r.id === id);
  if (index === -1) return false;
  
  const [restored] = backup.splice(index, 1);
  reservations.push(restored);
  
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  saveToStorage(STORAGE_KEYS.BACKUP, backup);
  
  return true;
}

// ============================================================================
// Table Operations
// ============================================================================

/**
 * Gets all table configurations
 */
export function getTableConfigurations(): typeof TABLE_CONFIG {
  return TABLE_CONFIG;
}

/**
 * Gets current status of all tables
 */
export async function getTableStatuses(): Promise<TableInfo[]> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  
  const today = getTodayDate();
  const currentTime = getCurrentTime();
  
  // Get all arrived reservations for today
  const activeReservations = reservations.filter(
    (r) =>
      r.date === today &&
      r.status === "Arrived" &&
      r.arrivalTime <= currentTime &&
      r.departureTime > currentTime,
  );
  
  return TABLE_CONFIG.map((table) => {
    const reservation = activeReservations.find(
      (r) => r.tableNumber === table.number,
    );
    
    if (reservation) {
      return {
        number: table.number,
        capacity: table.capacity,
        status: "occupied" as const,
        reservation: {
          firstName: reservation.firstName,
          lastName: reservation.lastName,
          arrivalTime: reservation.arrivalTime,
          departureTime: reservation.departureTime,
        },
      };
    }
    
    return {
      number: table.number,
      capacity: table.capacity,
      status: "available" as const,
    };
  });
}

/**
 * Gets status of a specific table
 */
export async function getTableStatus(
  tableNumber: string,
): Promise<TableInfo | null> {
  const statuses = await getTableStatuses();
  return statuses.find((t) => t.number === tableNumber) || null;
}

/**
 * Checks if a table is available for a given time range
 */
export async function checkTableAvailability(
  date: string,
  tableNumber: string,
  arrivalTime: string,
  departureTime: string,
): Promise<boolean> {
  await simulateDelay();
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  
  // Find overlapping reservations
  const conflicts = reservations.filter((r) => {
    if (r.date !== date || r.tableNumber !== tableNumber) return false;
    if (r.status === "Cancelled" || r.status === "Completed") return false;
    
    // Check for time overlap
    const hasOverlap =
      (r.arrivalTime < departureTime && r.departureTime > arrivalTime) ||
      (r.arrivalTime < departureTime && r.departureTime > arrivalTime) ||
      (r.arrivalTime >= arrivalTime && r.arrivalTime < departureTime) ||
      (r.departureTime > arrivalTime && r.departureTime <= departureTime);
    
    return hasOverlap;
  });
  
  return conflicts.length === 0;
}

// ============================================================================
// Automatic Status Updates
// ============================================================================

/**
 * Updates reservation statuses based on current time
 * Should be called periodically (e.g., every 2 seconds)
 */
export async function updateReservationStatuses(): Promise<{
  updated: number;
  movedToBackup: number;
}> {
  await simulateDelay(100);
  const reservations = loadFromStorage(
    STORAGE_KEYS.RESERVATIONS,
    INITIAL_RESERVATIONS,
  );
  const backup = loadFromStorage<Reservation[]>(STORAGE_KEYS.BACKUP, []);
  
  const today = getTodayDate();
  const currentTime = getCurrentTime();
  
  let updated = 0;
  let movedToBackup = 0;
  
  // Update Arrived → Completed when departure time passes
  reservations.forEach((r) => {
    if (
      r.date === today &&
      r.status === "Arrived" &&
      r.departureTime <= currentTime
    ) {
      r.status = "Completed";
      updated++;
    }
  });
  
  // Move Cancelled reservations to backup
  for (let i = reservations.length - 1; i >= 0; i--) {
    if (reservations[i].status === "Cancelled") {
      const [cancelled] = reservations.splice(i, 1);
      backup.push(cancelled);
      movedToBackup++;
    }
  }
  
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  saveToStorage(STORAGE_KEYS.BACKUP, backup);
  
  return { updated, movedToBackup };
}

// ============================================================================
// Test Data Generation
// ============================================================================

const FIRST_NAMES = [
  "Maria",
  "Juan",
  "Ana",
  "Pedro",
  "Rosa",
  "Carlos",
  "Elena",
  "Miguel",
  "Sofia",
  "Diego",
  "Isabella",
  "Luis",
  "Carmen",
  "Jose",
  "Lucia",
];

const LAST_NAMES = [
  "Santos",
  "Dela Cruz",
  "Reyes",
  "Garcia",
  "Martinez",
  "Lopez",
  "Fernandez",
  "Torres",
  "Gonzalez",
  "Rodriguez",
  "Hernandez",
  "Perez",
  "Sanchez",
  "Ramirez",
  "Flores",
];

/**
 * Generates a random first name
 */
export function generateRandomFirstName(): string {
  return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
}

/**
 * Generates a random last name
 */
export function generateRandomLastName(): string {
  return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

/**
 * Generates a random contact number
 */
export function generateRandomContactNumber(): string {
  const prefix = "+63 9";
  const middle = Math.floor(10 + Math.random() * 90);
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${middle} ${part1} ${part2}`;
}

/**
 * Generates a random time within operating hours
 */
export function generateRandomTime(): string {
  const hour = Math.floor(11 + Math.random() * 10); // 11-20 (11 AM - 8 PM)
  const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * Generates a random table number
 */
export function generateRandomTableNumber(): string {
  const tableIndex = Math.floor(Math.random() * TABLE_CONFIG.length);
  return TABLE_CONFIG[tableIndex].number;
}

/**
 * Generates a random reservation status
 */
export function generateRandomStatus(): ReservationStatus {
  const statuses: ReservationStatus[] = [
    "Pending",
    "Waiting",
    "Arrived",
    "Completed",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

/**
 * Generates a random date within a range
 */
export function generateRandomDate(daysOffset: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return formatDate(date);
}

/**
 * Generates a complete random reservation
 */
export function generateRandomReservation(): Omit<Reservation, "id"> {
  const arrivalHour = Math.floor(11 + Math.random() * 8); // 11-18
  const arrivalMinute = Math.floor(Math.random() * 4) * 15;
  const arrivalTime = `${String(arrivalHour).padStart(2, "0")}:${String(arrivalMinute).padStart(2, "0")}`;
  
  const departureHour = arrivalHour + 2; // 2 hours later
  const departureTime = `${String(departureHour).padStart(2, "0")}:${String(arrivalMinute).padStart(2, "0")}`;
  
  return {
    date: generateRandomDate(Math.floor(Math.random() * 7) - 3), // -3 to +3 days
    arrivalTime,
    departureTime,
    firstName: generateRandomFirstName(),
    lastName: generateRandomLastName(),
    tableNumber: generateRandomTableNumber(),
    contactNumber: generateRandomContactNumber(),
    status: generateRandomStatus(),
  };
}

/**
 * Generates multiple random reservations
 */
export async function generateMockReservations(
  count: number,
): Promise<Reservation[]> {
  await simulateDelay();
  const reservations: Reservation[] = [];
  
  for (let i = 0; i < count; i++) {
    const reservation = await createMockReservation(generateRandomReservation());
    reservations.push(reservation);
  }
  
  return reservations;
}
