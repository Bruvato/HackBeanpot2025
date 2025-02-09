"use client";
import { useSearchParams } from "next/navigation";
import PlaylistGenerator from "../components/playlist-generator";

import { APIProvider, Map, limitTiltRange } from "@vis.gl/react-google-maps";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

type DataType = {
  from: [longitude: number, latitude: number];
  to: [longitude: number, latitude: number];
};

export default function Dashboard() {
  const searchParams = useSearchParams();
  const start = searchParams.get("start") || "Unknown Start";
  const destination = searchParams.get("destination") || "Unknown Destination";
  const date = searchParams.get("date") || "Not Specified";

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
    throw new Error("Missing GOOGLE_MAPS_API_KEY");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Starting Location: {start}</p>
      <p>Destination: {destination}</p>
      <p>Trip Date: {date}</p>
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Create Your Road Trip Playlist
        </h2>
        <PlaylistGenerator startLocation={start} endLocation={destination} />
      </div>
    </div>
  );
}
