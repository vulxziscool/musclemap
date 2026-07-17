import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(userProfile).limit(1);
    return NextResponse.json(rows[0] || null);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(null, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, heightFeet, heightInches, heightCm, birthYear, gender, unitSystem } = body;

    // Calculate heightCm from feet/inches if imperial
    let cm = heightCm ?? null;
    if ((unitSystem === "imperial" || !unitSystem) && heightFeet != null) {
      cm = ((heightFeet || 0) * 12 + (heightInches || 0)) * 2.54;
    }

    const existing = await db.select().from(userProfile).limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProfile)
        .set({
          name: name ?? existing[0].name,
          heightFeet: heightFeet ?? existing[0].heightFeet,
          heightInches: heightInches ?? existing[0].heightInches,
          heightCm: cm ?? existing[0].heightCm,
          birthYear: birthYear ?? existing[0].birthYear,
          gender: gender ?? existing[0].gender,
          unitSystem: unitSystem ?? existing[0].unitSystem,
          updatedAt: new Date(),
        })
        .where(eq(userProfile.id, existing[0].id))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db
        .insert(userProfile)
        .values({
          name: name ?? null,
          heightFeet: heightFeet ?? null,
          heightInches: heightInches ?? null,
          heightCm: cm ?? null,
          birthYear: birthYear ?? null,
          gender: gender ?? null,
          unitSystem: unitSystem ?? "imperial",
        })
        .returning();
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
