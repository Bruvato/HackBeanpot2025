import Image from "next/image";

const destinations = [
  {
    name: "Pacific Coast Highway",
    image: "/placeholder.svg?height=200&width=300",
    description: "Scenic coastal drive from San Francisco to Los Angeles",
  },
  {
    name: "Route 66",
    image: "/placeholder.svg?height=200&width=300",
    description: "Historic route from Chicago to Santa Monica",
  },
  {
    name: "Blue Ridge Parkway",
    image: "/placeholder.svg?height=200&width=300",
    description: "Stunning mountain views in Virginia and North Carolina",
  },
  {
    name: "Blue Ridge Parkway",
    image: "/placeholder.svg?height=200&width=300",
    description: "Stunning mountain views in Virginia and North Carolina",
  },
  {
    name: "Blue Ridge Parkway",
    image: "/placeholder.svg?height=200&width=300",
    description: "Stunning mountain views in Virginia and North Carolina",
  },
  {
    name: "Blue Ridge Parkway",
    image: "/placeholder.svg?height=200&width=300",
    description: "Stunning mountain views in Virginia and North Carolina",
  },
];

export default function FeaturedDestinations() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Road Trip Destinations
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
