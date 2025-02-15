"use client";

import Image from "next/image";
import { useState } from "react";
import { StoryViewer } from "./story-viewer";

interface StoryCircleProps {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  isVideo?: boolean;
  likes: number;
  userId: string;
  ownerAvatar: string;
  ownerName: string;
  totalStories: number;
  currentIndex: number;
  onNext: () => unknown;
  onPrevious: () => unknown;
  onClick: () => unknown
}

export function StoryCircle({
  id,
  url,
  thumbnail,
  title,
  isVideo,
  userId,
  likes,
  ownerAvatar,
  ownerName,
  onClick
}: StoryCircleProps) {

  return (
    <>
      <button
        className="group flex flex-col items-center gap-1"
        onClick={onClick}
      >
        <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
          <div className="p-0.5 rounded-full bg-black">
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-black">
              <Image
                src={ownerAvatar || "/placeholder.svg"}
                alt={ownerName}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
          {ownerName}
        </span>
      </button>
    </>
  );
}

