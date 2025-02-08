"use client";
import React, { useState } from "react";

const items = [
  "Red barn",
  "Speed limit sign",
  "18-wheeler truck",
  "Rest stop",
  "Gas station",
  "Billboard with a funny slogan",
  "Motorcycle",
  "Bridge",
  "Train tracks",
  "Windmill",
  "Farm animals",
  "Mountain",
  "Toll booth",
  "Construction cones",
  "Out-of-state license plate",
  "Water tower",
  "Police car",
  "Hot air balloon",
  "Sunset",
  "Bumper sticker",
  "Tunnel",
  "River or lake",
  "RV or camper",
  "Fast food sign",
  "Roadside attraction",
  "Cactus",
  "State welcome sign",
  "Graffiti",
  "Cloud shaped like an animal",
  "Fire truck",
  "Car with a bike rack",
  "Pickup truck with a dog in the back",
  "Street performer at a rest stop",
  "Amusement park",
  "Helicopter",
  "National park sign",
  "Barn with a painted mural",
  "Someone taking a selfie",
  "Car with a roof cargo box",
  "Tire skid marks on the road",
  "Wind turbines",
  "Highway exit sign",
  "Silo",
  "Sunrise",
  "Convertible with the top down",
  "Overpass",
  "Deer crossing sign",
  "Mile marker sign",
  "Roadside diner",
  "Someone wearing sunglasses",
  "Car pulling a trailer",
  "Truck with a logo",
  "Dog in a car window",
  "Person riding a bicycle",
  "Funny vanity plate",
  "Yellow car",
  "Train crossing",
  "Historic marker",
  "Snow-capped mountain",
  "Flock of birds",
  "Horse trailer",
  "Roadkill (yikes!)",
  "People waving from another car",
  "Parked RV",
  "School bus",
  "Welcome center",
  "Jet flying overhead",
  "Tunnel with lights",
  "Zebra-striped crosswalk",
  "Ambulance",
  "State trooper car",
  "Car with a missing hubcap",
  "Giant roadside statue",
  "Someone playing music in their car",
  "Canoe or kayak on a car roof",
  "Crop field",
  "Grocery store sign",
  "Car dealership",
  "Broken-down car on the side",
  "UPS or FedEx truck",
  "Ice cream stand",
  "Famous landmark",
  "Someone wearing a cowboy hat",
  "Street vendor",
  "Ferry boat",
  "Rainbow in the sky",
  "Person with binoculars",
  "Unusual-shaped cloud",
  "Muffler dragging on a car",
  "Roller coaster in the distance",
  "Fireworks stand",
  "Tourist taking a picture",
  "Zoo sign",
  "Abandoned building",
  "Person using a map",
  "Campground sign",
  "Military vehicle",
  "Car with roof bikes",
  "Hitchhiker",
  "Tractor",
];

function BingoBoard() {
  const [board, setBoard] = useState<string[]>(shuffleBoard(items));
  const [marked, setMarked] = useState<boolean[]>(Array(25).fill(false));

  function shuffleBoard(array: string[]): string[] {
    const randIndex = Math.round(Math.random() * array.length);
    if (randIndex + 25 > array.length) {
      return [...array].slice(randIndex - 25, randIndex);
    } else {
      return [...array].slice(randIndex, randIndex + 25);
    }
  }

  const toggleMark = (index: number) => {
    setMarked((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[index] = !newBoard[index];
      return newBoard;
    });
  };

  const resetBoard = () => {
    setBoard(shuffleBoard(items));
    setMarked(Array(25).fill(false));
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Road Trip Bingo</h2>
      <div className="grid grid-cols-5 gap-2">
        {board.map((item, index) => (
          <div
            key={index}
            className={`w-24 h-24 flex items-center justify-center border rounded-lg text-center p-2 cursor-pointer transition ${
              marked[index]
                ? "bg-green-400 text-black"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => toggleMark(index)}
          >
            {item}
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-black rounded-lg"
        onClick={resetBoard}
      >
        Reset Board
      </button>
    </div>
  );
}

export default BingoBoard;
