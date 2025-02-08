import Link from "next/link";

import { AiOutlineGithub } from "react-icons/ai";
import { SiDevpost } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">RoadTrippr</h3>
            <p className="text-muted-foreground">
              Plan your perfect road trip adventure with ease.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/plan"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Plan a Trip
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Socials</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Bruvato/HackBeanpot2025"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <AiOutlineGithub className="h-6 w-6" />
              </a>
              <a
                href="/"
                target="_blank"
                className="text-muted-foreground hover:text-foreground"
              >
                <SiDevpost className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-muted-foreground mb-2">
              Subscribe for travel tips and exclusive deals
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-background text-foreground px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} RoadTrippr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
