"use client";
import { InfoWindow } from "@react-google-maps/api";
import { Location } from "@/app/types/interfaces";

interface LocationInfoWindowProps {
  location: Location;
  onClose: () => void;
}

export function LocationInfoWindow({ location, onClose }: LocationInfoWindowProps) {
  return (
    <InfoWindow position={location.position} onCloseClick={onClose}>
      <div className="max-w-sm p-2 text-gray-700">
        <h3 className="text-lg font-semibold mb-2">{location.name}</h3>

        {location.photos && location.photos.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {location.photos.map((photoUrl, i) => (
              <img
                key={i}
                src={photoUrl}
                alt={`${location.name} photo ${i + 1}`}
                className="h-32 w-auto object-cover rounded"
                width={400}
                height={300}
              />
            ))}
          </div>
        )}

        {location.description && (
          <p className="text-sm text-gray-600 mb-2">{location.description}</p>
        )}

        {location.address && (
          <p className="text-sm text-gray-500 mb-2">📍 {location.address}</p>
        )}

        {location.rating && (
          <p className="text-sm font-medium">Rating: {location.rating} ⭐</p>
        )}
      </div>
    </InfoWindow>
  );
}
