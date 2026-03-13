"use client";

import { useState } from "react";

import CreatorDiscoveryLayout from "@/components/creator-discovery-layout";

export default function CreatorDiscovery({ creators }) {
  const [hoveredCreatorId, setHoveredCreatorId] = useState(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState(creators[0]?.id ?? null);
  const effectiveSelectedCreatorId = creators.some(
    (creator) => creator.id === selectedCreatorId
  )
    ? selectedCreatorId
    : creators[0]?.id ?? null;

  if (!creators.length) {
    return (
      <section className="rounded-[2rem] border border-dashed border-zinc-300 bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-700">
          Creator discovery
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          No creator profiles are ready yet
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Finish onboarding for a few creators and this view will turn into a
          live directory with synced cards and map pins.
        </p>
      </section>
    );
  }

  return (
    <CreatorDiscoveryLayout
      creators={creators}
      hoveredCreatorId={hoveredCreatorId}
      selectedCreatorId={effectiveSelectedCreatorId}
      onCreatorHover={setHoveredCreatorId}
      onCreatorLeave={() => setHoveredCreatorId(null)}
      onCreatorSelect={setSelectedCreatorId}
      onMarkerSelect={setSelectedCreatorId}
    />
  );
}
