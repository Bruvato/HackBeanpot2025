"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PlaylistGenerator from "../components/playlist-generator";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const start = searchParams.get("start") || "Unknown Start";
  const destination = searchParams.get("destination") || "Unknown Destination";
  const date = searchParams.get("date") || "Not Specified";

  return (      
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Starting Location: {start}</p>
      <p>Destination: {destination}</p>
      <p>Trip Date: {date}</p>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Create Your Road Trip Playlist</h2>
        <PlaylistGenerator startLocation={start} endLocation={destination} />
      </div>
    </div>
  );
}
