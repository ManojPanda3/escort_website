import Link from 'next/link'
import { Facebook, Twitter } from 'lucide-react'

export function Footer() {
  const regions = {
    'NEW SOUTH WALES': ['SYDNEY', 'NEWCASTLE', 'WOLLONGONG', 'ALBURY'],
    'WESTERN AUSTRALIA': ['PERTH', 'MANDURAH', 'BUNBURY', 'ALBANY'],
    'QUEENSLAND': ['BRISBANE', 'GOLD COAST', 'SUNSHINE COAST', 'CAIRNS', 'TOWNSVILLE'],
    'VICTORIA': ['MELBOURNE', 'GEELONG', 'BALLARAT', 'WODONGA'],
    'TASMANIA': ['HOBART', 'LAUNCESTON', 'DEVONPORT'],
    'NORTHERN TERRITORY': ['DARWIN', 'ALICE SPRINGS'],
    'SOUTH AUSTRALIA': ['ADELAIDE'],
    'ACT': ['CANBERRA'],
    'NEW ZEALAND': ['AUCKLAND', 'CHRISTCHURCH', 'WELLINGTON', 'QUEENSTOWN']
  }

  const businessLinks = [
    'ABOUT', 'ETIQUETTE', 'SIGN UP', 'ADVERTISING', 'CONTACT', 'OUR BLOG',
    'GUEST BLOG', 'NEWS & ANNOUNCEMENTS', 'ESCORT TESTIMONIALS', 'ESCORT DIARY',
    'ESCORT ABBREVIATIONS', 'ESCORTS ON TOUR', 'BDSM / FETISH PROVIDERS'
  ]

  const resources = [
    'MEMBERS AREA', 'SEX WORK FRIENDLY BUSINESSES', 'ESCORT RESOURCES',
    'HOTELS', 'LINKS', 'BLUE DOT LINKS', 'ESCORT PHOTOGRAPHERS'
  ]

  const directories = [
    'Open Adult Directory', 'Punterlink', 'Fetishlife', 'The Porn Dude'
  ]

  return (
    <footer className="bg-black text-gray-300 py-12 px-4">
      <div className="container mx-auto">
        {/* Social and Follow Section */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold mb-4">FOLLOW ALL-NIGHTER</h3>
          <div className="flex justify-center gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Business Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">BUSINESS</h4>
            <ul className="space-y-2">
              {businessLinks.map(link => (
                <li key={link}>
                  <Link href="#" className="text-sm hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">RESOURCES</h4>
            <ul className="space-y-2">
              {resources.map(resource => (
                <li key={resource}>
                  <Link href="#" className="text-sm hover:text-primary transition-colors">
                    {resource}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations Grid */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-semibold mb-4 text-primary">LOCATIONS</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(regions).map(([region, cities]) => (
                <div key={region} className="mb-4">
                  <h5 className="font-medium text-sm mb-2">{region}</h5>
                  <ul className="space-y-1">
                    {cities.map(city => (
                      <li key={city}>
                        <Link href="#" className="text-xs hover:text-primary transition-colors">
                          {city}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Directories */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {directories.map(directory => (
              <Link 
                key={directory} 
                href="#"
                className="text-sm hover:text-primary transition-colors"
              >
                {directory}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs space-y-2 text-gray-500">
          <p>COPYRIGHT © | All rights reserved 2014-{new Date().getFullYear()}</p>
          <p>ALL-NIGHTER AND THE ALL-NIGHTER LOGO ARE TRADE MARKS AND ARE USED UNDER LICENSE.</p>
          <p>REGISTRATIONS AND/OR APPLICATIONS FOR THE TRADE MARKS ARE CURRENT IN VARIOUS COUNTRIES INCLUDING AUSTRALIA</p>
        </div>
      </div>
    </footer>
  )
}

