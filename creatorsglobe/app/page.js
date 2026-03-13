import Link from "next/link";

import { LoginButtons } from "@/components/auth-buttons";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f4e8cf_0%,#f8f5ef_45%,#efe7dc_100%)] px-6 py-16 font-sans">
      <main className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-zinc-950 p-10 text-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-14">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-amber-300">
            CreatorsGlobe
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Producers can find nearby creative professionals in minutes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            This starter includes NextAuth with Google, passwordless email
            login, Prisma-backed sessions, and onboarding redirects for new
            creators who have not built a profile yet.
          </p>
          <div className="mt-10">
            <LoginButtons />
          </div>
        </section>

        <aside className="rounded-[2rem] bg-white p-10 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-700">
            Session State
          </p>
          {session?.user ? (
            <div className="mt-6 space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Signed in as {session.user.name || session.user.email}
              </h2>
              <p className="text-base leading-7 text-zinc-600">
                Creator profile status:{" "}
                {session.user.hasCreatorProfile ? "complete" : "missing"}.
              </p>
              <Link
                className="inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                href={session.user.hasCreatorProfile ? "/dashboard" : "/onboarding"}
              >
                Continue
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Ready for auth flows
              </h2>
              <p className="text-base leading-7 text-zinc-600">
                Sign in to test Google OAuth, email magic links, database
                sessions, and onboarding redirects.
              </p>
              <Link
                className="inline-flex rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-900"
                href="/login"
              >
                Open login page
              </Link>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
