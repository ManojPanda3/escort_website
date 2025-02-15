"use client"
import { useEffect, useRef, useState } from "react";
import { Heart, Share } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ShareIcons from "./share-icons.tsx";

interface StoryViewerProps {
  id: string;
  url: string;
  title: string;
  isVideo?: boolean;
  onClose: () => void;
  userId: string;
  ownerAvatar: string;
  likes: number;
  ownerName: string;
  totalStories: number;
  currentIndex: number;
  onNext: () => unknown;
  onPrevious: () => unknown;
}

const default_time: number = 10;
export function StoryViewer({
  id,
  url,
  title,
  isVideo,
  onClose,
  likes,
  userId,
  ownerAvatar,
  ownerName,
  totalStories = 1,
  currentIndex = 0,
  onNext = () => { },
  onPrevious = () => { },
}: StoryViewerProps) {
  const [liked, setLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [progress, setProgress] = useState(2);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (progress >= default_time) {
        onNext();
        setProgress(2);
      } else {
        setProgress(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [progress]);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("story_likes")
      .select("user,id")
      .eq("user", userId)
      .eq("post", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          const isLiked = data && data.id ? true : false;
          setLiked(isLiked);
        }
      });
  }, [id, userId]);

  const handleLike = async () => {
    if (!userId) return;
    const newLikedState = !liked;
    setLiked(newLikedState);

    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    if (newLikedState) {
      await supabase.from("story_likes").insert([{ post: id, user: userId }]);
    } else {
      await supabase.from("story_likes").delete().eq("post", id).eq("user", userId);
    }

    await supabase.from("story").update({ likes: likeCount }).eq("id", id);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-black">
        <div className="relative w-full h-[80vh]">
          {isVideo ? (
            <video
              src={url}
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
            />
          ) : (
            <Image
              src={url || "/placeholder.svg"}
              alt={title}
              layout="fill"
              objectFit="cover"
            />
          )}
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 flex justify-between gap-[2px] w-full">
            {
              Array.from(Array(totalStories)).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-600 overflow-hidden rounded-sm flex-grow w-full"
                >
                  {index === currentIndex && (
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress / default_time) * 100}%` }} // Animate to the desired width
                      transition={{
                        duration: 1,
                        ease: "linear",
                      }}
                    />
                  )}
                </div>
              ))
            }
          </div>

          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Image
              src={ownerAvatar || "/placeholder.svg"}
              alt={ownerName}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white font-semibold">{ownerName}</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={handleLike}>
              <Heart
                className={`h-6 w-6 ${liked ? "text-red-500 fill-red-500" : "text-white"}`}
              />
              <span className="ml-2 text-white">{likeCount}</span>
            </Button>
            <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share className="h-6 w-6 text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <AnimatePresence>
                  {isShareOpen && <ShareIcons id={id} />}
                </AnimatePresence>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
