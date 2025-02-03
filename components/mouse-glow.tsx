"use client";
import { useEffect, useState } from "react";

export function MouseGlow() {
  const [hasCursor, setHasCursor] = useState(false);

  useEffect(() => {
    // Check if device has cursor
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    setHasCursor(hasPointer);
  }, []);

  if (!hasCursor) return null;

  const handleMouseMove = (e: MouseEvent) => {
    // Calculate mouse position relative to the viewport
    const x = e.clientX;
    const y = e.clientY;

    const mouseElement = document.getElementById("mouse");
    if (mouseElement) {
      // Update the custom properties for CSS animations
      mouseElement.style.setProperty("--mouse-x", `${x}px`);
      mouseElement.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <div
      id="mouse"
      className="h-full w-full fixed top-0 left-0 pointer-events-auto" // Ensure pointer-events is allowed
      onMouseMove={handleMouseMove}
    />
  );
}

