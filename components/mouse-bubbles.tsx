'use client'

import { useEffect, useRef } from 'react'

export function MouseBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let bubbles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      alpha: number
      color: string
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)
    resize()

    const colors = ['#FFD700', '#FFA500', '#FFB900']

    const addBubble = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)]
      bubbles.push({
        x,
        y,
        size: Math.random() * 15 + 5,
        speedX: (Math.random() - 0.5) * 2,
        speedY: -Math.random() * 2 - 1,
        alpha: 1,
        color
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles = bubbles.filter(bubble => bubble.alpha > 0)

      bubbles.forEach(bubble => {
        bubble.x += bubble.speedX
        bubble.y += bubble.speedY
        bubble.alpha -= 0.02

        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
        ctx.fillStyle = `${bubble.color}${Math.floor(bubble.alpha * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.5) {
        addBubble(e.clientX, e.clientY)
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
}

