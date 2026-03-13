import { redirect } from "next/navigation";

import CreatorMap from "@/components/creator-map";
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
      latitude: true,
      longitude: true,
      experienceLevel: true,
      availabilityStatus: true,
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
    latitude: Number(profile.latitude),
    longitude: Number(profile.longitude),
    experienceLevel: profile.experienceLevel,
    availabilityStatus: profile.availabilityStatus,
    roles: profile.roles.map(({ role }) => role),
  }));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f4e8cf_0%,#f8f5ef_42%,#efe7dc_100%)] px-6 py-12 text-zinc-950">
      <section className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-zinc-950 p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
              Creator Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Welcome back, {session.user.name || session.user.email}
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              Explore creators around you, move the map freely, and open a quick
              profile card from any marker.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.25em] text-orange-700">
              Map Setup
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
              <p>
                The map uses <code>react-map-gl</code> on top of Mapbox and will
                request browser geolocation to center on the viewer.
              </p>
              <p>
                Markers are generated from creator profile coordinates stored in
                Prisma, and clicking a marker opens a compact creator card.
              </p>
              <p>
                Configure <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> in your env if
                you have not already.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <p className="text-sm text-zinc-500">Creators on map</p>
              <p className="mt-2 text-3xl font-semibold">{creators.length}</p>
            </div>
            <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <p className="text-sm text-zinc-500">Map interactions</p>
              <p className="mt-2 text-3xl font-semibold">Zoom + Pan</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <CreatorMap creators={creators} />
          <p className="px-2 text-sm leading-6 text-zinc-600">
            Tip: allow location access to recenter the map on your current
            position automatically.
          </p>
        </div>
      </section>
    </main>
  );
}
