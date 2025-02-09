"use client";

import { useState, useEffect } from "react";

const PackingList = ({
  startLocation,
  endLocation,
}: {
  startLocation: string;
  endLocation: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const generateList = async () => {
    if (
      !startLocation ||
      !endLocation ||
      startLocation === "Unknown Start" ||
      endLocation === "Unknown Destination"
    ) {
      setError("Please enter both start and destination locations");
      return;
    }

    setLoading(true);
    setError(null);
    setSource(null);
    try {
      console.log("Sending request to API...");
      const response = await fetch("/api/packing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startLocation, endLocation }),
      });

      console.log("Got response:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate packing list");
      }

      if (data.items && Array.isArray(data.items)) {
        console.log("Setting items:", data.items);
        setItems(data.items);
        setSource(data.source || null);
      } else {
        console.error("Invalid items format:", data);
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error in generateList:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate packing list"
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate list when locations change and are valid
  useEffect(() => {
    if (
      startLocation &&
      endLocation &&
      startLocation !== "Unknown Start" &&
      endLocation !== "Unknown Destination"
    ) {
      generateList();
    } else {
      setItems([]);
      setError(null);
      setSource(null);
    }
  }, [startLocation, endLocation]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Packing List</h2>
        <button
          onClick={generateList}
          disabled={
            loading ||
            !startLocation ||
            !endLocation ||
            startLocation === "Unknown Start" ||
            endLocation === "Unknown Destination"
          }
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Refresh List"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Generating your packing list...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="mt-4">
          {source === "fallback" && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded">
              Using default packing list. Please check if the Gemini API key is
              configured correctly.
            </div>
          )}
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-4">
          {!startLocation ||
          !endLocation ||
          startLocation === "Unknown Start" ||
          endLocation === "Unknown Destination"
            ? "Enter your trip locations to generate a packing list"
            : "No items in the packing list yet"}
        </div>
      )}
    </div>
  );
};

export default PackingList;
