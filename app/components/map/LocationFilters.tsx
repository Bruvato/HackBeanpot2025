"use client";
import { Input } from "@/app/components/ui/input";

interface LocationType {
  value: string;
  label: string;
  color: string;
}

interface LocationFiltersProps {
  locationTypes: LocationType[];
  selectedTypes: string[];
  onTypeToggle: (type: string, checked: boolean) => void;
}

export default function LocationFilters({
  locationTypes,
  selectedTypes,
  onTypeToggle,
}: LocationFiltersProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Show Places:
      </h3>
      <div className="flex flex-col gap-2">
        {locationTypes.map((type) => (
          <label key={type.value} className="inline-flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: type.color }}
            />
            <Input
              type="checkbox"
              checked={selectedTypes.includes(type.value)}
              onChange={(e) => onTypeToggle(type.value, e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              {type.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
