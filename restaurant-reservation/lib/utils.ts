import { format, parse } from "date-fns";

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Format time to HH:mm
export function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

// Parse time string to Date object (using today's date)
export function parseTime(timeString: string): Date {
  return parse(timeString, "HH:mm", new Date());
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  return formatDate(new Date());
}

// Get current time in HH:mm format
export function getCurrentTime(): string {
  return formatTime(new Date());
}

// Check if a time is in the past (for today's date)
export function isTimePast(timeString: string): boolean {
  const now = new Date();
  const time = parseTime(timeString);
  return time < now;
}

// Combine date and time strings into a Date object
export function combineDateAndTime(dateString: string, timeString: string): Date {
  return parse(`${dateString} ${timeString}`, "yyyy-MM-dd HH:mm", new Date());
}

// Utility for conditional class names
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
