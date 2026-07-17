import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bodyMetrics } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(bodyMetrics).orderBy(desc(bodyMetrics.date)).limit(90);
    return NextResponse.json(rows.reverse());
  } catch (error) {
    console.error("Metrics error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date: d, weight, bodyFat, notes } = body;
    if (!d) return NextResponse.json({ error: "Date required" }, { status: 400 });
    const [row] = await db.insert(bodyMetrics).values({
      date: d,
      weight: weight ?? null,
      bodyFat: bodyFat ?? null,
      notes: notes ?? null,
    }).returning();
    return NextResponse.json(row);
  } catch (error) {
    console.error("Metrics error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
