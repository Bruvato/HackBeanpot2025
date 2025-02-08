import Link from "next/link";

import { AiOutlineGithub } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">RoadTrippr</h3>
            <p className="text-gray-400">
              Plan your perfect road trip adventure with ease.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/plan" className="text-gray-400 hover:text-white">
                  Plan a Trip
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-gray-400 hover:text-white"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Socials</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <AiOutlineGithub className="h-6 w-6 text-primary" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} RoadTrippr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
