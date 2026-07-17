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

    // Parse everything explicitly — don't trust nullish coalescing
    const name: string | null = body.name || null;
    const heightFeet: number | null = typeof body.heightFeet === "number" ? body.heightFeet : null;
    const heightInches: number | null = typeof body.heightInches === "number" ? body.heightInches : null;
    const birthYear: number | null = typeof body.birthYear === "number" ? body.birthYear : null;
    const gender: string | null = body.gender || null;
    const unitSystem: string = body.unitSystem || "imperial";

    // Always compute cm from feet/inches
    let heightCm: number | null = null;
    if (heightFeet !== null) {
      heightCm = (heightFeet * 12 + (heightInches || 0)) * 2.54;
    } else if (typeof body.heightCm === "number") {
      heightCm = body.heightCm;
    }

    const data = {
      name,
      heightFeet,
      heightInches,
      heightCm,
      birthYear,
      gender,
      unitSystem,
      updatedAt: new Date(),
    };

    const existing = await db.select().from(userProfile).limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProfile)
        .set(data)
        .where(eq(userProfile.id, existing[0].id))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db
        .insert(userProfile)
        .values(data)
        .returning();
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
