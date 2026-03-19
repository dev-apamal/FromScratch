"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { footerLinks } from "@/data/footerLinks";

const features = [
  {
    n: "01",
    t: "your books, nothing else.",
    b: "no social layer. no followers. no public shelves. what you read is yours — tracked locally, stored privately.",
  },
  {
    n: "02",
    t: "reading time, honestly.",
    b: "log sessions as they happen. the nook keeps a running record of how long you actually sit with a book — not how long you meant to.",
  },
  {
    n: "03",
    t: "a clean record of what you've finished.",
    b: "finished books stay finished. no streaks to maintain, no badges to earn. just a quiet, honest archive.",
  },
  {
    n: "04",
    t: "offline first, always.",
    b: "works without a connection. your library doesn't depend on a server staying up or a subscription staying paid.",
  },
];

const stackTags = ["expo router", "drizzle orm", "zustand", "nativewind"];

export default function TheReadingNookPage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <div className="max-w-165 mx-auto px-6">
        <Header />

        {/* Hero */}
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
            the reading nook
          </p>
          <h1 className="text-lg font-medium leading-snug">
            a book tracker that
            <br />
            <em style={{ color: "var(--accent)" }}>gets out of the way.</em>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            there are other book tracking apps. this one exists because building
            it was interesting — and because most of the others do too much. the
            reading nook does as little as possible, on purpose.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
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
        </section>

        {/* What it does */}
        <section
          className="py-10 flex flex-col gap-3 fade-up"
          style={{
            animationDelay: "120ms",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            className="text-xs tracking-widest font-medium"
            style={{ color: "var(--muted)" }}
          >
            what it does
          </p>
          {features.map(({ n, t, b }) => (
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

        {/* What it doesn't do */}
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
            what it doesn't do
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            no recommendations. no ratings. no year in review. no gamification.
            no account required. no data sent anywhere. the nook doesn't know
            who you are, and it doesn't need to.
          </p>
        </section>

        {/* Status */}
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
            status
          </p>
          <p className="text-sm font-medium">in development.</p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            being built in the open under{" "}
            <Link
              href={footerLinks[0].href}
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
            </Link>
            . the decisions, the dead ends, the parts that had to be redone —
            all of it documented as it happens.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={footerLinks[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium px-4 py-2.5 transition-colors duration-150"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                display: "inline-block",
              }}
            >
              follow the build
            </Link>
            <Link
              href="/"
              className="text-sm font-medium px-4 py-2.5 transition-colors duration-150 hover:text-accent"
              style={{
                border: "1px solid var(--border)",
                color: "var(--ink)",
                display: "inline-block",
              }}
            >
              ← back to the workbench
            </Link>
          </div>
        </section>

        {/* Legal links */}
        <section
          className="py-6 flex gap-5 fade-up"
          style={{ animationDelay: "260ms" }}
        >
          <Link
            href="/thereadingnook/privacy-policy"
            className="text-xs transition-colors duration-150 hover:text-ink"
            style={{ color: "var(--muted)" }}
          >
            privacy policy
          </Link>
          <Link
            href="/thereadingnook/terms-and-conditions"
            className="text-xs transition-colors duration-150 hover:text-ink"
            style={{ color: "var(--muted)" }}
          >
            terms & conditions
          </Link>
          <Link
            href="mailto:support@theworkbench.studio"
            className="text-xs transition-colors duration-150 hover:text-ink"
            style={{ color: "var(--muted)" }}
          >
            support
          </Link>
        </section>

        <Footer />
      </div>
    </main>
  );
}
