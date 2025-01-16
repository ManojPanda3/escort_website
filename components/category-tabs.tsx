'use client'

import { cn } from '@/lib/utils'

const categories = [
  'Featured', 'VIP', 'Verified', 'Available Now', 'Duo', 'BDSM'
]

export function CategoryTabs() {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      {categories.map((category, index) => (
        <button
          key={category}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            "hover:bg-primary/80 hover:text-primary-foreground",
            index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

