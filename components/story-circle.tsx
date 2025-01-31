'use client'

import { useEffect, useState } from 'react'
import { Zuck } from 'zuck.js';
import 'zuck.js/css';
import 'zuck.js/skins/snapgram';

interface StoryCircleProps {
  id: string
  url: string
  title: string
  avatar_image: string
  isVideo?: boolean
}

export function StoryCircle({ id, url, title, isVideo, avatar_image }: StoryCircleProps) {
  console.info(avatar_image)
  // useEffect(() => {
  //   // Initialize Zuck stories
  //   const storiesEl = document.getElementById('stories')
  //   if (!storiesEl) return
  //
  //   const timestamp = Date.now()
  //
  //   const stories = Zuck(storiesEl, {
  //     backNative: true,
  //     previousTap: true,
  //     skin: 'snapgram',
  //     autoFullScreen: false,
  //     avatars: true,
  //     list: false,
  //     cubeEffect: true,
  //     localStorage: true,
  //     stories: [
  //       {
  //         id,
  //         photo: avatar_image || '/placeholder.svg', 
  //         name: title,
  //         link: '',
  //         lastUpdated: timestamp,
  //         items: [
  //           {
  //             id: `${id}-1`,
  //             type: isVideo ? 'video' : 'photo',
  //             length: 0,
  //             src: url,
  //             preview: url,
  //             link: '',
  //             linkText: '',
  //             time: timestamp,
  //             seen: false
  //           }
  //         ]
  //       }
  //     ]
  //   })
  //
  //   return () => {
  //     // Cleanup - remove element instead of destroy
  //     if (storiesEl) {
  //       storiesEl.remove()
  //     }
  //   }
  // }, [id, url, title, isVideo])

  return (
    <div id="stories" className="storiesWrapper" />
  )
}
