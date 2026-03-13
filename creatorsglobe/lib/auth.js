import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          creatorProfile: {
            select: {
              id: true,
            },
          },
        },
      });

      if (session.user) {
        session.user.id = user.id;
        session.user.hasCreatorProfile = Boolean(dbUser?.creatorProfile);
        session.user.creatorProfileId = dbUser?.creatorProfile?.id ?? null;
      }

      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}
