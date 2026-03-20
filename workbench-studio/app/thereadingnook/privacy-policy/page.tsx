import Header from "@/components/header";
import Footer from "@/components/footer";

const sections = [
  {
    n: "01",
    t: "your reading data stays yours.",
    b: "the books you add, the sessions you log, and the reading history you build are stored locally on your device. none of that ever leaves it — no account required, no personal information collected, nothing transmitted to any server. what you read is yours, full stop.",
  },
  {
    n: "02",
    t: "we do use analytics — here's why.",
    b: "to keep the app working well, we collect basic, anonymous usage data: things like which screens are visited, how features are used, and whether the app is performing as expected. this helps us understand what's working and catch problems before they affect your experience. none of this data is linked to you personally.",
  },
  {
    n: "03",
    t: "crash reporting.",
    b: "if the app crashes, we'd like to know about it — so we use crash reporting tools to automatically log error details when something goes wrong. these logs contain technical information about the error itself (device type, OS version, the part of the app that failed) but nothing about your books, your reading history, or you.",
  },
  {
    n: "04",
    t: "what we never do with that data.",
    b: "the analytics and crash data we collect is used for one thing: making the app better. it is never sold, never shared with advertisers, and never used to build a profile of you. there are no advertising networks involved in the reading nook, and there never will be.",
  },
  {
    n: "05",
    t: "data deletion.",
    b: "because your reading data lives entirely on your device, deleting the app removes it completely. for analytics and crash data, you can opt out at any time from within the app's settings — we'd rather you stayed, but we respect that it's your call.",
  },
  {
    n: "06",
    t: "children.",
    b: "the reading nook is suitable for all ages. we don't collect personal information from anyone, and the anonymous analytics we do collect apply equally regardless of age. parents can feel confident that no personal data about their children is being gathered.",
  },
  {
    n: "07",
    t: "changes to this policy.",
    b: "if this policy changes in a meaningful way, we'll update this page and let you know within the app. we'll always be upfront about what we collect and why — you deserve to know exactly what you're agreeing to.",
  },
  {
    n: "08",
    t: "questions?",
    b: (
      <>
        if anything here is unclear or you'd like to know more, reach out at{" "}
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
        — we're happy to explain anything in more detail.
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
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
            the reading nook · privacy policy
          </p>
          <h1 className="text-lg font-medium leading-snug">
            your data stays yours.
            <br />
            <em style={{ color: "var(--accent)" }}>here's the full picture.</em>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            your books and reading history never leave your device. we do use
            anonymous analytics and crash reporting to keep the app working
            properly — but nothing is ever linked back to you. this page
            explains exactly what that means.
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            last updated: march 2026
          </p>
        </section>

        {/* Policy sections */}
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
            href="/thereadingnook/terms-and-conditions"
            className="text-xs transition-colors duration-150 hover:text-ink"
            style={{ color: "var(--muted)" }}
          >
            terms & conditions
          </a>
        </section>

        <Footer />
      </div>
    </main>
  );
}
