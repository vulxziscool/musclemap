import { NextResponse } from "next/server";
import { db } from "@/db";
import { workouts, exercises, bodyMetrics, strengthRecords } from "@/db/schema";

export async function POST() {
  try {
    const now = new Date();
    const demoWorkouts = [
      {
        name: "Upper Push Day",
        date: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "09:00:00",
        duration: 55,
        notes: "Great session, increased bench by 5lbs",
        exercises: [
          { name: "Bench Press", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], sets: 4, reps: 8, weight: "185 lbs", restTime: 120, equipment: "barbell", category: "push" },
          { name: "Incline Dumbbell Press", primaryMuscle: "upper_chest", secondaryMuscles: ["front_delts", "triceps"], sets: 3, reps: 10, weight: "65 lbs", restTime: 90, equipment: "dumbbell", category: "push" },
          { name: "Dips", primaryMuscle: "lower_chest", secondaryMuscles: ["triceps", "front_delts"], sets: 3, reps: 12, weight: "BW", restTime: 90, equipment: "bodyweight", category: "push" },
          { name: "Lateral Raises", primaryMuscle: "side_delts", secondaryMuscles: ["front_delts", "traps"], sets: 3, reps: 15, weight: "20 lbs", restTime: 60, equipment: "dumbbell", category: "push" },
          { name: "Cable Triceps Pushdowns", primaryMuscle: "triceps", secondaryMuscles: [], sets: 3, reps: 12, weight: "50 lbs", restTime: 60, equipment: "cable", category: "push" },
        ],
      },
      {
        name: "Pull Day",
        date: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "10:00:00",
        duration: 60,
        notes: "Back felt strong today",
        exercises: [
          { name: "Pull-Ups", primaryMuscle: "lats", secondaryMuscles: ["biceps", "mid_back", "forearms"], sets: 4, reps: 8, weight: "BW+25", restTime: 120, equipment: "bodyweight", category: "pull" },
          { name: "Bent-Over Rows", primaryMuscle: "mid_back", secondaryMuscles: ["lats", "biceps", "rear_delts"], sets: 4, reps: 8, weight: "155 lbs", restTime: 120, equipment: "barbell", category: "pull" },
          { name: "Face Pulls", primaryMuscle: "rear_delts", secondaryMuscles: ["mid_back", "traps"], sets: 3, reps: 15, weight: "30 lbs", restTime: 60, equipment: "cable", category: "pull" },
          { name: "Dumbbell Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], sets: 3, reps: 12, weight: "35 lbs", restTime: 60, equipment: "dumbbell", category: "pull" },
          { name: "Shrugs", primaryMuscle: "traps", secondaryMuscles: ["forearms"], sets: 3, reps: 12, weight: "225 lbs", restTime: 60, equipment: "barbell", category: "pull" },
        ],
      },
      {
        name: "Leg Day",
        date: new Date(now.getTime() - 54 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "08:30:00",
        duration: 65,
        notes: "Solid leg session",
        exercises: [
          { name: "Back Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings", "lower_back", "adductors"], sets: 4, reps: 8, weight: "225 lbs", restTime: 150, equipment: "barbell", category: "legs" },
          { name: "Romanian Deadlifts", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes", "lower_back"], sets: 4, reps: 10, weight: "185 lbs", restTime: 120, equipment: "barbell", category: "legs" },
          { name: "Hip Thrusts", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings", "adductors"], sets: 3, reps: 12, weight: "225 lbs", restTime: 90, equipment: "barbell", category: "legs" },
          { name: "Standing Calf Raises", primaryMuscle: "calves", secondaryMuscles: [], sets: 4, reps: 15, weight: "135 lbs", restTime: 45, equipment: "machine", category: "legs" },
          { name: "Hanging Leg Raises", primaryMuscle: "abs", secondaryMuscles: ["obliques", "forearms"], sets: 3, reps: 12, weight: "BW", restTime: 60, equipment: "bodyweight", category: "core" },
        ],
      },
    ];

    for (const w of demoWorkouts) {
      const [workout] = await db.insert(workouts).values({ name: w.name, date: w.date, time: w.time, duration: w.duration, notes: w.notes }).returning();
      await db.insert(exercises).values(w.exercises.map((ex) => ({ workoutId: workout.id, name: ex.name, primaryMuscle: ex.primaryMuscle, secondaryMuscles: JSON.stringify(ex.secondaryMuscles), sets: ex.sets, reps: ex.reps, weight: ex.weight, restTime: ex.restTime, equipment: ex.equipment, category: ex.category })));
    }

    // Body metrics — last 30 days
    const metricRows = [];
    for (let i = 30; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      metricRows.push({
        date: d.toISOString().split("T")[0],
        weight: 178 - i * 0.12 + Math.sin(i * 0.5) * 1.2,
        bodyFat: 15.5 - i * 0.04 + Math.sin(i * 0.3) * 0.5,
        notes: null,
      });
    }
    await db.insert(bodyMetrics).values(metricRows);

    // Strength records
    const lifts = [
      { name: "Bench Press", base: 155, gain: 1.0 },
      { name: "Back Squats", base: 195, gain: 1.5 },
      { name: "Deadlifts", base: 245, gain: 1.2 },
      { name: "Military Press", base: 105, gain: 0.6 },
    ];
    const strengthRows = [];
    for (const lift of lifts) {
      for (let i = 8; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const w = lift.base + (8 - i) * lift.gain + Math.random() * 3;
        const reps = [5, 3, 1, 5, 3][i % 5];
        strengthRows.push({
          date: d.toISOString().split("T")[0],
          exerciseName: lift.name,
          weight: Math.round(w * 10) / 10,
          reps,
          estimatedMax: Math.round(w * (1 + reps / 30) * 10) / 10,
        });
      }
    }
    await db.insert(strengthRecords).values(strengthRows);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error loading demo:", error);
    return NextResponse.json({ error: "Failed to load demo data" }, { status: 500 });
  }
}
