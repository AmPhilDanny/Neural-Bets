import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Generate a new session ID to enforce single-device login
        const newSessionId = crypto.randomUUID();

        // Update user's active session ID
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            activeSessionId: newSessionId,
            lastLoginAt: new Date()
          }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier,
          sessionId: newSessionId
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tier = user.tier;
        token.sessionId = user.sessionId;
      }

      // Single-device login check on every JWT resolution
      // To prevent hammering DB on every API call, we could add a short cache,
      // but for absolute security, we check the DB session ID.
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { activeSessionId: true, tier: true }
        });

        if (!dbUser || dbUser.activeSessionId !== token.sessionId) {
          // If the session ID changed in DB (they logged in elsewhere), invalidate token
          throw new Error("Session terminated: Account accessed from another device.");
        }
        
        // Always sync the latest tier status from DB
        token.tier = dbUser.tier;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.tier = token.tier as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
