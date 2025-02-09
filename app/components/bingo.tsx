"use client";

import { useState, useEffect } from "react";

interface BingoSquare {
  text: string;
  isMarked: boolean;
}

interface Location {
  name: string;
  type: string;
  description?: string;
}

interface BingoProps {
  locations: Location[];
  startLocation?: string;
  endLocation?: string;
}

const commonBingoItems = [
  "Red Car",
  "License Plate from Another State",
  "Rest Stop",
  "Gas Station",
  "Police Car",
  "Construction Zone",
  "Semi Truck",
  "Fast Food Sign",
  "Bridge",
  "Billboard",
  "Exit Sign",
  "Speed Limit Sign",
  "Motorcycle",
  "RV or Camper",
  "Train Tracks",
  "Farm",
  "School Bus",
  "Church",
  "American Flag",
  "Lake or River",
];

export default function RoadTripBingo({
  locations,
  startLocation,
  endLocation,
}: BingoProps) {
  const [squares, setSquares] = useState<BingoSquare[]>([]);
  const [hasWon, setHasWon] = useState(false);

  const generateBingoItems = () => {
    // Convert locations to bingo items
    const locationItems = locations.map((loc) => {
      const action = loc.type.includes("restaurant")
        ? "Eat at"
        : loc.type.includes("park")
        ? "Visit"
        : loc.type.includes("museum")
        ? "Explore"
        : "Stop at";
      return `${action} ${loc.name}`;
    });

    // Combine and shuffle all items
    const allItems = [...locationItems, ...commonBingoItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 24); // We need 24 items (25th will be FREE SPACE)

    // Insert FREE SPACE in the middle (index 12)
    const boardItems = [
      ...allItems.slice(0, 12),
      "FREE SPACE",
      ...allItems.slice(12),
    ];

    return boardItems.map((text) => ({
      text,
      isMarked: text === "FREE SPACE",
    }));
  };

  const checkWin = (squares: BingoSquare[]) => {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (
        squares.slice(i * 5, (i + 1) * 5).every((square) => square.isMarked)
      ) {
        return true;
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if (
        squares
          .filter((_, index) => index % 5 === i)
          .every((square) => square.isMarked)
      ) {
        return true;
      }
    }

    // Check diagonals
    const diagonal1 = [0, 6, 12, 18, 24].every(
      (index) => squares[index].isMarked
    );
    const diagonal2 = [4, 8, 12, 16, 20].every(
      (index) => squares[index].isMarked
    );

    return diagonal1 || diagonal2;
  };

  const handleSquareClick = (index: number) => {
    const newSquares = squares.map((square, i) =>
      i === index ? { ...square, isMarked: !square.isMarked } : square
    );
    setSquares(newSquares);
    setHasWon(checkWin(newSquares));
  };

  const resetBoard = () => {
    setSquares(generateBingoItems());
    setHasWon(false);
  };

  useEffect(() => {
    resetBoard();
  }, [locations, startLocation, endLocation]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {hasWon && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center text-lg font-bold">
          🎉 BINGO! You won! 🎉
        </div>
      )}

      <div className="grid grid-cols-5 gap-3 mb-6">
        {squares.map((square, index) => (
          <button
            key={index}
            onClick={() => handleSquareClick(index)}
            className={`
              aspect-square w-full p-2
              border-2 rounded-lg
              transition-all duration-200
              flex items-center justify-center text-center
              whitespace-pre-wrap break-words
              ${
                square.text === "FREE SPACE"
                  ? "bg-blue-600 text-white border-blue-700 font-bold text-2xl"
                  : square.isMarked
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white hover:bg-blue-50 border-gray-300"
              }
              ${
                square.text.length > 45
                  ? "text-[10px]"
                  : square.text.length > 35
                  ? "text-xs"
                  : square.text.length > 25
                  ? "text-sm"
                  : "text-base"
              }
              leading-tight font-medium
            `}
          >
            {square.text}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={resetBoard}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
        >
          New Board
        </button>
      </div>
    </div>
  );
}
