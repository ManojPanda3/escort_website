"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const FPS = 15;

export const MouseGlow = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const throttleTimeout = useRef<number | null>(null); // Use useRef for timeout

  const throttledSetMousePosition = useCallback(
    (newPosition: { x: number; y: number }) => { // useCallback for throttled function
      if (!throttleTimeout.current) {
        setMousePosition(newPosition);
        throttleTimeout.current = window.setTimeout(() => {
          throttleTimeout.current = null;
        }, 1e3 / FPS);
      }
    },
    [],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    throttledSetMousePosition({ x: e.clientX, y: e.clientY }); // Use throttled version
  }, [throttledSetMousePosition]); // Dependency array includes throttledSetMousePosition

  useEffect(() => {
    setMounted(true);

    if (mounted) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      }); // Add passive listener
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted, handleMouseMove]); // Dependency array includes handleMouseMove

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        willChange: "transform",
        background:
          `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 215, 0, 0.15), transparent 50%)`,
      }}
    />
  );
};
