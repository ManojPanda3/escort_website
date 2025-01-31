import Link from 'next/link'
import { Facebook, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 px-4" role="contentinfo" aria-label="Site footer">
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
            <h3 id="business-heading" className="font-semibold mb-4 text-primary">BUSINESS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-primary transition-colors">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link href="/etiquette" className="text-sm hover:text-primary transition-colors">
                  ETIQUETTE
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm hover:text-primary transition-colors">
                  SIGN UP
                </Link>
              </li>
              <li>
                <Link href="/advertising" className="text-sm hover:text-primary transition-colors">
                  ADVERTISING
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                  CONTACT
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-primary transition-colors">
                  OUR BLOG
                </Link>
              </li>
              <li>
                <Link href="/guest-blog" className="text-sm hover:text-primary transition-colors">
                  GUEST BLOG
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm hover:text-primary transition-colors">
                  NEWS & ANNOUNCEMENTS
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-sm hover:text-primary transition-colors">
                  ESCORT TESTIMONIALS
                </Link>
              </li>
              <li>
                <Link href="/diary" className="text-sm hover:text-primary transition-colors">
                  ESCORT DIARY
                </Link>
              </li>
              <li>
                <Link href="/abbreviations" className="text-sm hover:text-primary transition-colors">
                  ESCORT ABBREVIATIONS
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-sm hover:text-primary transition-colors">
                  ESCORTS ON TOUR
                </Link>
              </li>
              <li>
                <Link href="/fetish" className="text-sm hover:text-primary transition-colors">
                  BDSM / FETISH PROVIDERS
                </Link>
              </li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-labelledby="resources-heading">
            <h3 id="resources-heading" className="font-semibold mb-4 text-primary">RESOURCES</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/members" className="text-sm hover:text-primary transition-colors">
                  MEMBERS AREA
                </Link>
              </li>
              <li>
                <Link href="/friendly-businesses" className="text-sm hover:text-primary transition-colors">
                  SEX WORK FRIENDLY BUSINESSES
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm hover:text-primary transition-colors">
                  ESCORT RESOURCES
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-sm hover:text-primary transition-colors">
                  HOTELS
                </Link>
              </li>
              <li>
                <Link href="/links" className="text-sm hover:text-primary transition-colors">
                  LINKS
                </Link>
              </li>
              <li>
                <Link href="/blue-dot" className="text-sm hover:text-primary transition-colors">
                  BLUE DOT LINKS
                </Link>
              </li>
              <li>
                <Link href="/photographers" className="text-sm hover:text-primary transition-colors">
                  ESCORT PHOTOGRAPHERS
                </Link>
              </li>
            </ul>
          </nav>

          {/* Locations Grid */}
          <nav className="col-span-1 lg:col-span-2" aria-labelledby="locations-heading">
            <h3 id="locations-heading" className="font-semibold mb-4 text-primary">LOCATIONS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">NEW SOUTH WALES</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/sydney" className="text-xs hover:text-primary transition-colors">
                      SYDNEY
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/newcastle" className="text-xs hover:text-primary transition-colors">
                      NEWCASTLE
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/wollongong" className="text-xs hover:text-primary transition-colors">
                      WOLLONGONG
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/albury" className="text-xs hover:text-primary transition-colors">
                      ALBURY
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">WESTERN AUSTRALIA</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/perth" className="text-xs hover:text-primary transition-colors">
                      PERTH
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/mandurah" className="text-xs hover:text-primary transition-colors">
                      MANDURAH
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/bunbury" className="text-xs hover:text-primary transition-colors">
                      BUNBURY
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/albany" className="text-xs hover:text-primary transition-colors">
                      ALBANY
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">QUEENSLAND</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/brisbane" className="text-xs hover:text-primary transition-colors">
                      BRISBANE
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/gold-coast" className="text-xs hover:text-primary transition-colors">
                      GOLD COAST
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/sunshine-coast" className="text-xs hover:text-primary transition-colors">
                      SUNSHINE COAST
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/cairns" className="text-xs hover:text-primary transition-colors">
                      CAIRNS
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/townsville" className="text-xs hover:text-primary transition-colors">
                      TOWNSVILLE
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">VICTORIA</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/melbourne" className="text-xs hover:text-primary transition-colors">
                      MELBOURNE
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/geelong" className="text-xs hover:text-primary transition-colors">
                      GEELONG
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/ballarat" className="text-xs hover:text-primary transition-colors">
                      BALLARAT
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/wodonga" className="text-xs hover:text-primary transition-colors">
                      WODONGA
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">TASMANIA</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/hobart" className="text-xs hover:text-primary transition-colors">
                      HOBART
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/launceston" className="text-xs hover:text-primary transition-colors">
                      LAUNCESTON
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/devonport" className="text-xs hover:text-primary transition-colors">
                      DEVONPORT
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">NORTHERN TERRITORY</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/darwin" className="text-xs hover:text-primary transition-colors">
                      DARWIN
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/alice-springs" className="text-xs hover:text-primary transition-colors">
                      ALICE SPRINGS
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">SOUTH AUSTRALIA</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/adelaide" className="text-xs hover:text-primary transition-colors">
                      ADELAIDE
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">ACT</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/canberra" className="text-xs hover:text-primary transition-colors">
                      CANBERRA
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">NEW ZEALAND</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/location/auckland" className="text-xs hover:text-primary transition-colors">
                      AUCKLAND
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/christchurch" className="text-xs hover:text-primary transition-colors">
                      CHRISTCHURCH
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/wellington" className="text-xs hover:text-primary transition-colors">
                      WELLINGTON
                    </Link>
                  </li>
                  <li>
                    <Link href="/location/queenstown" className="text-xs hover:text-primary transition-colors">
                      QUEENSTOWN
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* Directories */}
        <nav 
          className="border-t border-gray-800 pt-8 mb-8" 
          aria-labelledby="directories-heading"
        >
          <h3 id="directories-heading" className="sr-only">Directory Links</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/directory/open-adult"
              className="text-sm hover:text-primary transition-colors"
            >
              Open Adult Directory
            </Link>
            <Link 
              href="/directory/punterlink"
              className="text-sm hover:text-primary transition-colors"
            >
              Punterlink
            </Link>
            <Link 
              href="/directory/fetishlife"
              className="text-sm hover:text-primary transition-colors"
            >
              Fetishlife
            </Link>
            <Link 
              href="/directory/porn-dude"
              className="text-sm hover:text-primary transition-colors"
            >
              The Porn Dude
            </Link>
          </div>
        </nav>

        {/* Copyright */}
        <div className="text-center text-xs space-y-2 text-gray-500">
          <p>
            <small>COPYRIGHT © 2024 | All rights reserved 2014-2024</small>
          </p>
          <p>
            <small>ALL-NIGHTER AND THE ALL-NIGHTER LOGO ARE TRADE MARKS AND ARE USED UNDER LICENSE.</small>
          </p>
          <p>
            <small>REGISTRATIONS AND/OR APPLICATIONS FOR THE TRADE MARKS ARE CURRENT IN VARIOUS COUNTRIES INCLUDING AUSTRALIA</small>
          </p>
        </div>
      </div>
    </footer>
  )
}
