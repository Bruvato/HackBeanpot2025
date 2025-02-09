"use client";
import { useSearchParams } from "next/navigation";
import PlaylistGenerator from "../components/playlist-generator";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  DirectionsService,
  DirectionsRenderer,
  Libraries,
  Autocomplete,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Input } from "../components/ui/input";
import Header from "../components/header";
import Footer from "../components/footer";

const mapContainerStyle = {
  width: "100%",
  height: "60vh",
};

const center = {
  lat: 42.3601,
  lng: -71.0589,
};

const libraries: Libraries = ["places"];

const mapOptions = {
  mapTypeId: "roadmap",
  tilt: 45,
  heading: 0,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  zoomControl: true,
  scrollwheel: true,
  zoom: 12,
  minZoom: 3,
  maxZoom: 20,
  mapTypeControlOptions: {
    mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"],
  },
};

interface RouteInfo {
  distance: string;
  duration: string;
  index: number;
}

interface Location {
  name: string;
  position: google.maps.LatLng;
  rating?: number;
  type: string;
  placeId: string;
  photos?: string[];
  description?: string;
  address?: string;
  isInfoOpen?: boolean;
}

interface ExtendedPlaceResult extends google.maps.places.PlaceResult {
  editorial_summary?: {
    overview: string;
  };
}

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
  const [routeInfos, setRouteInfos] = useState<RouteInfo[]>([]);
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
  ]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const destAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const locationTypes = [
    {
      value: "tourist_attraction",
      label: "Tourist Attractions",
      color: "yellow",
    },
    { value: "restaurant", label: "Restaurants", color: "red" },
    { value: "park", label: "Parks", color: "green" },
    { value: "museum", label: "Museums", color: "purple" },
    { value: "shopping_mall", label: "Shopping", color: "blue" },
  ];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.setMapTypeId("roadmap");
    map.setZoom(12);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map | null) {
    setMap(null);
  }, []);

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

  const getPlaceDetails = async (
    placeId: string,
    placesService: google.maps.places.PlacesService
  ) => {
    return new Promise<Partial<Location>>((resolve, reject) => {
      placesService.getDetails(
        {
          placeId: placeId,
          fields: [
            "formatted_address",
            "photos",
            "editorial_summary",
            "rating",
            "reviews",
          ],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const photos = place.photos
              ?.slice(0, 3)
              .map((photo) => photo.getUrl({ maxWidth: 400, maxHeight: 300 }));
            resolve({
              photos,
              description:
                (place as ExtendedPlaceResult).editorial_summary?.overview ||
                place.reviews?.[0]?.text?.slice(0, 150) + "..." ||
                "No description available",
              address: place.formatted_address,
              rating: place.rating,
            });
          } else {
            reject(status);
          }
        }
      );
    });
  };

  const findLocations = useCallback(
    async (route: google.maps.DirectionsRoute) => {
      if (!map) return;

      // Clear existing timeout if any
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      // Clear existing locations immediately
      setLocations([]);
      setIsLoadingLocations(true);

      searchDebounceRef.current = setTimeout(async () => {
        const placesService = new google.maps.places.PlacesService(map);
        const newLocations: Location[] = [];

        // Get strategic points along the route
        const searchPoints: google.maps.LatLng[] = [];
        route.legs.forEach((leg) => {
          // Always include start and end of each leg
          searchPoints.push(leg.start_location);
          searchPoints.push(leg.end_location);

          leg.steps.forEach((step, stepIndex) => {
            // For longer steps, add intermediate points
            if (step.distance && step.distance.value > 1000) {
              // If step is longer than 1km
              if (step.path && step.path.length > 2) {
                // Add a point from the middle of the path
                const midIndex = Math.floor(step.path.length / 2);
                searchPoints.push(step.path[midIndex]);
              }
            }

            // Add points at major turns or route changes
            if (stepIndex > 0) {
              const prevStep = leg.steps[stepIndex - 1];
              const angle = google.maps.geometry.spherical.computeHeading(
                prevStep.end_location,
                step.start_location
              );
              if (Math.abs(angle) > 30) {
                // If turn is greater than 30 degrees
                searchPoints.push(step.start_location);
              }
            }
          });
        });

        // Use a Map to efficiently track covered areas
        const coveredAreas = new Map<string, boolean>();
        const gridSize = 1000; // 1km grid

        const getGridKey = (lat: number, lng: number) => {
          return `${Math.floor(lat * gridSize) / gridSize},${
            Math.floor(lng * gridSize) / gridSize
          }`;
        };

        const filteredPoints = searchPoints.filter((point) => {
          const key = getGridKey(point.lat(), point.lng());
          if (coveredAreas.has(key)) {
            return false;
          }
          coveredAreas.set(key, true);
          return true;
        });

        const searchPromises: Promise<void>[] = [];
        const processedPlaces = new Set<string>(); // Track processed place IDs

        for (const point of filteredPoints) {
          for (const type of selectedTypes) {
            const searchPromise = (async () => {
              const request = {
                location: point,
                radius: 1500, // Reduced radius since we have better point distribution
                type: type,
              };

              try {
                const results = await new Promise<
                  google.maps.places.PlaceResult[]
                >((resolve, reject) => {
                  placesService.nearbySearch(request, (results, status) => {
                    if (
                      status === google.maps.places.PlacesServiceStatus.OK &&
                      results
                    ) {
                      resolve(results);
                    } else {
                      reject(status);
                    }
                  });
                });

                // Process only the top 5 results per point
                for (const place of results.slice(0, 5)) {
                  if (
                    place.geometry?.location &&
                    place.name &&
                    place.place_id &&
                    !processedPlaces.has(place.place_id)
                  ) {
                    processedPlaces.add(place.place_id);
                    try {
                      const details = await getPlaceDetails(
                        place.place_id,
                        placesService
                      );
                      newLocations.push({
                        name: place.name,
                        position: place.geometry.location,
                        placeId: place.place_id,
                        type: type,
                        ...details,
                      });
                    } catch (error) {
                      console.error("Error fetching place details:", error);
                    }
                  }
                }
              } catch (error) {
                console.error("Error searching for places:", error);
              }
            })();
            searchPromises.push(searchPromise);
          }
        }

        await Promise.all(searchPromises);
        setLocations(newLocations);
        setIsLoadingLocations(false);
      }, 300);
    },
    [map, selectedTypes]
  );

  useEffect(() => {
    // Cleanup function to clear timeout
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (directions?.routes[selectedRouteIndex]) {
      findLocations(directions.routes[selectedRouteIndex]);
    } else {
      setLocations([]);
    }
  }, [directions, selectedRouteIndex, selectedTypes, findLocations]);

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

            // Extract route information for all routes
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

            // Adjust the map view to show the route
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

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
    throw new Error("Missing GOOGLE_MAPS_API_KEY");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Your Road Trip</h1>

          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Starting Point
                </label>
                <Autocomplete
                  onLoad={onStartAutocompleteLoad}
                  onPlaceChanged={onStartPlaceChanged}
                  options={{ types: ["geocode"] }}
                >
                  <input
                    type="text"
                    placeholder="Choose starting point..."
                    value={startInput}
                    onChange={(e) => setStartInput(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </Autocomplete>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Destination
                </label>
                <Autocomplete
                  onLoad={onDestAutocompleteLoad}
                  onPlaceChanged={onDestPlaceChanged}
                  options={{ types: ["geocode"] }}
                >
                  <input
                    type="text"
                    placeholder="Choose destination..."
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </Autocomplete>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={avoidHighways}
                  onChange={(e) => setAvoidHighways(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-muted-foreground">Avoid Highways</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={avoidTolls}
                  onChange={(e) => setAvoidTolls(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-muted-foreground">Avoid Tolls</span>
              </label>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Show Places:
              </h3>
              <div className="flex flex-wrap gap-2">
                {locationTypes.map((type) => (
                  <label key={type.value} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.value)}
                      onChange={(e) => {
                        setSelectedTypes((prev) =>
                          e.target.checked
                            ? [...prev, type.value]
                            : prev.filter((t) => t !== type.value)
                        );
                      }}
                      className="form-checkbox h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <p className="">
              From: <span className="font-medium">{start}</span>
            </p>
            <p className="">
              To: <span className="font-medium">{destination}</span>
            </p>
            <p className="">
              Date: <span className="font-medium">{date}</span>
            </p>

            {routeInfos.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold ">Available Routes:</h3>
                {routeInfos.map((info, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedRouteIndex(index)}
                    className={`p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-blue-50
                      ${
                        index === selectedRouteIndex
                          ? "bg-blue-100 border-l-4 border-blue-500 shadow-sm"
                          : "bg-gray-50 border-l-4 border-gray-300"
                      }`}
                  >
                    <p className="font-medium text-gray-900">
                      Route {index + 1} {index === 0 && "(Fastest)"}
                    </p>
                    <div className="mt-1 text-sm">
                      <span className="text-gray-600">Distance: </span>
                      <span className="font-medium text-gray-900">
                        {info.distance}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-600">Duration: </span>
                      <span className="font-medium text-gray-900">
                        {info.duration}
                      </span>
                    </div>
                  </div>
                ))}
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
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
          >
            {directions && (
              <>
                {directions.routes.map((route, index) => (
                  <DirectionsRenderer
                    key={index}
                    directions={{
                      ...directions,
                      routes: [route],
                    }}
                    options={{
                      polylineOptions: {
                        strokeColor:
                          index === selectedRouteIndex ? "#4285F4" : "#45B6FE",
                        strokeWeight: index === selectedRouteIndex ? 5 : 3,
                        strokeOpacity: index === selectedRouteIndex ? 1 : 0.6,
                      },
                      suppressMarkers: false,
                      preserveViewport: true,
                    }}
                  />
                ))}
              </>
            )}

            {locations.map((location, index) => {
              const locationType = locationTypes.find(
                (t) => t.value === location.type
              );
              return (
                <Marker
                  key={`location-${index}`}
                  position={location.position}
                  title={location.name}
                  icon={{
                    url: `http://maps.google.com/mapfiles/ms/icons/${
                      locationType?.color || "red"
                    }-dot.png`,
                    scaledSize: new google.maps.Size(32, 32),
                  }}
                  onClick={() => setSelectedLocation(location)}
                />
              );
            })}

            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.position}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div className="max-w-sm p-2 text-gray-700">
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedLocation.name}
                  </h3>

                  {selectedLocation.photos &&
                    selectedLocation.photos.length > 0 && (
                      <div className="flex gap-2 mb-3 overflow-x-auto">
                        {selectedLocation.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`${selectedLocation.name} photo ${i + 1}`}
                            className="h-32 w-auto object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                  {selectedLocation.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedLocation.description}
                    </p>
                  )}

                  {selectedLocation.address && (
                    <p className="text-sm text-gray-500 mb-2">
                      📍 {selectedLocation.address}
                    </p>
                  )}

                  {selectedLocation.rating && (
                    <p className="text-sm font-medium">
                      Rating: {selectedLocation.rating} ⭐
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Create Your Road Trip Playlist
          </h2>
          <PlaylistGenerator startLocation={start} endLocation={destination} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
