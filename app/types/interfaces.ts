export interface RouteInfo {
  distance: string;
  duration: string;
  index: number;
}

export interface Location {
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

export interface ExtendedPlaceResult extends google.maps.places.PlaceResult {
  editorial_summary?: {
    overview: string;
  };
}
