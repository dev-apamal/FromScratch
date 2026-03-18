import { principles } from "@/data/principles";

export default function Ethos() {
  return (
    <section
      className="py-10 flex flex-col gap-3 fade-up"
      style={{
        animationDelay: "180ms",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <p
        className="text-xs tracking-widest font-medium"
        style={{ color: "var(--muted)" }}
      >
        how things get made here
      </p>
      {principles.map(({ n, t, b }) => (
        <div
          key={n}
          className="grid gap-x-3"
          style={{ gridTemplateColumns: "28px 1fr" }}
        >
          <span
            className="text-xs font-medium pt-0.5"
            style={{ color: "var(--accent)" }}
          >
            {n}
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{t}</p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {b}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
