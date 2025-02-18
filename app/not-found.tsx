import Link from "next/link";
import { Button } from "@/components/ui/button"; // Import the Button component

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-5xl font-extrabold text-primary mb-4">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Oops! The page you are looking for could not be found.
      </p>
      <Link href="/">
        <Button variant="default">
          Go back to the homepage
        </Button>
      </Link>
    </div>
  );
}

