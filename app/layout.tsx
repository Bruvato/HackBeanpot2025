import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "./components/theme-provider";
import AuthProvider from "./components/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoadTrippr - Plan Your Perfect Road Trip",
  description:
    "Discover amazing routes, attractions, and create unforgettable memories with RoadTrippr.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
