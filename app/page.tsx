'use client';

import Header from "./components/header";
import Footer from "./components/footer";
import Hero from "./components/hero";
import FeaturedDestinations from "./components/featured-destinations";
import PlaylistGenerator from "./components/playlist-generator";
import AuthProvider from "./components/providers/auth-provider";

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PlaylistGenerator />
            </div>
          </div>
          <FeaturedDestinations />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
