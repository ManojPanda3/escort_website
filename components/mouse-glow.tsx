'use client'

import { useLayoutEffect } from 'react'

export function MouseGlow() {

  useLayoutEffect(() => {
    document.getElementById("mouse").onmousemove = e => {
      const projects = document.getElementById("mouse")
      const rect = projects.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      projects.style.setProperty("--mouse-x", `${x}px`);
      projects.style.setProperty("--mouse-y", `${y}px`);
    };
  }, [])
  return <div id="mouse" className="h-full w-full fixed top-0 left-0"></div>
}

