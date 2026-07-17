import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workouts, exercises } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allWorkouts = await db
      .select()
      .from(workouts)
      .orderBy(desc(workouts.createdAt));

    const allExercises = await db.select().from(exercises);

    const result = allWorkouts.map((w) => ({
      ...w,
      exercises: allExercises
        .filter((e) => e.workoutId === w.id)
        .map((e) => ({
          ...e,
          secondaryMuscles: JSON.parse(e.secondaryMuscles || "[]"),
        })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, date: workoutDate, time: workoutTime, duration, notes, exercises: exerciseList } = body;

    if (!name || !workoutDate || !exerciseList || exerciseList.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    for (const ex of exerciseList) {
      if (!ex.name || !ex.primaryMuscle) {
        return NextResponse.json({ error: "Each exercise needs a name and primary muscle" }, { status: 400 });
      }
    }

    const [workout] = await db
      .insert(workouts)
      .values({
        name,
        date: workoutDate,
        time: workoutTime || null,
        duration: duration || null,
        notes: notes || null,
      })
      .returning();

    const insertedExercises = await db
      .insert(exercises)
      .values(
        exerciseList.map((ex: {
          name: string;
          primaryMuscle: string;
          secondaryMuscles?: string[];
          sets?: number;
          reps?: number;
          weight?: string;
          restTime?: number;
          equipment?: string;
          category?: string;
        }) => ({
          workoutId: workout.id,
          name: ex.name,
          primaryMuscle: ex.primaryMuscle,
          secondaryMuscles: JSON.stringify(ex.secondaryMuscles || []),
          sets: ex.sets || 3,
          reps: ex.reps || 10,
          weight: ex.weight || null,
          restTime: ex.restTime || null,
          equipment: ex.equipment || null,
          category: ex.category || null,
        }))
      )
      .returning();

    return NextResponse.json({
      ...workout,
      exercises: insertedExercises.map((e) => ({
        ...e,
        secondaryMuscles: JSON.parse(e.secondaryMuscles || "[]"),
      })),
    });
  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}
