"use server";

import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { verifyPassword, hashPassword, createSession, destroySession } from "@/lib/auth";
import { loginSchema, registrationSchema } from "@/lib/validation";
import type { Result } from "@/types";
import { RowDataPacket } from "mysql2/promise";

/**
 * Login user with username and password
 * Requirements: 1.1, 1.2, 1.3, 1.8
 */
export async function loginUser(
  formData: FormData,
): Promise<Result<void>> {
  try {
    // Extract and validate form data
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Validate input
    const validation = loginSchema.safeParse({ username, password });
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    // Query database for user
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `user` WHERE BINARY `Username` = ?",
      [username],
    );

    if (rows.length === 0) {
      return {
        success: false,
        error: "Invalid username or password",
      };
    }

    const user = rows[0];

    // Verify password
    const isValidPassword = await verifyPassword(password, user.Password);
    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid username or password",
      };
    }

    // Create session
    await createSession(user.Id, {
      firstName: user["First Name"],
      lastName: user["Last Name"],
      username: user.Username,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    };
  }
}

/**
 * Register new user
 * Requirements: 1.4, 1.5, 1.6, 1.7, 1.9
 */
export async function registerUser(
  formData: FormData,
): Promise<Result<void>> {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate input
    const validation = registrationSchema.safeParse({
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    // Check if username already exists
    const [existingUsers] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM `user` WHERE `Username` = ?",
      [username],
    );

    if (existingUsers[0].count > 0) {
      return {
        success: false,
        error: "Username is already taken",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    await pool.execute(
      "INSERT INTO `user` (`First Name`, `Last Name`, `Username`, `Password`) VALUES (?, ?, ?, ?)",
      [firstName, lastName, username, hashedPassword],
    );

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An error occurred during registration. Please try again.",
    };
  }
}

/**
 * Logout user
 * Requirements: 1.10
 */
export async function logoutUser(): Promise<void> {
  await destroySession();
  redirect("/login");
}
