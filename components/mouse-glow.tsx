"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "next-themes";

export const MouseGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after the component mounts to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse move effect that will only work after the component has mounted
  useEffect(() => {
    if (!mounted) return; // Prevents mouse move effect logic until mounted

    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;

      const { clientX: x, clientY: y } = e;

      controls.start({
        x: x - 60, // Offset to center the glow
        y: y - 60,
        transition: { type: "spring", stiffness: 100, damping: 15 },
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted, controls]); // Runs after mounted state is true

  // Avoid rendering the component on the server side (before mounting)
  if (!mounted) return null;

  return (
    <motion.div
      ref={glowRef}
      animate={controls}
      className={`fixed top-0 left-0 w-[120px] h-[120px] rounded-full pointer-events-none blur-2xl
        ${
        theme === "dark"
          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-40 mix-blend-lighten"
          : "bg-gradient-to-r from-yellow-300 via-orange-500 to-red-500 opacity-20 mix-blend-multiply"
      }`}
    />
  );
};

