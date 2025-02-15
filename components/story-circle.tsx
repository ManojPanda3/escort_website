"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { StoryViewer } from "./story-viewer";
import { supabase } from "../lib/supabase.ts";

interface StoryCircleProps {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  isVideo?: boolean;
  likes: number;
  userId: string;
}

export function StoryCircle(
  { id, url, thumbnail, title, isVideo, userId, likes }: StoryCircleProps,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase.from("story_likes").select("user,id").eq("post", id).eq(
      "user",
      userId,
    ).single().then(({ data, error }) => {
      if (error) {
        console.error(error);
      } else {
        const isLiked = data && data.id ? true : false;
        setLiked(isLiked);
      }
    });
  }, []);

  return (
    <>
      <button
        className="group flex flex-col items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <div className="p-0.5 rounded-full bg-gray-700">
          <div className="p-0.5 rounded-full bg-black">
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-black">
              <Image
                src={thumbnail}
                alt={title}
                fill
                className={cn(
                  "object-cover transition-opacity duration-300",
                  isVideo
                    ? "opacity-100"
                    : "group-hover:opacity-100 opacity-75",
                )}
              />
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
          {title}
        </span>
      </button>
      {isOpen && (
        <StoryViewer
          id={id}
          url={url}
          title={title}
          isVideo={isVideo}
          onClose={() => setIsOpen(false)}
          userId={userId}
          likes={likes}
          liked={liked}
          setLiked={setLiked}
        />
      )}
    </>
  );
}
