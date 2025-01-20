export function randomPlaceholder(type: 'profile_picture' | 'cover_image'): string {
  // Generate random number between 1 and 9
  const randomNum = Math.floor(Math.random() * 9) + 1
  
  // Return formatted string based on type
  if (type === 'profile_picture') {
    return `profile_picture_${randomNum}.webp`
  }
  return `cover_image_${randomNum}.webp`
}
