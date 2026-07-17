import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { strengthRecords } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(strengthRecords).orderBy(desc(strengthRecords.date)).limit(200);
    return NextResponse.json(rows.reverse());
  } catch (error) {
    console.error("Strength error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date: d, exerciseName, weight, reps } = body;
    if (!d || !exerciseName || !weight) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const r = reps || 1;
    const estimatedMax = Math.round(weight * (1 + r / 30) * 10) / 10;
    const [row] = await db.insert(strengthRecords).values({
      date: d,
      exerciseName,
      weight,
      reps: r,
      estimatedMax,
    }).returning();
    return NextResponse.json(row);
  } catch (error) {
    console.error("Strength error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
