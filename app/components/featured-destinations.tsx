import Image from "next/image";

const destinations = [
  {
    name: "Pacific Coast Highway",
    image: "/destinations/pacificCoastHighway.jpg",
    description: "Scenic coastal drive from San Francisco to Los Angeles",
  },
  {
    name: "Route 66",
    image: "/destinations/route66.webp",
    description: "Historic route from Chicago to Santa Monica",
  },
  {
    name: "Blue Ridge Parkway",
    image: "/destinations/blueRidgeHighway.jpg",
    description: "Stunning mountain views in Virginia and North Carolina",
  },
  {
    name: "Great River Road",
    image: "/destinations/greatRiverRoad.jpg",
    description: "Follows the Mississippi River from Minnesota to Louisiana",
  },
  {
    name: "Overseas Highway",
    image: "/destinations/overseasHighway.jpg",
    description:
      "Island-hopping drive through the Florida Keys on U.S. Route 1",
  },
  {
    name: "Going-to-the-Sun Road",
    image: "/destinations/goingToTheSunRoad.jpg",
    description:
      "Breathtaking mountain pass through Glacier National Park in Montana",
  },
];

export default function FeaturedDestinations() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground rounded-lg shadow-sm overflow-hidden"
            >
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {destination.name}
                </h3>
                <p className="text-muted-foreground">
                  {destination.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
