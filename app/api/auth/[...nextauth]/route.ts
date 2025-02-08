import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-email",
  "user-read-private",
].join(" ");

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: "9e741abf5077461aa44431a2a2388d68",
      clientSecret: "89ae1e294ea6414aadc3e04b32e9e633",
      authorization: {
        params: { 
          scope: scopes,
          redirect_uri: "http://localhost:3000/api/auth/callback/spotify"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session(params: { session: Session; token: JWT }) {
      params.session.accessToken = params.token.accessToken;
      return params.session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
