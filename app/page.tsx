"use client";

import Header from "./components/header";
import Footer from "./components/footer";
import Hero from "./components/hero";
import Features from "./components/features";
import FeaturedDestinations from "./components/featured-destinations";
import PlaylistGenerator from "./components/playlist-generator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PlaylistGenerator />
        <Features />
        <FeaturedDestinations />
      </main>
      <Footer />
    </div>
  );
}
