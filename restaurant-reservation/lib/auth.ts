import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { Session } from "@/types";

// Session configuration
const sessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: process.env.SESSION_NAME || "servos_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_TTL || "86400"), // 24 hours default
  },
};

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Verify password against hash
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Get current session
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<Session>(cookieStore, sessionOptions);
}

// Create session with user data
export async function createSession(userId: number, userData: Omit<Session, "userId">) {
  const session = await getSession();
  session.userId = userId;
  session.firstName = userData.firstName;
  session.lastName = userData.lastName;
  session.username = userData.username;
  await session.save();
}

// Destroy session (logout)
export async function destroySession() {
  const session = await getSession();
  session.destroy();
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session.userId;
}

// Get current user from session
export async function getCurrentUser(): Promise<Session | null> {
  const session = await getSession();
  if (!session.userId) {
    return null;
  }
  return {
    userId: session.userId,
    firstName: session.firstName,
    lastName: session.lastName,
    username: session.username,
  };
}
