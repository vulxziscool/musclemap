import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workouts, exercises } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workoutId = parseInt(id, 10);
    if (isNaN(workoutId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await db.delete(exercises).where(eq(exercises.workoutId, workoutId));
    await db.delete(workouts).where(eq(workouts.id, workoutId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
