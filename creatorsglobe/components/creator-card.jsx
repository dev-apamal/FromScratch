"use client";

/* eslint-disable @next/next/no-img-element */

function formatLabel(value) {
  return value.toLowerCase().replaceAll("_", " ");
}

function formatBudget(min, max) {
  if (!min && !max) {
    return "Rates on request";
  }

  if (min && max) {
    return `$${min.toLocaleString()}-$${max.toLocaleString()}`;
  }

  if (min) {
    return `From $${min.toLocaleString()}`;
  }

  return `Up to $${max.toLocaleString()}`;
}

export default function CreatorCard({
  creator,
  isActive,
  isHovered,
  onClick,
  onHoverEnd,
  onHoverStart,
}) {
  return (
    <button
      className={`group w-full rounded-[1.75rem] border bg-white p-5 text-left shadow-[0_18px_45px_rgba(32,22,8,0.08)] transition duration-200 ${
        isActive
          ? "border-zinc-950 ring-2 ring-zinc-950/10"
          : isHovered
            ? "border-orange-300 ring-2 ring-orange-200/70"
            : "border-white/70 hover:border-orange-200 hover:shadow-[0_22px_55px_rgba(32,22,8,0.12)]"
      }`}
      onBlur={onHoverEnd}
      onClick={onClick}
      onFocus={onHoverStart}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      type="button"
    >
      <div className="flex items-start gap-4">
        {creator.image ? (
          <img
            alt={creator.name}
            className="h-16 w-16 rounded-[1.25rem] object-cover"
            height="64"
            src={creator.image}
            width="64"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-zinc-100 text-xl font-semibold text-zinc-700">
            {creator.name.slice(0, 1)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight text-zinc-950">
                {creator.name}
              </p>
              <p className="truncate text-sm text-zinc-500">
                {creator.city || "Location unavailable"}
              </p>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              {formatLabel(creator.availabilityStatus)}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
            {creator.headline || creator.bio || "Open for creator collaborations."}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {creator.roles.map((role) => (
          <span
            key={role}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
          >
            {formatLabel(role)}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-[1.25rem] bg-[#f7f1e8] p-4 text-sm text-zinc-700">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Experience
          </p>
          <p className="mt-1 font-medium text-zinc-900">
            {formatLabel(creator.experienceLevel)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Budget
          </p>
          <p className="mt-1 font-medium text-zinc-900">
            {formatBudget(creator.budgetMin, creator.budgetMax)}
          </p>
        </div>
      </div>
    </button>
  );
}
