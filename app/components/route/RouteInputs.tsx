"use client";
import { Input } from "@/app/components/ui/input";
import { Autocomplete } from "@react-google-maps/api";

interface RouteInputsProps {
  startInput: string;
  destinationInput: string;
  avoidHighways: boolean;
  avoidTolls: boolean;
  onStartInputChange: (value: string) => void;
  onDestinationInputChange: (value: string) => void;
  onStartAutocompleteLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  onDestAutocompleteLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  onStartPlaceChanged: () => void;
  onDestPlaceChanged: () => void;
  onAvoidHighwaysChange: (checked: boolean) => void;
  onAvoidTollsChange: (checked: boolean) => void;
}

export default function RouteInputs({
  startInput,
  destinationInput,
  avoidHighways,
  avoidTolls,
  onStartInputChange,
  onDestinationInputChange,
  onStartAutocompleteLoad,
  onDestAutocompleteLoad,
  onStartPlaceChanged,
  onDestPlaceChanged,
  onAvoidHighwaysChange,
  onAvoidTollsChange,
}: RouteInputsProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Starting Point</label>
          <Autocomplete
            onLoad={onStartAutocompleteLoad}
            onPlaceChanged={onStartPlaceChanged}
            options={{ types: ["geocode"] }}
          >
            <Input
              type="text"
              placeholder="Choose starting point..."
              value={startInput}
              onChange={(e) => onStartInputChange(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </Autocomplete>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Destination</label>
          <Autocomplete
            onLoad={onDestAutocompleteLoad}
            onPlaceChanged={onDestPlaceChanged}
            options={{ types: ["geocode"] }}
          >
            <Input
              type="text"
              placeholder="Choose destination..."
              value={destinationInput}
              onChange={(e) => onDestinationInputChange(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </Autocomplete>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <label className="flex items-center space-x-2">
          <Input
            type="checkbox"
            checked={avoidHighways}
            onChange={(e) => onAvoidHighwaysChange(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-muted-foreground">Avoid Highways</span>
        </label>
        <label className="flex items-center space-x-2">
          <Input
            type="checkbox"
            checked={avoidTolls}
            onChange={(e) => onAvoidTollsChange(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-muted-foreground">Avoid Tolls</span>
        </label>
      </div>
    </div>
  );
}
