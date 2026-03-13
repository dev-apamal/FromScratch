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

export default function CreatorMap({
  creators,
  hoveredCreatorId,
  selectedCreatorId,
  onSelectCreator,
}) {
  const mapRef = useRef(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const defaultView = useMemo(() => getAverageCoordinates(creators), [creators]);
  const [viewerLocation, setViewerLocation] = useState(null);
  const selectedCreator = useMemo(() => {
    if (!selectedCreatorId) {
      return null;
    }

    return creators.find((creator) => creator.id === selectedCreatorId) ?? null;
  }, [creators, selectedCreatorId]);

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

  useEffect(() => {
    if (!selectedCreator) {
      return;
    }

    mapRef.current?.flyTo({
      center: [selectedCreator.longitude, selectedCreator.latitude],
      zoom: 10.5,
      duration: 900,
      essential: true,
    });
  }, [selectedCreator]);

  if (!mapboxToken) {
    return (
      <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white/70 p-6 text-sm leading-6 text-zinc-600">
        Add <code className="rounded bg-white px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
        to your local env to enable creator discovery on the map.
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
      <Map
        ref={mapRef}
        initialViewState={defaultView}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: "100%" }}
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
          hoveredCreatorId={hoveredCreatorId}
          onCloseCreator={() => onSelectCreator(null)}
          onSelectCreator={(creator) => onSelectCreator(creator.id)}
          selectedCreator={selectedCreator}
        />
      </Map>
    </div>
  );
}
