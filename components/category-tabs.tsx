'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const categories = [
  'Featured', 'New', 'VIP', 'Verified', 'Available Now', 'Duo', 'BDSM', 'GFE'
] as const

export const CategoryTabs = memo(function CategoryTabs() {
  return (
    <nav 
      className="scrollbar-hide flex gap-2 overflow-x-auto pb-2"
      aria-label="Category filters"
    >
      {categories.map((category, index) => (
        <motion.button
          key={category}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            "hover:bg-primary/80 hover:text-primary-foreground",
            index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
          aria-pressed={index === 0}
          role="tab"
          aria-selected={index === 0}
          aria-controls={`${category.toLowerCase()}-tab`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </nav>
  )
})
