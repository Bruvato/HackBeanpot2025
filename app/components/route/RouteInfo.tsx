"use client";
import { RouteInfo as RouteInfoType } from "@/app/types/interfaces";

interface RouteInfoProps {
  routeInfos: RouteInfoType[];
  selectedRouteIndex: number;
  onRouteSelect: (index: number) => void;
}

export default function RouteInfo({
  routeInfos,
  selectedRouteIndex,
  onRouteSelect,
}: RouteInfoProps) {
  if (routeInfos.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-semibold">Available Routes:</h3>
      {routeInfos.map((info, index) => (
        <div
          key={index}
          onClick={() => onRouteSelect(index)}
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
            <span className="font-medium text-gray-900">{info.distance}</span>
            <span className="mx-2">•</span>
            <span className="text-gray-600">Duration: </span>
            <span className="font-medium text-gray-900">{info.duration}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
