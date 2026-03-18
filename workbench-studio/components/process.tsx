export default function Process() {
  return (
    <section
      className="py-10 flex flex-col gap-3 fade-up"
      style={{
        animationDelay: "220ms",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <p
        className="text-xs tracking-widest font-medium"
        style={{ color: "var(--muted)" }}
      >
        the process, in the open
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        every product gets documented as it's being built — the decisions, the
        dead ends, the parts that had to be redone. not a tutorial. just an
        honest record of what it actually takes to make something.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        it all lives on{" "}
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-150 hover:text-accent"
          style={{
            color: "var(--ink)",
            textDecoration: "underline",
            textDecorationColor: "var(--border)",
            textUnderlineOffset: "3px",
          }}
        >
          x.com
        </a>{" "}
        under{" "}
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-150 hover:text-accent"
          style={{
            color: "var(--ink)",
            textDecoration: "underline",
            textDecorationColor: "var(--border)",
            textUnderlineOffset: "3px",
          }}
        >
          #FromScratch
        </a>
        .
      </p>
    </section>
  );
}
