import { Button } from "@/components/ui/button";
import Link from "next/link";
import categories from "@/public/categories.json";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Categories
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              href={`/search?categories=${encodeURIComponent(category)}`}
              key={category}
            >
              <Button
                variant="outline"
                className="w-full text-lg py-6 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Button>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
