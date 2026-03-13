"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-sm text-zinc-500">Checking session...</p>;
  }

  if (session?.user) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          onClick={() => signOut({ callbackUrl: "/" })}
          type="button"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        type="button"
      >
        Continue with Google
      </button>
      <button
        className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-900"
        onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
        type="button"
      >
        Email sign in
      </button>
    </div>
  );
}
