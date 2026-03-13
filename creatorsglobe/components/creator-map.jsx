"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";

import CreatorMapMarkers from "@/components/creator-map-markers";

const FALLBACK_VIEW = {
  latitude: 20,
  longitude: 0,
  zoom: 1.5,
};

function getAverageCoordinates(creators) {
  if (!creators.length) {
    return FALLBACK_VIEW;
  }

  const totals = creators.reduce(
    (accumulator, creator) => ({
      latitude: accumulator.latitude + creator.latitude,
      longitude: accumulator.longitude + creator.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );

  return {
    latitude: totals.latitude / creators.length,
    longitude: totals.longitude / creators.length,
    zoom: creators.length === 1 ? 11 : 2.5,
  };
}

export default function CreatorMap({ creators }) {
  const mapRef = useRef(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const defaultView = useMemo(() => getAverageCoordinates(creators), [creators]);
  const [selectedCreatorId, setSelectedCreatorId] = useState(creators[0]?.id ?? null);
  const [viewerLocation, setViewerLocation] = useState(null);
  const selectedCreator = useMemo(
    () => creators.find((creator) => creator.id === selectedCreatorId) ?? creators[0] ?? null,
    [creators, selectedCreatorId]
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        setViewerLocation(nextLocation);
        mapRef.current?.flyTo({
          center: [coords.longitude, coords.latitude],
          zoom: 10.5,
          duration: 1800,
        });
      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  if (!mapboxToken) {
    return (
      <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white/70 p-6 text-sm leading-6 text-zinc-600">
        Add <code className="rounded bg-white px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
        to your local env to enable creator discovery on the map.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
      <Map
        ref={mapRef}
        initialViewState={defaultView}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: 560 }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {viewerLocation ? (
          <Marker
            latitude={viewerLocation.latitude}
            longitude={viewerLocation.longitude}
            anchor="center"
          >
            <div className="relative">
              <div className="h-5 w-5 rounded-full border-4 border-white bg-sky-500 shadow-lg" />
              <div className="absolute inset-0 rounded-full bg-sky-400/35 blur-sm" />
            </div>
          </Marker>
        ) : null}

        <CreatorMapMarkers
          creators={creators}
          onCloseCreator={() => setSelectedCreatorId(null)}
          onSelectCreator={(creator) => setSelectedCreatorId(creator.id)}
          selectedCreator={selectedCreator}
        />
      </Map>
    </div>
  );
}
