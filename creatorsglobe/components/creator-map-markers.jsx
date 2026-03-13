"use client";

/* eslint-disable @next/next/no-img-element */

import { Marker, Popup } from "react-map-gl/mapbox";

function formatRole(role) {
  return role.toLowerCase().replaceAll("_", " ");
}

function formatAvailability(status) {
  return status.toLowerCase().replaceAll("_", " ");
}

export default function CreatorMapMarkers({
  creators,
  selectedCreator,
  onSelectCreator,
  onCloseCreator,
}) {
  return (
    <>
      {creators.map((creator) => {
        const isActive = selectedCreator?.id === creator.id;

        return (
          <Marker
            key={creator.id}
            latitude={creator.latitude}
            longitude={creator.longitude}
            anchor="bottom"
          >
            <button
              aria-label={`View ${creator.name}`}
              className={`flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-lg transition ${
                isActive
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-white bg-orange-500 text-white hover:bg-orange-400"
              }`}
              onClick={() => onSelectCreator(creator)}
              type="button"
            >
              {creator.roles[0]?.slice(0, 1) || "C"}
            </button>
          </Marker>
        );
      })}

      {selectedCreator ? (
        <Popup
          anchor="top"
          closeButton
          closeOnClick={false}
          latitude={selectedCreator.latitude}
          longitude={selectedCreator.longitude}
          offset={28}
          onClose={onCloseCreator}
        >
          <article className="w-72 space-y-3 p-1 text-zinc-950">
            <div className="flex items-center gap-3">
              {selectedCreator.image ? (
                <img
                  alt={selectedCreator.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                  src={selectedCreator.image}
                  height="56"
                  width="56"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-lg font-semibold text-zinc-700">
                  {selectedCreator.name.slice(0, 1)}
                </div>
              )}

              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">
                  {selectedCreator.name}
                </h3>
                <p className="truncate text-sm text-zinc-500">
                  {selectedCreator.city || "Location unavailable"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {selectedCreator.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700"
                >
                  {formatRole(role)}
                </span>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-800">
                {selectedCreator.headline || "Available for creator collaborations"}
              </p>
              <p className="line-clamp-3 text-sm leading-6 text-zinc-600">
                {selectedCreator.bio || "Open the full profile to learn more about this creator."}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{selectedCreator.experienceLevel.toLowerCase()}</span>
              <span>{formatAvailability(selectedCreator.availabilityStatus)}</span>
            </div>
          </article>
        </Popup>
      ) : null}
    </>
  );
}
