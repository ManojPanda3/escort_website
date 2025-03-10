import { Button } from "@/components/ui/button";
import Link from "next/link";
import locationsData from "@/public/location.json";

export default async function LocationsPage(ctx) { // Receive location as a prop
  const { location } = await ctx.searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Locations
        </h1>

        {location
          ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Services in {location}
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Explore a variety of services available in{" "}
                {location}. More details coming soon!
              </p>
              {/* You would replace this with actual content based on the location */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder cards - replace with actual data */}
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <h3 className="font-semibold text-lg">
                      Service #{index + 1}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Description of service in {location}.
                    </p>
                  </div>
                ))}
              </div>
            </>
          )
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationsData.map((city) => ( // Iterate directly over the city array
                <div key={city}>
                  {/* key should be unique */}
                  {/* No state heading needed */}
                  <Link
                    href={`/escorts?location=${encodeURIComponent(city)}`}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-lg py-6 hover:bg-primary hover:text-primary-foreground transition-colors mb-2"
                    >
                      {city}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}
export const runtime = "edge"
