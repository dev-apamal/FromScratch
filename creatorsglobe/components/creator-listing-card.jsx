"use client";

/* eslint-disable @next/next/no-img-element */

const availabilityStyles = {
  available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  busy: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  unavailable: "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200",
};

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getAvailabilityClasses(status) {
  return availabilityStyles[status] || availabilityStyles.available;
}

/**
 * @typedef {Object} CreatorListingCardProps
 * @property {string} name
 * @property {string} role
 * @property {string} city
 * @property {"available" | "busy" | "unavailable"} availability
 * @property {string} portfolioImage
 * @property {string} [profilePhoto]
 * @property {string} [portfolioAlt]
 * @property {() => void} [onClick]
 */

/**
 * Clean, Airbnb-inspired card for creator discovery grids.
 *
 * @param {CreatorListingCardProps} props
 */
export default function CreatorListingCard({
  availability,
  city,
  name,
  onClick,
  portfolioAlt,
  portfolioImage,
  profilePhoto,
  role,
}) {
  const clickable = typeof onClick === "function";
  const CardTag = clickable ? "button" : "article";

  return (
    <CardTag
      className="group w-full overflow-hidden rounded-[1.75rem] bg-white text-left text-zinc-950 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
      onClick={onClick}
      type={clickable ? "button" : undefined}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          alt={portfolioAlt || `${name} portfolio preview`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          src={portfolioImage}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />

        <span
          className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize backdrop-blur-sm ${getAvailabilityClasses(
            availability
          )}`}
        >
          {availability}
        </span>
      </div>

      <div className="flex items-start gap-3 p-4 sm:p-5">
        {profilePhoto ? (
          <img
            alt={name}
            className="h-14 w-14 rounded-full object-cover ring-1 ring-black/5"
            src={profilePhoto}
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 ring-1 ring-black/5">
            {getInitials(name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold tracking-tight text-zinc-950">
                {name}
              </h3>
              <p className="truncate text-sm font-medium text-zinc-600">{role}</p>
            </div>
          </div>

          <p className="mt-2 text-sm text-zinc-500">{city}</p>
        </div>
      </div>
    </CardTag>
  );
}

export const creatorListingCardExampleProps = {
  name: "Maya Chen",
  role: "Lifestyle Photographer",
  city: "San Francisco, CA",
  availability: "available",
  profilePhoto:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  portfolioImage:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
};
