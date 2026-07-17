import { pgTable, serial, text, integer, timestamp, date, time, real } from "drizzle-orm/pg-core";

export const userProfile = pgTable("user_profile", {
  id: serial("id").primaryKey(),
  name: text("name"),
  heightFeet: integer("height_feet"),
  heightInches: integer("height_inches"),
  heightCm: real("height_cm"),
  birthYear: integer("birth_year"),
  gender: text("gender"),
  unitSystem: text("unit_system").default("imperial"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: date("date").notNull(),
  time: time("time"),
  duration: integer("duration_minutes"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull().references(() => workouts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  primaryMuscle: text("primary_muscle").notNull(),
  secondaryMuscles: text("secondary_muscles").notNull().default("[]"),
  sets: integer("sets").notNull().default(3),
  reps: integer("reps").notNull().default(10),
  weight: text("weight"),
  restTime: integer("rest_time_seconds"),
  equipment: text("equipment"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bodyMetrics = pgTable("body_metrics", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  weight: real("weight"),
  bodyFat: real("body_fat"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const strengthRecords = pgTable("strength_records", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  exerciseName: text("exercise_name").notNull(),
  weight: real("weight").notNull(),
  reps: integer("reps").notNull().default(1),
  estimatedMax: real("estimated_max"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
