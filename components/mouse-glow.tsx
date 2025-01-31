'use client'

import { useEffect, useState } from 'react'

export function MouseGlow() {
  const [hasCursor, setHasCursor] = useState(false)

  useEffect(() => {
    // Check if device has cursor
    const hasPointer = window.matchMedia('(pointer: fine)').matches
    setHasCursor(hasPointer)

    if (!hasPointer) return

    const mouse = document.getElementById('mouse')
    if (!mouse) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mouse.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mouse.style.setProperty('--mouse-x', `${x}px`)
      mouse.style.setProperty('--mouse-y', `${y}px`)
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!hasCursor) return null

  return <div id="mouse" className="h-full w-full fixed top-0 left-0 pointer-events-none glow:amber-400" />
}