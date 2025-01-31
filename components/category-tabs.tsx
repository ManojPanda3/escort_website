'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'

const categories = [
  'Featured', 'VIP', 'Verified', 'Available Now', 'Duo', 'BDSM'
] as const

export const CategoryTabs = memo(function CategoryTabs() {
  return (
    <nav 
      className="scrollbar-hide flex gap-2 overflow-x-auto pb-2"
      aria-label="Category filters"
    >
      {categories.map((category, index) => (
        <button
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
        >
          {category}
        </button>
      ))}
    </nav>
  )
})
