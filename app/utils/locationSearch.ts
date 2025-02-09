import { Location } from "../types/interfaces";

interface ExtendedPlaceResult extends google.maps.places.PlaceResult {
  editorial_summary?: {
    overview: string;
  };
}

export const getPlaceDetails = async (
  placeId: string,
  service: google.maps.places.PlacesService
): Promise<{
  rating?: number;
  photos?: string[];
  description?: string;
  address?: string;
}> => {
  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId: placeId,
        fields: ["rating", "photos", "editorial_summary", "formatted_address"],
      },
      (place: ExtendedPlaceResult | null, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const details: {
            rating?: number;
            photos?: string[];
            description?: string;
            address?: string;
          } = {};

          if (place.rating) {
            details.rating = place.rating;
          }

          if (place.photos) {
            details.photos = place.photos
              .slice(0, 3)
              .map((photo) => photo.getUrl({ maxWidth: 400, maxHeight: 300 }));
          }

          if (
            place.editorial_summary &&
            'overview' in place.editorial_summary &&
            place.editorial_summary.overview
          ) {
            details.description = (place.editorial_summary as any)?.overview;
          }

          if (place.formatted_address) {
            details.address = place.formatted_address;
          }

          resolve(details);
        } else {
          reject(status);
        }
      }
    );
  });
};

export const findLocationsAlongRoute = async (
  route: google.maps.DirectionsRoute,
  map: google.maps.Map,
  selectedTypes: string[],
  setLocations: (locations: Location[]) => void,
  setIsLoadingLocations: (loading: boolean) => void
): Promise<void> => {
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
          const results = await new Promise<google.maps.places.PlaceResult[]>(
            (resolve, reject) => {
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
            }
          );

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
};
