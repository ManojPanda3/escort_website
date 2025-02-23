"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Menu, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import locations from "@/public/location.json";
import { useUserData } from "@/lib/useUserData";
import { SearchBar } from "./search-bar"; // Import the new component
import { Search } from "lucide-react";
import { Loader2 } from "lucide-react"; // Import the loader icon


interface User {
  id: string;
  username: string;
  avatar: string;
}

export function NavBar({ userId }: { userId: string }) {
  const { clearCache, refetch } = useUserData();
  const [isUserExist, setIsUserExist] = useState(!!userId); // Initialize based on initial userId
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New state for loading

  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Initial check (in case userId changes before onAuthStateChange fires)
    setIsUserExist(!!userId);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Update isUserExist based on the session
        setIsUserExist(!!session?.user);
        if (session?.user) {
          refetch();
        }
      },
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, userId, refetch]); // Include refetch in dependency array

  const handleLogout = async () => {
    setIsLoggingOut(true); // Set loading state to true
    try {
      await supabase.auth.signOut();
      clearCache();
      setIsUserExist(false); // Update isUserExist on logout
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally show an error message to the user.
    } finally {
      setIsLoggingOut(false); // Reset loading state
    }
  };

  const cities =
    locations ||
    [
      "AUSTRALIA",
      "SYDNEY",
      "MELBOURNE",
      "BRISBANE",
      "GOLD COAST",
      "SUNSHINE COAST",
      "PERTH",
      "ADELAIDE",
      "CANBERRA",
      "HOBART",
      "DARWIN",
    ];

  const mainNav = [
    "LOCATIONS",
    "ESCORTS",
    "BDSM",
    "COUPLES",
    "CATEGORIES",
  ];

  return (
    <nav
      className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Top Cities Bar */}
      <div
        className="hidden lg:flex items-center justify-center gap-4 p-2 text-xs border-b border-border"
        role="navigation"
        aria-label="City navigation"
      >
        {cities.map((city) => (
          <Link
            key={city}
            href={`/search?location=${city.toLowerCase()}`}
            className="hover:text-primary transition-colors"
            aria-label={`View escorts in ${city}`}
          >
            {city}
          </Link>
        ))}
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Go to homepage"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
              <span className="hidden sm:inline">ALL-NIGHTER</span>
              <span className="sm:hidden">A-N</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden lg:flex items-center gap-6"
            role="navigation"
            aria-label="Primary navigation"
          >
            {mainNav.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm hover:text-primary transition-colors"
                aria-label={`View ${item.toLowerCase()}`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Premium Button */}
            <Link
              href="/premium"
              className="hidden sm:block text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-600 text-black px-4 py-2 rounded-full transition-transform duration-200 hover:scale-105 hover:animate-none hover:from-amber-500 hover:to-amber-700"
              aria-label="Upgrade to premium"
              style={{ transformOrigin: "center" }} // Ensure scaling from the center
            >
              PREMIUM
            </Link>
            <ThemeToggle />

            {/* Search Button (Opens Dialog) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User (Popover for options) */}
            {isUserExist ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User options">
                    <User className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => router.push("/profile")}
                      aria-label="Go to profile"
                    >
                      Profile
                    </Button>
                    <Button
                      variant="ghost" // Use destructive variant for red color
                      className="justify-start group"
                      onClick={handleLogout}
                      aria-label="Log out"
                      disabled={isLoggingOut} // Disable the button while logging out
                    >
                      {isLoggingOut ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4 text-red-500 group-hover:text-red-600" />
                      )}
                      Log Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <LoginBtn />
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 space-y-4">
                  {mainNav.map((item) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className="block py-2 hover:text-primary transition-colors"
                      aria-label={`View ${item.toLowerCase()}`}
                    >
                      {item}
                    </Link>
                  ))}
                  <Link
                    href="/premium"
                    className="block py-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    aria-label="Upgrade to premium"
                  >
                    PREMIUM
                  </Link>
                  {isUserExist ? (
                    <button
                      className="flex py-2 text-sm font-semibold text-red-600 hover:text-red-300 transition-colors "
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      Log Out
                    </button>
                  ) : (
                    <LoginBtn className="rounded-sm" />
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Popular Cities</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.slice(0, 6).map((city) => (
                        <Link
                          key={city}
                          href={`/escorts?location=${city.toLowerCase()}`}
                          className="text-sm hover:text-primary transition-colors"
                          aria-label={`View escorts in ${city}`}
                        >
                          {city}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Conditionally render the SearchBar as a Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <SearchBar isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
        </DialogContent>
      </Dialog>
    </nav>
  );
}

const LoginBtn = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <Button
      className={
        "bg-primary hover:bg-primary/80 font-bold py-2 px-4 rounded-full transition duration-300 text-black " +
        className
      }
      onClick={() => router?.push("/auth/login")}
    >
      <User className="h-5 w-5 mr-2" />
      Login
    </Button>
  );
};
