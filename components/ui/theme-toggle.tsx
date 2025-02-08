"use client";

import { Moon, Sun, Monitor, Palette, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Custom themes
const themes = ["light", "dark", "sepia", "cyberpunk", "dracula"];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  // Get next theme in cycle
  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme || "light");
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];

    setTheme(newTheme);
    document.documentElement.classList.remove(...themes);
    document.documentElement.classList.add(newTheme); // Apply new theme
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={nextTheme}
      className="hover:bg-transparent relative"
    >
      {theme === "light" && <Sun className="h-5 w-5" />}
      {theme === "dark" && <Moon className="h-5 w-5" />}
      {theme === "sepia" && <Palette className="h-5 w-5 text-red-400" />}
      {theme === "cyberpunk" && <Settings className="h-5 w-5 text-cyan-400" />}
      {theme === "dracula" && <Moon className="h-5 w-5 text-purple-400" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
