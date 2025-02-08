"use client";

import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Hero() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., redirect to search results page)
    console.log("Searching for:", { destination, startDate, endDate });
  };

  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          Plan Your Perfect Road Trip Adventure
        </h1>
        <p className="text-xl mb-8 text-center">
          Discover amazing routes, attractions, and create unforgettable
          memories
        </p>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
              <Input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
              <Input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
              <Input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="text-center">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <AiOutlineSearch className="mr-2 h-4 w-4" /> Search Routes
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
