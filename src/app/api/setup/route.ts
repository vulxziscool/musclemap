import { NextResponse } from "next/server";
import { pool } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_profile (
          id SERIAL PRIMARY KEY,
          name TEXT,
          height_feet INTEGER,
          height_inches INTEGER,
          height_cm REAL,
          birth_year INTEGER,
          gender TEXT,
          unit_system TEXT DEFAULT 'imperial',
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS workouts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          date DATE NOT NULL,
          time TIME,
          duration_minutes INTEGER,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS exercises (
          id SERIAL PRIMARY KEY,
          workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          primary_muscle TEXT NOT NULL,
          secondary_muscles TEXT NOT NULL DEFAULT '[]',
          sets INTEGER NOT NULL DEFAULT 3,
          reps INTEGER NOT NULL DEFAULT 10,
          weight TEXT,
          rest_time_seconds INTEGER,
          equipment TEXT,
          category TEXT,
          set_details TEXT DEFAULT '[]',
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
        ALTER TABLE exercises ADD COLUMN IF NOT EXISTS set_details TEXT DEFAULT '[]';

        CREATE TABLE IF NOT EXISTS body_metrics (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL,
          weight REAL,
          body_fat REAL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS strength_records (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL,
          exercise_name TEXT NOT NULL,
          weight REAL NOT NULL,
          reps INTEGER NOT NULL DEFAULT 1,
          estimated_max REAL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `);
      return NextResponse.json({ ok: true, message: "Tables ready" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Setup error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
