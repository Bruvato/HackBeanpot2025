import { AiFillHeart } from "react-icons/ai";

const featuresList = [
  {
    icon: <AiFillHeart className="w-12 h-12 mb-4" />,
    title: "Route Optimization",
    description:
      "Find the fastest or most scenic routes based on your preferences and avoid traffic jams.",
  },
  {
    icon: <AiFillHeart className="w-12 h-12 mb-4" />,
    title: "Points of Interest",
    description:
      "Discover popular tourist attractions, restaurants, and scenic spots along the way.",
  },
  {
    icon: <AiFillHeart className="w-12 h-12 mb-4" />,
    title: "Weather Forecast",
    description:
      "Get real-time weather updates to ensure you're prepared for your journey.",
  },
  {
    icon: <AiFillHeart className="w-12 h-12 mb-4" />,
    title: "Road Alerts & Traffic",
    description:
      "Stay informed about road conditions, accidents, and construction zones.",
  },
  {
    icon: <AiFillHeart className="w-12 h-12 mb-4" />,
    title: "Accommodation Finder",
    description:
      "Easily find hotels, motels, and campgrounds along your route for a comfortable stay.",
  },
  {
    icon: <AiFillHeart className="w-12 h-12 mb-4" />,
    title: "Fuel Calculator",
    description:
      "Estimate fuel costs and plan refueling stops based on your vehicle's efficiency.",
  },
  {
    icon: <AiFillHeart className="w-12 h-12 mb-4" />,
    title: "Trip Budget Tracker",
    description:
      "Track your expenses and stay within budget during your road trip with ease.",
  },
  {
    icon: <AiFillHeart className="w-12 h-12 mb-4" />,
    title: "Offline Maps",
    description:
      "Access offline maps for areas with limited signal coverage, ensuring you’re never lost.",
  },
];

export default function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((service, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground p-6 rounded-lg text-center shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
