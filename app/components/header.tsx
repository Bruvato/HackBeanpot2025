import Link from "next/link";
import { TbMapPin } from "react-icons/tb";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TbMapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">RoadTrippr</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/plan" className="text-gray-600 hover:text-primary">
                Plan a Trip
              </Link>
            </li>
            <li>
              <Link
                href="/destinations"
                className="text-gray-600 hover:text-primary"
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-600 hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-primary"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
