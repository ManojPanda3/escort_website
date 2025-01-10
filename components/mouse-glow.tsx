'use client'

import { useEffect } from 'react'

export function MouseGlow() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouse = document.getElementById('mouse')
      if (mouse) {
        const rect = mouse.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        mouse.style.setProperty('--mouse-x', `${x}px`)
        mouse.style.setProperty('--mouse-y', `${y}px`)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <div id="mouse" className="h-full w-full fixed top-0 left-0 pointer-events-none glow:amber-400" />
}

