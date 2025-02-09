import NextAuth from "next-auth";
import { authOptions } from "@/app/components/lib/auth";

// Extend the built-in types for NextAuth
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
    };
  }
}

// Validate required environment variables
if (!process.env.SPOTIFY_CLIENT_ID)
  throw new Error("Missing SPOTIFY_CLIENT_ID");
if (!process.env.SPOTIFY_CLIENT_SECRET)
  throw new Error("Missing SPOTIFY_CLIENT_SECRET");
if (!process.env.NEXTAUTH_SECRET) throw new Error("Missing NEXTAUTH_SECRET");

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
