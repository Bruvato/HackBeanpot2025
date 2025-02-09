"use client";
import { useSearchParams } from "next/navigation";
import PlaylistGenerator from "../components/playlist-generator";
import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, DirectionsService, DirectionsRenderer, Libraries } from "@react-google-maps/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { AiOutlineSearch } from "react-icons/ai";

const mapContainerStyle = {
  width: '100%',
  height: '60vh'
};

const center = {
  lat: 42.3601,
  lng: -71.0589
};

const libraries: Libraries = ["places"];

const mapOptions = {
  mapTypeId: 'satellite',
  tilt: 45,
  heading: 0,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  zoomControl: true,
  scrollwheel: true,
  zoom: 18,
  minZoom: 3,
  maxZoom: 20,
  mapTypeControlOptions: {
    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'],
  }
};

interface RouteInfo {
  distance: string;
  duration: string;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [startInput, setStartInput] = useState(searchParams.get("start") || "");
  const [destinationInput, setDestinationInput] = useState(searchParams.get("destination") || "");
  const [start, setStart] = useState(searchParams.get("start") || "Unknown Start");
  const [destination, setDestination] = useState(searchParams.get("destination") || "Unknown Destination");
  const date = searchParams.get("date") || "Not Specified";

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.setMapTypeId('satellite');
    map.setTilt(45);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map | null) {
    setMap(null);
  }, []);

  const handleUpdateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setStart(startInput);
    setDestination(destinationInput);
  };

  useEffect(() => {
    if (isLoaded && start !== "Unknown Start" && destination !== "Unknown Destination") {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: start,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            setError(null);

            // Extract route information
            if (result.routes[0] && result.routes[0].legs[0]) {
              const leg = result.routes[0].legs[0];
              if (leg.distance && leg.duration) {
                setRouteInfo({
                  distance: leg.distance.text,
                  duration: leg.duration.text,
                });
              }
            }

            // Adjust the map view to show the route
            if (map && result.routes[0]) {
              const bounds = new google.maps.LatLngBounds();
              result.routes[0].legs.forEach(leg => {
                leg.steps.forEach(step => {
                  bounds.extend(step.start_location);
                  bounds.extend(step.end_location);
                });
              });
              map.fitBounds(bounds);
            }
          } else {
            setError("Could not find directions between these locations");
            setRouteInfo(null);
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, start, destination, map]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
    throw new Error("Missing GOOGLE_MAPS_API_KEY");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Road Trip</h1>
          
          <form onSubmit={handleUpdateRoute} className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Starting Point</label>
                <Input
                  type="text"
                  placeholder="Choose starting point..."
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <Input
                  type="text"
                  placeholder="Choose destination..."
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <AiOutlineSearch className="mr-2 h-4 w-4" /> Update Route
              </Button>
            </div>
          </form>

          <div className="space-y-2">
            <p className="text-gray-600">From: <span className="font-medium text-gray-900">{start}</span></p>
            <p className="text-gray-600">To: <span className="font-medium text-gray-900">{destination}</span></p>
            <p className="text-gray-600">Date: <span className="font-medium text-gray-900">{date}</span></p>
            {routeInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-800">
                  <span className="font-medium">Distance:</span> {routeInfo.distance}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Estimated Time:</span> {routeInfo.duration}
                </p>
              </div>
            )}
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="w-full relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={18}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        ) : <div>Loading...</div>}
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Create Your Road Trip Playlist</h2>
          <PlaylistGenerator startLocation={start} endLocation={destination} />
        </div>
      </div>
    </div>
  );
}
