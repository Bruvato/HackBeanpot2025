"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

import { AiOutlineSearch } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs"; // Added calendar icon import

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

// Add custom type for lily pad styles
interface LilyPadStyle extends React.CSSProperties {
  "--delay": string;
  "--rotate": string;
}

export default function Hero() {
  // const [start, setStart] = useState("");
  // const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter(); // Initialize useRouter

  const startRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
    throw new Error("Missing GOOGLE_MAPS_API_KEY");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Set default date to today if none is provided

    const start = startRef.current?.value || "";
    const destination = destinationRef.current?.value || "";

    const today = new Date().toISOString().split("T")[0];
    const tripDate = date || today;

    router.push(
      `/dashboard?start=${encodeURIComponent(
        start
      )}&destination=${encodeURIComponent(
        destination
      )}&date=${encodeURIComponent(tripDate)}`
    );
  };

  return (
    <section className="hero-section bg-gradient-to-r from-blue-400 to-green-400 py-20 relative overflow-hidden">
      {/* Frog Family */}
      <div className="absolute top-1/2 -right-20 transform -translate-y-1/2 text-[300px] rotate-[-10deg] opacity-20 pointer-events-none hero-frog">
        🐸
      </div>
      <div className="absolute top-1/3 -right-10 transform -translate-y-1/2 text-[150px] rotate-[5deg] opacity-20 pointer-events-none hero-frog">
        🐸
      </div>
      <div className="absolute top-2/3 -right-5 transform -translate-y-1/2 text-[100px] rotate-[-5deg] opacity-20 pointer-events-none hero-frog">
        🐸
      </div>

      {/* Floating Lily Pads and Flies */}
      <div
        className="absolute top-10 left-10 text-6xl floating-lily pointer-events-none"
        style={{ "--delay": "0s", "--rotate": "12deg" } as LilyPadStyle}
      >
        🌿
      </div>
      <div
        className="absolute bottom-10 right-20 text-6xl floating-lily pointer-events-none"
        style={{ "--delay": "0.5s", "--rotate": "-12deg" } as LilyPadStyle}
      >
        🌿
      </div>
      <div
        className="absolute top-20 right-40 text-4xl floating-lily pointer-events-none"
        style={{ "--delay": "1s", "--rotate": "45deg" } as LilyPadStyle}
      >
        🌿
      </div>
      <div
        className="absolute bottom-20 left-40 text-5xl floating-lily pointer-events-none"
        style={{ "--delay": "1.5s", "--rotate": "-45deg" } as LilyPadStyle}
      >
        🌿
      </div>
      <div
        className="absolute top-40 left-[20%] text-5xl floating-lily pointer-events-none"
        style={{ "--delay": "2s", "--rotate": "30deg" } as LilyPadStyle}
      >
        🌿
      </div>
      <div
        className="absolute bottom-40 right-[30%] text-4xl floating-lily pointer-events-none"
        style={{ "--delay": "2.5s", "--rotate": "-30deg" } as LilyPadStyle}
      >
        🌿
      </div>

      {/* Flying Insects */}
      <div
        className="absolute top-20 left-[30%] text-2xl floating-lily pointer-events-none"
        style={{ "--delay": "1.2s", "--rotate": "180deg" } as LilyPadStyle}
      >
        🪰
      </div>
      <div
        className="absolute bottom-30 right-[40%] text-2xl floating-lily pointer-events-none"
        style={{ "--delay": "2.1s", "--rotate": "90deg" } as LilyPadStyle}
      >
        🪰
      </div>
      <div
        className="absolute top-40 right-[20%] text-2xl floating-lily pointer-events-none"
        style={{ "--delay": "0.8s", "--rotate": "270deg" } as LilyPadStyle}
      >
        🪰
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold ml-4 text-center text-white dark:text-gray-200 drop-shadow-lg">
            Plan Your Perfect Road Trip Adventure
          </h1>
        </div>
        <p className="text-xl mb-12 text-center text-white dark:text-gray-300 drop-shadow-md">
          Discover amazing routes, attractions, and create unforgettable
          memories
          <span className="inline-block ml-2 transform hover:scale-125 transition-transform">
            🦗
          </span>
        </p>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto space-y-6 backdrop-blur-lg bg-white/10 p-8 rounded-2xl border-2 border-white/20"
        >
          <div className="space-y-4">
            {isLoaded && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Autocomplete>
                    <input
                      ref={startRef}
                      type="text"
                      placeholder="🌿Start point..."
                      className="w-full px-4 py-3 text-lg"
                      required
                    />
                  </Autocomplete>
                </div>
                <div className="relative">
                  <Autocomplete>
                    <input
                      ref={destinationRef}
                      type="text"
                      placeholder="🌊Destination Pond..."
                      className="w-full px-4 py-3 text-lg"
                      required
                    />
                  </Autocomplete>
                </div>
              </div>
            )}
            <div className="relative w-full">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 text-lg appearance-none bg-white"
                min={new Date().toISOString().split("T")[0]}
                style={{ colorScheme: "light" }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg pointer-events-none">
                <BsCalendarDate className="w-6 h-6 text-primary opacity-70" />
              </div>
            </div>
            <button
              type="submit"
              className="froggy-button w-full text-lg font-semibold hover:scale-105 transition-transform"
            >
              Search Routes! 🐸
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
