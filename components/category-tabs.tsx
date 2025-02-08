"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const categories = [
  "Featured",
  "New",
  "VIP",
  "Verified",
  "Available Now",
  "Duo",
  "BDSM",
  "GFE",
] as const;

export const CategoryTabs = ({ onCategorySelect }: { onCategorySelect: (category: string) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Featured");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category); // Call the function passed via props
  };

  return (
    <nav className="scrollbar-hide flex gap-2 overflow-x-auto pb-2" aria-label="Category filters">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            "hover:bg-primary/80 hover:text-primary-foreground",
            selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
          aria-pressed={selectedCategory === category}
          role="tab"
          aria-selected={selectedCategory === category}
          aria-controls={`${category.toLowerCase()}-tab`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </nav>
  );
};
