// services/locationService.ts

// ─── Types ───────────────────────────────────────────────────────────────────
export type SearchResult = {
  id: string;
  label: string; // short name e.g. "Malappuram"
  address: string; // full address string
  city: string;
  latitude: number;
  longitude: number;
};

// ─── 1. SEARCH (Photon) ───────────────────────────────────────────────────────
// Photon is built on OpenStreetMap data by Komoot.
// It's specifically designed for autocomplete — fast, fuzzy, typo-tolerant.
// API docs: https://photon.komoot.io
//
// How the URL works:
// q        = search query typed by user
// limit    = max results to return
// lang     = language for results
// lat/lon  = bias results toward a location (we bias toward Kerala)
export const searchLocations = async (
  query: string,
): Promise<SearchResult[]> => {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en&lat=11.0&lon=76.0`;
    // 🧠 encodeURIComponent converts spaces/special chars to URL-safe format
    // e.g. "Tirur Kerala" becomes "Tirur%20Kerala"

    const response = await fetch(url);
    const data = await response.json();

    // Photon returns GeoJSON format — features is an array of results
    // Each feature has geometry (coordinates) and properties (name, address)
    return data.features.map((feature: any) => {
      const props = feature.properties;
      const [longitude, latitude] = feature.geometry.coordinates;
      // 🧠 GeoJSON is always [longitude, latitude] — note the order!
      // This trips up a lot of developers. Lat/lng is the human-readable order,
      // but GeoJSON flips it to [lng, lat] for mathematical reasons.

      const label = props.name || props.city || props.county || "Unknown";
      const addressParts = [
        props.street,
        props.housenumber,
        props.city,
        props.county,
        props.state,
        props.country,
      ].filter(Boolean); // removes undefined/null parts

      return {
        id: `${latitude}-${longitude}`,
        label,
        address: addressParts.join(", "),
        city: props.city || props.county || label,
        latitude,
        longitude,
      };
    });
  } catch (error) {
    console.error("Photon search error:", error);
    return [];
  }
};

// ─── 2. REVERSE GEOCODE (Nominatim) ──────────────────────────────────────────
// Reverse geocoding = converting GPS coordinates into a readable address.
// We use this when the user taps "Use current location" —
// the device gives us lat/lng, we convert it to "Tirur, Malappuram".
//
// Nominatim is OpenStreetMap's official geocoding service.
// We use a User-Agent header because Nominatim's usage policy requires it —
// it helps them identify apps and contact devs if there's abuse.
export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<SearchResult | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        // 🧠 Nominatim REQUIRES a User-Agent header — without it requests
        // may be blocked. Use your app name and contact info.
        "User-Agent": "ArchanaApp/1.0",
        "Accept-Language": "en",
      },
    });

    const data = await response.json();

    if (!data || data.error) return null;

    const addr = data.address;
    const label =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state_district ||
      "Unknown";

    const addressParts = [
      addr.road,
      addr.suburb,
      addr.city || addr.town || addr.village,
      addr.county,
      addr.state,
    ].filter(Boolean);

    return {
      id: `${latitude}-${longitude}`,
      label,
      address: addressParts.join(", "),
      city: label,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error("Nominatim reverse geocode error:", error);
    return null;
  }
};
