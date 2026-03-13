import { redirect } from "next/navigation";

import { LoginButtons } from "@/components/auth-buttons";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Login | CreatorsGlobe",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.hasCreatorProfile) {
    redirect("/dashboard");
  }

  if (session?.user && !session.user.hasCreatorProfile) {
    redirect("/onboarding");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-6 py-16">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-10 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-700">
          Producer Discovery
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
          Sign in to discover and showcase creative talent.
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600">
          Use Google for a fast start, or choose email magic-link login for a
          passwordless workflow.
        </p>
        <div className="mt-8">
          <LoginButtons />
        </div>
      </div>
    </main>
  );
}
