"use client";

import CreatorCard from "@/components/creator-card";
import CreatorMap from "@/components/creator-map";

export default function CreatorDiscoveryLayout({
  creators,
  hoveredCreatorId,
  selectedCreatorId,
  onCreatorHover,
  onCreatorLeave,
  onCreatorSelect,
  onMarkerSelect,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[26rem_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,241,232,0.96))] shadow-[0_28px_90px_rgba(32,22,8,0.1)]">
        <div className="border-b border-zinc-200/80 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-700">
            Stay nearby
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
            Discover creators like you book stays on Airbnb
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Browse the list, hover to spotlight the map, and click any card to
            center the right-side view.
          </p>
        </div>

        <div className="flex items-center justify-between px-6 py-4 text-sm text-zinc-500">
          <span>{creators.length} creators ready to explore</span>
          <span>Interactive results</span>
        </div>

        <div className="h-[calc(100vh-16rem)] min-h-[34rem] space-y-4 overflow-y-auto px-4 pb-4">
          {creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              isActive={selectedCreatorId === creator.id}
              isHovered={hoveredCreatorId === creator.id}
              onClick={() => onCreatorSelect(creator.id)}
              onHoverEnd={onCreatorLeave}
              onHoverStart={() => onCreatorHover(creator.id)}
            />
          ))}
        </div>
      </div>

      <div className="h-[32rem] xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
        <CreatorMap
          creators={creators}
          hoveredCreatorId={hoveredCreatorId}
          selectedCreatorId={selectedCreatorId}
          onSelectCreator={onMarkerSelect}
        />
      </div>
    </section>
  );
}
