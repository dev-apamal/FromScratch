"use client";

import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const sections = [
  {
    n: "01",
    t: "using the app.",
    b: "by downloading or using the reading nook, you're agreeing to these terms. they're here to set clear expectations on both sides — not to catch you out. if anything here doesn't sit right with you, we're happy to talk it through.",
  },
  {
    n: "02",
    t: "what the reading nook is.",
    b: "a personal book tracking app, built independently and offered free of charge. it's a workbench product — made because making it was worthwhile. we maintain it with care, and we'll always be upfront if that changes.",
  },
  {
    n: "03",
    t: "your data belongs to you.",
    b: "everything you add to the app — books, reading sessions, notes — is yours. it lives on your device, and we have no access to it. we'd recommend keeping your device backed up, since local data can't be recovered from our end if something goes wrong.",
  },
  {
    n: "04",
    t: "fair use.",
    b: "the reading nook is built to track books, and that's what it's here for. we just ask that you don't attempt to reverse-engineer or modify it, and that you use it in a way that's consistent with applicable law. that's the full extent of it.",
  },
  {
    n: "05",
    t: "limitations.",
    b: "we put real care into making the reading nook reliable — but no app is perfect. we can't guarantee it will work flawlessly on every device or in every situation, and we're not able to be held liable for data loss or interruptions to service. we will always try to do right by you when something goes wrong.",
  },
  {
    n: "06",
    t: "updates.",
    b: "we'll update the app over time — to fix things, improve things, and occasionally rethink things. we'll communicate meaningful changes clearly. continuing to use the app after an update means you're comfortable with what's changed.",
  },
  {
    n: "07",
    t: "if you decide to leave.",
    b: "you can delete the app whenever you like — no hoops, no friction. because your data is stored locally, deleting the app removes it entirely. if we ever stop distributing the reading nook, we'll give as much notice as we reasonably can.",
  },
  {
    n: "08",
    t: "governing law.",
    b: "these terms are governed by the laws of india. any disputes arising from use of the app will be handled in bengaluru, karnataka.",
  },
  {
    n: "09",
    t: "questions?",
    b: (
      <>
        if something here is unclear or you'd just like to talk through any of
        it, reach out at{" "}
        <a
          href="mailto:support@theworkbench.studio"
          style={{
            color: "var(--ink)",
            textDecoration: "underline",
            textDecorationColor: "var(--border)",
            textUnderlineOffset: "3px",
          }}
          className="transition-colors duration-150 hover:text-accent"
        >
          support@theworkbench.studio
        </a>{" "}
        — we're glad to help.
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <div className="max-w-165 mx-auto px-6">
        <Header />

        {/* Intro */}
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
            the reading nook · terms & conditions
          </p>
          <h1 className="text-lg font-medium leading-snug">
            plain language,
            <br />
            <em style={{ color: "var(--accent)" }}>no surprises.</em>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            these terms cover the basics of using the reading nook. they're
            written to be read, not to bury anything. if something here is
            unclear, we're happy to talk it through.
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            last updated: march 2026
          </p>
        </section>

        {/* Terms sections */}
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
            in full
          </p>
          {sections.map(({ n, t, b }) => (
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

        {/* Nav back */}
        <section
          className="py-6 flex gap-5 fade-up"
          style={{ animationDelay: "180ms" }}
        >
          <a
            href="/thereadingnook"
            className="text-xs transition-colors duration-150 hover:text-ink"
            style={{ color: "var(--muted)" }}
          >
            ← the reading nook
          </a>
          <a
            href="/thereadingnook/privacy-policy"
            className="text-xs transition-colors duration-150 hover:text-ink"
            style={{ color: "var(--muted)" }}
          >
            privacy policy
          </a>
        </section>

        <Footer />
      </div>
    </main>
  );
}
