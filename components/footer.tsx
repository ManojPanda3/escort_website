import Link from "next/link";
import { Facebook, Twitter } from "lucide-react";
import { supabase } from "../lib/supabase.ts";
import locationsData from "@/public/location.json"; // Import the JSON data

export function Footer() {
  const isUserExist: boolean = (supabase.auth.getUser()?.id) ? true : false;

  return (
    <footer
      className="bg-black text-gray-300 py-12 px-4 z-10"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto">
        {/* Social and Follow Section */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold mb-4">FOLLOW ALL-NIGHTER</h2>
          <div className="flex justify-center gap-4">
            <Link
              href="https://facebook.com/allnighter"
              className="hover:text-primary transition-colors"
              aria-label="Follow us on Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-6 w-6" aria-hidden="true" />
            </Link>
            <Link
              href="https://twitter.com/allnighter"
              className="hover:text-primary transition-colors"
              aria-label="Follow us on Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-6 w-6" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Business Links */}
          <nav aria-labelledby="business-heading">
            <h3
              id="business-heading"
              className="font-semibold mb-4 text-primary"
            >
              BUSINESS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-primary transition-colors"
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  href="/etiquette"
                  className="text-sm hover:text-primary transition-colors"
                >
                  ETIQUETTE
                </Link>
              </li>
              <li>
                {isUserExist
                  ? (
                    <Link
                      href="/auth/login"
                      className="text-sm hover:text-primary transition-colors"
                    >
                      SIGN UP
                    </Link>
                  )
                  : (
                    <Link
                      href="/auth/signup"
                      className="text-sm hover:text-primary transition-colors"
                    >
                      SIGN UP
                    </Link>
                  )}
              </li>
              <li>
                <Link
                  href="/advertising"
                  className="text-sm hover:text-primary transition-colors"
                >
                  ADVERTISING
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-primary transition-colors"
                >
                  CONTACT
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm hover:text-primary transition-colors"
                >
                  OUR BLOG
                </Link>
              </li>
            </ul>
          </nav>

          {/* Locations Grid (Australian Focus) */}
          <nav
            className="col-span-1 lg:col-span-2"
            aria-labelledby="locations-heading"
          >
            <h3
              id="locations-heading"
              className="font-semibold mb-4 text-primary"
            >
              LOCATIONS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Dynamically render locations */}
              {locationsData.map((city) => (
                <Link
                  key={city}
                  href={`/escorts?location=${encodeURIComponent(city)}`}
                  className="text-xs hover:text-primary transition-colors block" // Use block to fill the space
                >
                  {city}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs space-y-2 text-gray-500">
          <p>
            <small>COPYRIGHT © 2024 | All rights reserved 2014-2024</small>
          </p>
          <p>
            <small>
              ALL-NIGHTER AND THE ALL-NIGHTER LOGO ARE TRADE MARKS AND ARE USED
              UNDER LICENSE.
            </small>
          </p>
          <p>
            <small>
              REGISTRATIONS AND/OR APPLICATIONS FOR THE TRADE MARKS ARE CURRENT
              IN VARIOUS COUNTRIES INCLUDING AUSTRALIA
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
}
