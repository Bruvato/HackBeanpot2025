"use client";
import { useSearchParams } from "next/navigation";

import { APIProvider, Map, limitTiltRange } from "@vis.gl/react-google-maps";

import DeckGL from "@deck.gl/react";
import { MapViewState } from "@deck.gl/core";
import { LineLayer } from "@deck.gl/layers";

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
};

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

  const layers = [
    new LineLayer<DataType>({
      id: "line-layer",
      data: "/path/to/data.json",
      getSourcePosition: (d: DataType) => d.from,
      getTargetPosition: (d: DataType) => d.to,
    }),
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Starting Location: {start}</p>
      <p>Destination: {destination}</p>
      <p>Trip Date: {date}</p>

      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          layers={layers}
          controller={true}
          onViewStateChange={limitTiltRange}
        >
          <Map
            style={{ width: "100vw", height: "100vh" }}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          />
        </DeckGL>
      </APIProvider>
    </div>
  );
}
