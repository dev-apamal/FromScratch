export default function About() {
  return (
    <section
      className="py-4 flex flex-col gap-3 fade-up"
      style={{
        animationDelay: "300ms",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <p
        className="text-xs tracking-widest font-medium"
        style={{ color: "var(--muted)" }}
      >
        behind the workbench
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        the workbench is run by amal — a product designer and developer based in
        bengaluru. every product here is designed and built independently, start
        to finish.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        client and commercial work lives at{" "}
        <a
          href="https://apamal.framer.website"
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
          apamal.framer.website
        </a>
        . the workbench is everything else.
      </p>
    </section>
  );
}
