"use client";
import { useSearchParams } from "next/navigation";
import PlaylistGenerator from "../components/playlist-generator";
import RoadTripBingo from "../components/bingo";
import WeatherDisplay from "../components/weather-display";
import PackingList from "../components/packing-list";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Libraries } from "@googlemaps/js-api-loader";
import Header from "../components/header";
import Footer from "../components/footer";
import MapComponent from "../components/map/MapComponent";
import RouteInputs from "../components/route/RouteInputs";
import RouteInfo from "../components/route/RouteInfo";
import LocationFilters from "../components/map/LocationFilters";
import { Location, RouteInfo as RouteInfoType } from "../types/interfaces";
import { findLocationsAlongRoute } from "../utils/locationSearch";

const libraries: Libraries = ["places", "geometry"];

const locationTypes = [
  { value: "restaurant", label: "Restaurants", color: "red" },
  { value: "tourist_attraction", label: "Tourist Attractions", color: "green" },
  { value: "park", label: "Parks", color: "purple" },
  { value: "museum", label: "Museums", color: "yellow" },
  { value: "shopping_mall", label: "Shopping", color: "pink" },
  { value: "lodging", label: "Hotels", color: "orange" },
  { value: "gas_station", label: "Gas Stations", color: "blue" },
];

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [startInput, setStartInput] = useState(searchParams.get("start") || "");
  const [destinationInput, setDestinationInput] = useState(
    searchParams.get("destination") || ""
  );
  const [start, setStart] = useState(
    searchParams.get("start") || "Unknown Start"
  );
  const [destination, setDestination] = useState(
    searchParams.get("destination") || "Unknown Destination"
  );
  const date = searchParams.get("date") || "Not Specified";

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [routeInfos, setRouteInfos] = useState<RouteInfoType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([
    "tourist_attraction",
    "restaurant",
    "park",
    "museum",
    "shopping_mall",
    "lodging",
    "gas_station",
  ]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const destAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onStartAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    startAutocompleteRef.current = autocomplete;
  };

  const onDestAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    destAutocompleteRef.current = autocomplete;
  };

  const onStartPlaceChanged = () => {
    if (startAutocompleteRef.current) {
      const place = startAutocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setStartInput(place.formatted_address);
        setStart(place.formatted_address);
      }
    }
  };

  const onDestPlaceChanged = () => {
    if (destAutocompleteRef.current) {
      const place = destAutocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setDestinationInput(place.formatted_address);
        setDestination(place.formatted_address);
      }
    }
  };

  useEffect(() => {
    if (
      isLoaded &&
      start !== "Unknown Start" &&
      destination !== "Unknown Destination"
    ) {
      setError(null);
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: start,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
          optimizeWaypoints: true,
          avoidHighways: avoidHighways,
          avoidTolls: avoidTolls,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            setError(null);

            if (result.routes) {
              const infos = result.routes.map((route, index) => {
                const leg = route.legs[0];
                return {
                  distance: leg.distance?.text || "Unknown",
                  duration: leg.duration?.text || "Unknown",
                  index,
                };
              });
              setRouteInfos(infos);
            }

            if (map && result.routes[0]) {
              const bounds = new google.maps.LatLngBounds();
              result.routes[0].legs.forEach((leg) => {
                bounds.extend(leg.start_location);
                bounds.extend(leg.end_location);
              });
              map.fitBounds(bounds);
            }
          } else {
            let errorMessage =
              "Could not find directions between these locations. ";
            switch (status) {
              case google.maps.DirectionsStatus.NOT_FOUND:
                errorMessage += "One or both locations could not be found.";
                break;
              case google.maps.DirectionsStatus.ZERO_RESULTS:
                errorMessage +=
                  "No route could be found between these locations.";
                break;
              case google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED:
                errorMessage += "Too many waypoints provided.";
                break;
              case google.maps.DirectionsStatus.INVALID_REQUEST:
                errorMessage += "Invalid request. Please check the locations.";
                break;
              case google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
                errorMessage += "Too many requests. Please try again later.";
                break;
              case google.maps.DirectionsStatus.REQUEST_DENIED:
                errorMessage +=
                  "Request was denied. Please check your API key.";
                break;
              case google.maps.DirectionsStatus.UNKNOWN_ERROR:
                errorMessage += "An unknown error occurred. Please try again.";
                break;
              default:
                errorMessage += "Please try different locations.";
            }
            setError(errorMessage);
            setRouteInfos([]);
            console.error(`Error fetching directions:`, status);
          }
        }
      );
    }
  }, [isLoaded, start, destination, map, avoidHighways, avoidTolls]);

  useEffect(() => {
    // Cleanup function to clear timeout
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (map && directions?.routes[selectedRouteIndex]) {
      // Clear existing timeout if any
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      // Clear existing locations immediately
      setLocations([]);
      setIsLoadingLocations(true);

      // Add debounce to prevent too many API calls
      searchDebounceRef.current = setTimeout(async () => {
        await findLocationsAlongRoute(
          directions.routes[selectedRouteIndex],
          map,
          selectedTypes,
          setLocations,
          setIsLoadingLocations
        );
      }, 300);
    } else {
      setLocations([]);
    }
  }, [directions, selectedRouteIndex, selectedTypes, map]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
    throw new Error("Missing GOOGLE_MAPS_API_KEY");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-full mx-auto py-6 px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Road Trip Section */}
          <div className="lg:col-span-4">
            <div className="rounded-lg shadow-sm p-6 h-full bg-card">
              <h1 className="text-2xl font-bold mb-4">Your Road Trip</h1>
              <RouteInputs
                startInput={startInput}
                destinationInput={destinationInput}
                avoidHighways={avoidHighways}
                avoidTolls={avoidTolls}
                onStartInputChange={setStartInput}
                onDestinationInputChange={setDestinationInput}
                onStartAutocompleteLoad={onStartAutocompleteLoad}
                onDestAutocompleteLoad={onDestAutocompleteLoad}
                onStartPlaceChanged={onStartPlaceChanged}
                onDestPlaceChanged={onDestPlaceChanged}
                onAvoidHighwaysChange={setAvoidHighways}
                onAvoidTollsChange={setAvoidTolls}
              />

              <LocationFilters
                locationTypes={locationTypes}
                selectedTypes={selectedTypes}
                onTypeToggle={(type, checked) => {
                  setSelectedTypes((prev) =>
                    checked ? [...prev, type] : prev.filter((t) => t !== type)
                  );
                }}
              />

              <div className="mt-4">
                <p className="">
                  From: <span className="font-medium">{start}</span>
                </p>
                <p className="">
                  To: <span className="font-medium">{destination}</span>
                </p>
                <p className="">
                  Date: <span className="font-medium">{date}</span>
                </p>
              </div>

              <RouteInfo
                routeInfos={routeInfos}
                selectedRouteIndex={selectedRouteIndex}
                onRouteSelect={setSelectedRouteIndex}
              />

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Weather Display */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Starting Point Weather */}
              <div className="rounded-lg shadow-sm p-6 bg-card">
                <h2 className="text-2xl font-semibold mb-4">
                  Starting Point Weather
                </h2>
                {directions?.routes[0]?.legs[0] && (
                  <WeatherDisplay
                    lat={directions.routes[0].legs[0].start_location.lat()}
                    lng={directions.routes[0].legs[0].start_location.lng()}
                    locationName={directions.routes[0].legs[0].start_address}
                  />
                )}
              </div>

              {/* Destination Weather */}
              <div className="rounded-lg shadow-sm p-6 bg-card">
                <h2 className="text-2xl font-semibold mb-4">
                  Destination Weather
                </h2>
                {directions?.routes[0]?.legs[0] && (
                  <WeatherDisplay
                    lat={directions.routes[0].legs[0].end_location.lat()}
                    lng={directions.routes[0].legs[0].end_location.lng()}
                    locationName={directions.routes[0].legs[0].end_address}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Packing List */}
          <div className="lg:col-span-2">
            <div className="rounded-lg shadow-sm p-6 h-full bg-card">
              <h2 className="text-2xl font-semibold mb-4">Packing List</h2>
              <PackingList startLocation={start} endLocation={destination} />
            </div>
          </div>

          {/* Spotify Playlist Generator */}
          <div className="lg:col-span-3">
            <div className="rounded-lg shadow-sm p-6 h-full bg-card">
              <h2 className="text-2xl font-semibold mb-4">
                Road Trip Playlist
              </h2>
              <div className="min-h-[450px]">
                <PlaylistGenerator
                  startLocation={start}
                  endLocation={destination}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map Component */}
        <div className="w-full  mb-6">
          <MapComponent
            isLoaded={isLoaded}
            directions={directions}
            locations={locations}
            selectedRouteIndex={selectedRouteIndex}
            locationTypes={locationTypes}
            onMapLoad={setMap}
            onMapUnmount={() => setMap(null)}
            isLoadingLocations={isLoadingLocations}
          />
        </div>

        {/* Road Trip Bingo */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Road Trip Bingo</h2>
          <RoadTripBingo
            locations={locations}
            startLocation={start}
            endLocation={destination}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
