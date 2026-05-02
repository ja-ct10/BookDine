import mysql from "mysql2/promise";
import type { Pool, PoolConnection } from "mysql2/promise";

/**
 * Database connection pool for MySQL database
 * Implements connection pooling for efficient database access
 * Requirements: 11.1, 11.2, 11.4
 */

// Validate required environment variables
function validateDatabaseConfig() {
  const requiredVars = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER"];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing environment variables: ${missing.join(", ")}. Using defaults.`,
    );
  }
}

// Validate configuration on module load
validateDatabaseConfig();

// Database connection pool configuration
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3308", 10),
  database: process.env.DB_NAME || "servos",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Test database connection
 * Attempts to acquire a connection from the pool and execute a simple query
 * @returns Promise<boolean> - true if connection successful, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    const err = error as Error & { code?: string };
    console.error("❌ Database connection failed:", err.message);

    // Provide specific error messages based on error code
    if (err.code === "ECONNREFUSED") {
      console.error(
        `   Connection refused. Ensure MySQL is running on ${process.env.DB_HOST || "127.0.0.1"}:${process.env.DB_PORT || "3308"}`,
      );
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error(
        "   Access denied. Check database credentials in .env.local",
      );
    } else if (err.code === "ER_BAD_DB_ERROR") {
      console.error(
        `   Database '${process.env.DB_NAME || "servos"}' does not exist`,
      );
    } else if (err.code === "ETIMEDOUT") {
      console.error("   Connection timeout. Check network and firewall settings");
    }

    return false;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Health check function for database connection
 * Verifies pool status and connection availability
 * @returns Promise<{ healthy: boolean; message: string; details?: any }>
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  message: string;
  details?: {
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
  };
}> {
  try {
    const connection = await pool.getConnection();

    // Execute a simple query to verify database is responsive
    await connection.query("SELECT 1");

    // Get pool statistics
    const poolStats = {
      totalConnections: (pool as any)._allConnections?.length || 0,
      activeConnections: (pool as any)._acquiringConnections?.length || 0,
      idleConnections: (pool as any)._freeConnections?.length || 0,
    };

    connection.release();

    return {
      healthy: true,
      message: "Database connection is healthy",
      details: poolStats,
    };
  } catch (error) {
    const err = error as Error & { code?: string };
    return {
      healthy: false,
      message: `Database health check failed: ${err.message}`,
    };
  }
}

/**
 * Gracefully close the database connection pool
 * Should be called when shutting down the application
 */
export async function closePool(): Promise<void> {
  try {
    await pool.end();
    console.log("✅ Database connection pool closed");
  } catch (error) {
    const err = error as Error;
    console.error("❌ Error closing database pool:", err.message);
    throw error;
  }
}

/**
 * Get a connection from the pool
 * Useful for transactions or multiple related queries
 * Remember to release the connection when done
 */
export async function getConnection(): Promise<PoolConnection> {
  try {
    return await pool.getConnection();
  } catch (error) {
    const err = error as Error & { code?: string };
    console.error("❌ Failed to get database connection:", err.message);
    throw new Error(
      `Database connection failed: ${err.code || "UNKNOWN_ERROR"}`,
    );
  }
}

// Export the pool for use in queries
export default pool;
