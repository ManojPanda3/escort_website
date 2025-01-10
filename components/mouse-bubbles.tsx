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
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)
    resize()

    const addBubble = (x: number, y: number) => {
      bubbles.push({
        x,
        y,
        size: Math.random() * 20 + 10,
        speedX: (Math.random() - 0.5) * 2,
        speedY: -Math.random() * 2 - 1,
        alpha: 1
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles = bubbles.filter(bubble => bubble.alpha > 0)

      bubbles.forEach(bubble => {
        bubble.x += bubble.speedX
        bubble.y += bubble.speedY
        bubble.alpha -= 0.01

        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(218, 165, 32, ${bubble.alpha})`
        ctx.stroke()
      })

      requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.8) {
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

