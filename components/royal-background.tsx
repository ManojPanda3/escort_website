"use client";
import { useTheme } from "next-themes";

export function RoyalBackground() {
  const { theme } = useTheme();

  // Define theme-based colors
  const fillColor = {
    light: "8B4513",
    dark: "#FFD700", // Brighter Gold
    sepia: "#8B4513", // Chocolate Brown
    cyberpunk: "#00FFFF", // Neon Cyan
    dracula: "#FF69B4", // Soft Pink
  }[theme || "light"];

  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-3 0-5.7 1.5-7.3 4L15 20.2c-.8 1.3-1.2 2.8-1.2 4.3 0 4.6 3.7 8.2 8.2 8.2 1.5 0 3-.4 4.3-1.2L30 30l3.7 1.5c1.3.8 2.8 1.2 4.3 1.2 4.6 0 8.2-3.7 8.2-8.2 0-1.5-.4-3-1.2-4.3L37.3 9c-1.6-2.5-4.3-4-7.3-4z' fill='${encodeURIComponent(fillColor)}'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
