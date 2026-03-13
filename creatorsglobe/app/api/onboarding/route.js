import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createCreatorProfile } from "@/lib/creator-profile";
import { creatorOnboardingSchema } from "@/lib/onboarding";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const rawRoles = formData.get("roles");
  let roles = [];

  try {
    roles = JSON.parse(typeof rawRoles === "string" ? rawRoles : "[]");
  } catch {
    return NextResponse.json({ error: "Roles payload is invalid." }, { status: 400 });
  }

  const portfolioFiles = formData
    .getAll("portfolioFiles")
    .filter((value) => value instanceof File);

  if (portfolioFiles.length === 0) {
    return NextResponse.json(
      { error: "Upload at least one portfolio image." },
      { status: 400 }
    );
  }

  if (
    portfolioFiles.some(
      (file) => !file.type.startsWith("image/") || file.size > MAX_FILE_SIZE
    )
  ) {
    return NextResponse.json(
      { error: "Portfolio files must be images and 5MB or smaller." },
      { status: 400 }
    );
  }

  const parsed = creatorOnboardingSchema.safeParse({
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    city: formData.get("city"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    roles,
    experienceLevel: formData.get("experienceLevel"),
    availabilityStatus: formData.get("availabilityStatus"),
    budgetMin: formData.get("budgetMin"),
    budgetMax: formData.get("budgetMax"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid onboarding data.",
      },
      { status: 400 }
    );
  }

  const profile = await createCreatorProfile({
    userId: session.user.id,
    values: parsed.data,
    portfolioFiles,
  });

  return NextResponse.json({ profileId: profile.id }, { status: 201 });
}
