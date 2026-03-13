import { redirect } from "next/navigation";

import OnboardingForm from "@/components/onboarding-form";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Onboarding | CreatorsGlobe",
};

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.hasCreatorProfile) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f1df_0%,#f5efe6_45%,#fffdf9_100%)] px-6 py-12">
      <section className="mx-auto w-full max-w-5xl rounded-[2.5rem] bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-700">
            Creator Onboarding
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Build the profile producers will discover on the map.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Add your role, city, location pin, portfolio images, availability,
            experience, and budget range. Once saved, you will be redirected to
            your dashboard.
          </p>
        </div>

        <div className="mt-10">
          <OnboardingForm />
        </div>
      </section>
    </main>
  );
}
