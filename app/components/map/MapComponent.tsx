"use client";
import { GoogleMap, DirectionsRenderer, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { LocationInfoWindow } from "./LocationInfoWindow";
import { Location } from "@/app/types/interfaces";

const mapContainerStyle = {
  width: "100%",
  height: "60vh",
};

const center = {
  lat: 42.3601,
  lng: -71.0589,
};

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

interface MapComponentProps {
  isLoaded: boolean;
  directions: google.maps.DirectionsResult | null;
  locations: Location[];
  selectedRouteIndex: number;
  locationTypes: Array<{ value: string; label: string; color: string }>;
  onMapLoad: (map: google.maps.Map) => void;
  onMapUnmount: (map: google.maps.Map | null) => void;
  isLoadingLocations?: boolean;
}

export default function MapComponent({
  isLoaded,
  directions,
  locations,
  selectedRouteIndex,
  locationTypes,
  onMapLoad,
  onMapUnmount,
  isLoadingLocations = false,
}: MapComponentProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setMapTypeId("roadmap");
    map.setZoom(12);
    onMapLoad(map);
  }, [onMapLoad]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="w-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onMapUnmount}
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
                    strokeColor: index === selectedRouteIndex ? "#4285F4" : "#45B6FE",
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

        {!isLoadingLocations && locations.map((location, index) => {
          const locationType = locationTypes.find((t) => t.value === location.type);
          return (
            <Marker
              key={`location-${location.placeId}-${index}`}
              position={location.position}
              title={location.name}
              icon={{
                url: `http://maps.google.com/mapfiles/ms/icons/${locationType?.color || "red"}-dot.png`,
                scaledSize: new google.maps.Size(32, 32),
              }}
              onClick={() => setSelectedLocation(location)}
            />
          );
        })}

        {selectedLocation && (
          <LocationInfoWindow
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </GoogleMap>
      {isLoadingLocations && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md">
          Loading places...
        </div>
      )}
    </div>
  );
}
