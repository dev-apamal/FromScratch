export default function HeroSection() {
  return (
    <section
      className="py-10 flex flex-col gap-3 fade-up"
      style={{
        animationDelay: "60ms",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <p
        className="text-xs tracking-widest font-medium"
        style={{ color: "var(--muted)" }}
      >
        what this is
      </p>
      <h1 className="text-lg font-medium leading-snug">
        built for the love
        <br />
        <em style={{ color: "var(--accent)" }}>of building it.</em>
      </h1>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        the workbench is a collection of small software products — built
        independently, for no reason other than the enjoyment of designing and
        making things. some solve a real problem. some are just a better version
        of something that already exists. some exist purely because building
        them was worth doing.
      </p>
    </section>
  );
}
