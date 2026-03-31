// services/templeService.ts
import { supabase } from "./supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Temple = {
  id: string;
  name: string;
  description: string | null;
  deity: string;
  category: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  open_time: string | null;
  close_time: string | null;
  is_open: boolean;
  rating: number;
  review_count: number;
  phone: string | null;
  website: string | null;
};

export type TempleImage = {
  id: string;
  temple_id: string;
  url: string;
  is_primary: boolean;
};

export type Pooja = {
  id: string;
  temple_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number | null;
  is_available: boolean;
};

export type Priest = {
  id: string;
  temple_id: string;
  name: string;
  specialization: string | null;
  image_url: string | null;
  phone: string | null;
};

export type TempleEvent = {
  id: string;
  temple_id: string;
  name: string;
  description: string | null;
  event_date: string;
  image_url: string | null;
};

// 🧠 TempleListItem is a lightweight version of Temple for the home/search list.
// Instead of using Pick<> utility type (which caused the formatting issue),
// we just define the type directly — cleaner and easier to read.
// This contains only the fields needed to render a TempleCard.
export type TempleListItem = {
  id: string;
  name: string;
  deity: string;
  category: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  open_time: string | null;
  close_time: string | null;
  is_open: boolean;
  rating: number;
  review_count: number;
  // 🧠 temple_images comes from a joined table — not on Temple directly.
  // We include it here because the card needs the primary image URL.
  temple_images: {
    url: string;
    is_primary: boolean;
  }[];
};

// 🧠 TempleDetail is the full temple with all related tables joined in.
// Used only on the temple detail page where we need everything.
// The & operator merges two types — called an intersection type.
export type TempleDetail = Temple & {
  temple_images: TempleImage[];
  poojas: Pooja[];
  priests: Priest[];
  events: TempleEvent[];
};

// ─── 1. Fetch temples for list view ──────────────────────────────────────────
// Used on home screen. Optionally filtered by city.
// Only selects fields needed for the card — not the full temple object.
export const fetchTemples = async (
  city?: string,
): Promise<TempleListItem[]> => {
  let query = supabase
    .from("temples")
    .select(
      `
      id,
      name,
      deity,
      category,
      address,
      city,
      latitude,
      longitude,
      open_time,
      close_time,
      is_open,
      rating,
      review_count,
      temple_images(url, is_primary)
    `,
    )
    .order("rating", { ascending: false });

  // 🧠 ilike = case-insensitive SQL LIKE.
  // % wildcards mean "contains anywhere in string".
  // "Malappuram" matches "Tirur, Malappuram" and "Malappuram District".
  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchTemples error:", error.message);
    return [];
  }

  return (data ?? []) as TempleListItem[];
};

// ─── 2. Search temples by query string ───────────────────────────────────────
// Used on search screen. Searches name, deity, category and city columns.
export const searchTemples = async (
  query: string,
  city?: string,
): Promise<TempleListItem[]> => {
  if (!query.trim()) return [];

  const q = query.trim();

  // 🧠 .or() with ilike lets us search across multiple columns in one query.
  // The string format is: "column.operator.value,column.operator.value"
  // This is equivalent to:
  // WHERE name ILIKE '%q%' OR deity ILIKE '%q%' OR category ILIKE '%q%' OR city ILIKE '%q%'
  const { data, error } = await supabase
    .from("temples")
    .select(
      `
      id,
      name,
      deity,
      category,
      address,
      city,
      latitude,
      longitude,
      open_time,
      close_time,
      is_open,
      rating,
      review_count,
      temple_images(url, is_primary)
    `,
    )
    .or(
      `name.ilike.%${q}%,deity.ilike.%${q}%,category.ilike.%${q}%,city.ilike.%${q}%`,
    )
    .order("rating", { ascending: false });

  if (error) {
    console.error("searchTemples error:", error.message);
    return [];
  }

  return (data ?? []) as TempleListItem[];
};

// ─── 3. Fetch single temple with all related data ─────────────────────────────
// Used on temple detail page.
// One query returns temple + images + poojas + priests + events.
// This is the power of PostgreSQL — all related data in a single round trip.
export const fetchTempleById = async (
  id: string,
): Promise<TempleDetail | null> => {
  const { data, error } = await supabase
    .from("temples")
    .select(
      `
      *,
      temple_images(id, url, is_primary),
      poojas(id, name, description, price, duration_minutes, is_available),
      priests(id, name, specialization, image_url, phone),
      events(id, name, description, event_date, image_url)
    `,
    )
    // 🧠 .eq("id", id) = WHERE id = 'xxx'
    // .single() returns one object instead of an array.
    // Throws an error if 0 or more than 1 row is found.
    .eq("id", id)
    .single();

  if (error) {
    console.error("fetchTempleById error:", error.message);
    return null;
  }

  return data as TempleDetail;
};
