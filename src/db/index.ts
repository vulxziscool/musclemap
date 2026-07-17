import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __muscleMapPool?: Pool;
};

function getPool(): Pool {
  if (globalForDb.__muscleMapPool) return globalForDb.__muscleMapPool;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
      ? undefined
      : { rejectUnauthorized: false },
    max: 5,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__muscleMapPool = pool;
  }

  return pool;
}

// Lazy — only connects when a query is actually made, never at import time
export const pool = new Proxy({} as Pool, {
  get(_, prop) {
    const p = getPool();
    const val = (p as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(p) : val;
  },
});

export const db = drizzle(pool);
