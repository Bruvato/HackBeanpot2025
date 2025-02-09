import Link from "next/link";
import { TbMapPin } from "react-icons/tb";
import { ThemeToggle } from "../components/theme-toggle";

export default function Header() {
  return (
    <header className="bg-background shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TbMapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">RoadToad</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/plan" className="text-foreground hover:text-primary">
                Plan a Trip
              </Link>
            </li>
            <li>
              <Link
                href="/destinations"
                className="text-foreground hover:text-primary"
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-foreground hover:text-primary"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-foreground hover:text-primary"
              >
                Contact
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
