import { stackTags } from "@/data/stackTags";

export default function Card() {
  return (
    <>
      <h4 className="text-base font-medium">the reading nook</h4>
      <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
        a book tracking app, built from scratch.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        there are other book tracking apps. this one exists because building it
        was interesting — the design decisions, the offline-first architecture,
        the question of how little an app can do and still be worth using.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        no social layer. no streaks. no gamification. just your books, your
        reading time, and a clean record of what you've finished.
      </p>
      <div className="flex flex-wrap gap-2">
        {stackTags.map((s) => (
          <span
            key={s}
            className="text-xs px-2 py-1 rounded-full"
            style={{
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </>
  );
}
