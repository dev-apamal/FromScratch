import { redirect } from "next/navigation";

import CreatorDiscovery from "@/components/creator-discovery";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dashboard | CreatorsGlobe",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.hasCreatorProfile) {
    redirect("/onboarding");
  }

  const creatorProfiles = await prisma.creatorProfile.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      headline: true,
      bio: true,
      city: true,
      country: true,
      latitude: true,
      longitude: true,
      experienceLevel: true,
      availabilityStatus: true,
      budgetMin: true,
      budgetMax: true,
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      roles: {
        select: {
          role: true,
        },
        take: 3,
      },
    },
  });

  const creators = creatorProfiles.map((profile) => ({
    id: profile.id,
    name: profile.user.name || profile.user.email || "Creator",
    image: profile.user.image,
    headline: profile.headline,
    bio: profile.bio,
    city: profile.city,
    country: profile.country,
    latitude: Number(profile.latitude),
    longitude: Number(profile.longitude),
    experienceLevel: profile.experienceLevel,
    availabilityStatus: profile.availabilityStatus,
    budgetMin: profile.budgetMin,
    budgetMax: profile.budgetMax,
    roles: profile.roles.map(({ role }) => role),
  }));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f4e8cf_0%,#f8f5ef_42%,#efe7dc_100%)] px-6 py-12 text-zinc-950">
      <section className="mx-auto w-full max-w-[96rem]">
        <CreatorDiscovery creators={creators} />
      </section>
    </main>
  );
}
