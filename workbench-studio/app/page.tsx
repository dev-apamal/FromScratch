"use client";

const stackTags = [
  "expo router",
  "supabase",
  "drizzle orm",
  "zustand",
  "nativewind",
];

const principles = [
  {
    n: "01",
    t: "the making is the point.",
    b: "these products exist because building software is genuinely enjoyable — the design problems, the technical decisions, the small details that only the builder notices. not every product needs a larger justification than that.",
  },
  {
    n: "02",
    t: "small is fine.",
    b: "a book tracker. a habit log. a simple utility. the workbench doesn't chase scale. if it's useful to a handful of people and satisfying to build, it belongs here.",
  },
  {
    n: "03",
    t: "better design is always a valid reason.",
    b: "sometimes the only difference between a workbench product and what's already out there is that this one looks and feels like someone cared. that's worth building for.",
  },
  {
    n: "04",
    t: "designed and built by the same person.",
    b: "every product here is conceived, designed, and built without a handoff. it's how the work stays coherent — and honestly, it's the most enjoyable way to do it.",
  },
];

const footerLinks = [
  { label: "x.com", href: "https://x.com" },
  { label: "portfolio", href: "https://apamal.framer.website" },
  { label: "email", href: "mailto:hello@theworkbench.studio" },
];

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <div className="max-w-165 mx-auto px-6 sm:px-8 py-14 sm:py-20 pb-28">
        {/* HEADER */}
        <header
          className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-5 mb-14 fade-up"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="text-sm font-medium tracking-wide">
            the workbench<span style={{ color: "var(--accent)" }}>.studio</span>
          </span>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--muted)" }}
          >
            bengaluru · independent
          </span>
        </header>

        {/* INTRO */}
        <section className="mb-14 fade-up" style={{ animationDelay: "60ms" }}>
          <p
            className="text-xs tracking-widest uppercase mb-5"
            style={{ color: "var(--muted)" }}
          >
            what this is
          </p>
          <h1>
            built for the love
            <br />
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              of building it.
            </em>
          </h1>
          <div
            className="space-y-3 text-sm leading-relaxed"
            style={{ color: "var(--muted)", maxWidth: "520px" }}
          >
            <p>
              the workbench is a collection of small software products — built
              independently, for no reason other than the enjoyment of designing
              and making things.
            </p>
            <p>
              some solve a real problem. some are just a better version of
              something that already exists. some exist purely because building
              them was worth doing. that's enough of a reason.
            </p>
          </div>
        </section>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            margin: "0 0 44px",
          }}
        />

        {/* PRODUCTS */}
        <section className="mb-14 fade-up" style={{ animationDelay: "120ms" }}>
          <p
            className="text-xs tracking-widest uppercase mb-6"
            style={{ color: "var(--muted)" }}
          >
            the products
          </p>

          {/* Reading Nook */}
          <div
            className="py-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
              <span className="text-base font-medium">the reading nook</span>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-sm"
                  style={{
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                  }}
                >
                  in development
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-sm"
                  style={{ background: "var(--border)", color: "var(--muted)" }}
                >
                  react native
                </span>
              </div>
            </div>

            <p
              className="text-sm mb-3 leading-relaxed font-medium"
              style={{ color: "var(--ink)", maxWidth: "500px" }}
            >
              a book tracking app, built from scratch.
            </p>

            <p
              className="text-sm mb-3 leading-relaxed"
              style={{ color: "var(--muted)", maxWidth: "500px" }}
            >
              there are other book tracking apps. this one exists because
              building it was interesting — the design decisions, the
              offline-first architecture, the question of how little an app can
              do and still be worth using.
            </p>
            <p
              className="text-sm mb-5 leading-relaxed"
              style={{ color: "var(--muted)", maxWidth: "500px" }}
            >
              no social layer. no streaks. no gamification. just your books,
              your reading time, and a clean record of what you've finished.
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {stackTags.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-1"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-200 hover:bg-ink hover:text-bg"
              style={{ border: "1px solid var(--ink)", color: "var(--ink)" }}
            >
              follow the build →
            </a>
          </div>

          {/* Upcoming */}
          <div
            className="py-6"
            style={{
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
              <span
                className="text-base font-medium"
                style={{ color: "var(--muted)" }}
              >
                more on the bench
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-sm w-fit"
                style={{ background: "var(--border)", color: "var(--muted)" }}
              >
                in progress
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted)", maxWidth: "500px" }}
            >
              there are always a few things being tinkered with. this page gets
              updated when something is real enough to name. follow on x to see
              things before they land here.
            </p>
          </div>
        </section>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            margin: "0 0 44px",
          }}
        />

        {/* ETHOS */}
        <section className="mb-14 fade-up" style={{ animationDelay: "180ms" }}>
          <p
            className="text-xs tracking-widest uppercase mb-6"
            style={{ color: "var(--muted)" }}
          >
            how things get made here
          </p>
          {principles.map(({ n, t, b }) => (
            <div
              key={n}
              className="grid gap-x-4 py-4"
              style={{
                borderBottom: "1px solid var(--border)",
                gridTemplateColumns: "28px 1fr",
              }}
            >
              <span
                className="text-xs font-medium pt-0.5"
                style={{ color: "var(--accent)" }}
              >
                {n}
              </span>
              <div>
                <p className="text-sm font-medium mb-1">{t}</p>
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

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            margin: "0 0 44px",
          }}
        />

        {/* BUILDING IN PUBLIC */}
        <section className="mb-14 fade-up" style={{ animationDelay: "220ms" }}>
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "var(--muted)" }}
          >
            the process, in the open
          </p>
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: "var(--muted)" }}
          >
            every product gets documented as it's being built — the decisions,
            the dead ends, the parts that had to be redone.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
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
            . if you&apos;re building something yourself, it&apos;s worth
            following.
          </p>
        </section>

        {/* CTA BLOCK */}
        <div
          className="p-7 sm:p-9 mb-14 fade-up"
          style={{ background: "var(--ink)", animationDelay: "260ms" }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "rgba(244,241,235,0.4)" }}
          >
            keep up
          </p>
          <h2
            className="text-2xl sm:text-3xl mb-4 leading-snug"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              color: "var(--bg)",
            }}
          >
            more products are always
            <br />
            <em style={{ fontStyle: "italic", color: "#e8a090" }}>
              in the making.
            </em>
          </h2>
          <p
            className="text-sm mb-6 leading-relaxed"
            style={{ color: "rgba(244,241,235,0.55)" }}
          >
            this page gets updated when something is ready. for the
            work-in-progress — the decisions, the iterations, the things that
            almost shipped — that&apos;s on x.
          </p>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs tracking-widest uppercase px-5 py-3 transition-all duration-200 hover:bg-accent hover:border-accent"
            style={{
              border: "1px solid rgba(244,241,235,0.25)",
              color: "var(--bg)",
            }}
          >
            follow on x →
          </a>
        </div>

        {/* ABOUT */}
        <section className="mb-14 fade-up" style={{ animationDelay: "300ms" }}>
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "var(--muted)" }}
          >
            behind the workbench
          </p>
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: "var(--muted)" }}
          >
            the workbench is run by amal — a product designer and developer
            based in bengaluru. every product here is designed and built
            independently, start to finish.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            client and commercial work lives separately at{" "}
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
            . the workbench is the independent side — products built on its own
            terms, for its own reasons.
          </p>
        </section>

        {/* FOOTER */}
        <footer
          className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 pt-6 fade-up"
          style={{
            borderTop: "1px solid var(--border)",
            animationDelay: "340ms",
          }}
        >
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            © 2026 the workbench studio · bengaluru
          </p>
          <div className="flex gap-5">
            {footerLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-xs transition-colors duration-150 hover:text-ink"
                style={{ color: "var(--muted)" }}
              >
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
