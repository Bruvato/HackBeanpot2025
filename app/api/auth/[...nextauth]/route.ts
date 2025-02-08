import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

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
    }
  }
}

const SPOTIFY_REFRESH_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = "9e741abf5077461aa44431a2a2388d68";
const CLIENT_SECRET = "89ae1e294ea6414aadc3e04b32e9e633";

const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-email",
  "user-read-private",
].join(" ");

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const response = await fetch(SPOTIFY_REFRESH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      authorization: {
        params: {
          scope: scopes,
          show_dialog: true  // Force re-consent
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: any }) {
      // Initial sign in
      if (account) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.error = token.error;
        
        // Add user information to the session
        if (session.user) {
          session.user.accessToken = token.accessToken;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  debug: true,  // Enable debug messages
  secret: "89ae1e294ea6414aadc3e04b32e9e633", // Add NextAuth secret
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };