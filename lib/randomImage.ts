"use client";
export default function getRandomImage() {
  // Random image generator
  const imageIndex = Math.floor(Math.random() * 18);
  return `http://raw.githubusercontent.com/riivana/All-nighter-random-images/refs/heads/main/image%20${imageIndex}.webp`;
}
