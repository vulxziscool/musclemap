import { NextResponse } from "next/server";
import { db } from "@/db";
import { workouts, exercises } from "@/db/schema";
import { desc } from "drizzle-orm";
import { MUSCLES, getRecoveryStatus, getRecoveryPercentage, RECOVERY_HOURS } from "@/lib/muscles";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allWorkouts = await db
      .select()
      .from(workouts)
      .orderBy(desc(workouts.createdAt));

    const allExercises = await db.select().from(exercises);

    const now = new Date();

    const muscleRecovery = MUSCLES.map((muscle) => {
      let lastTrainedAt: Date | null = null;
      let effectiveSets = 0;
      let lastWorkoutName: string | null = null;

      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      for (const workout of allWorkouts) {
        const workoutDate = new Date(workout.date + "T" + (workout.time || "12:00:00"));
        const workoutExercises = allExercises.filter((e) => e.workoutId === workout.id);

        for (const ex of workoutExercises) {
          const secondaryMuscles: string[] = JSON.parse(ex.secondaryMuscles || "[]");
          const isPrimary = ex.primaryMuscle === muscle.id;
          const isSecondary = secondaryMuscles.includes(muscle.id);

          if (isPrimary || isSecondary) {
            if (!lastTrainedAt || workoutDate > lastTrainedAt) {
              lastTrainedAt = workoutDate;
              lastWorkoutName = workout.name;
            }
            if (workoutDate >= weekAgo) {
              effectiveSets += isPrimary ? ex.sets : Math.ceil(ex.sets * 0.5);
            }
          }
        }
      }

      const hoursSinceTraining = lastTrainedAt
        ? (now.getTime() - lastTrainedAt.getTime()) / (1000 * 60 * 60)
        : null;

      const status = getRecoveryStatus(hoursSinceTraining);
      const percentage = getRecoveryPercentage(hoursSinceTraining);
      const hoursRemaining = hoursSinceTraining !== null
        ? Math.max(0, RECOVERY_HOURS - hoursSinceTraining)
        : 0;

      return {
        muscleId: muscle.id,
        status,
        percentage,
        lastTrainedAt: lastTrainedAt?.toISOString() || null,
        hoursRemaining,
        hoursSinceTraining: hoursSinceTraining ?? null,
        effectiveSets,
        lastWorkoutName,
      };
    });

    return NextResponse.json(muscleRecovery);
  } catch (error) {
    console.error("Recovery error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
