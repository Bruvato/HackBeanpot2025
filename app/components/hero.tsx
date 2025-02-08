"use client";

import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Hero() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., redirect to search results page)
    console.log("Searching for:", { start, destination });
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
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
              <Input
                type="text"
                placeholder="Choose starting point..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
              <Input
                type="text"
                placeholder="Choose destination..."
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
              <Input
                type="date"
                placeholder="Pick date..."
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
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
