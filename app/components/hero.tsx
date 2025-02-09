"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

import { AiOutlineSearch } from "react-icons/ai";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

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
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-white dark:text-gray-200">
          Plan Your Perfect Road Trip Adventure
        </h1>
        <p className="text-xl mb-8 text-center text-white dark:text-gray-300">
          Discover amazing routes, attractions, and create unforgettable
          memories
        </p>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-background rounded-lg shadow-md p-6"
        >
          {isLoaded && (
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                <Autocomplete>
                  <Input
                    type="text"
                    placeholder="Choose starting point..."
                    // value={start}
                    // onChange={(e) => setStart(e.target.value)}
                    ref={startRef}
                    required
                    className="w-full"
                  />
                </Autocomplete>
              </div>
              <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                <Autocomplete>
                  <Input
                    type="text"
                    placeholder="Choose destination..."
                    // value={destination}
                    // onChange={(e) => setDestination(e.target.value)}
                    ref={destinationRef}
                    required
                    className="w-full"
                  />
                </Autocomplete>
              </div>
              <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                <Input
                  type="date"
                  placeholder="Pick date..."
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <div className="text-center">
            <Button type="submit">
              <AiOutlineSearch className="mr-2 h-4 w-4" /> Search Routes
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
