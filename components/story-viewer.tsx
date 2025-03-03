"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, Share } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ShareIcons from "./share-icons.tsx";
import { LoadingSpinner } from "@/components/ui/loading.tsx";

interface StoryViewerProps {
  id: string;
  url: string;
  title: string;
  isVideo?: boolean;
  onClose: () => void;
  userId: string | null;
  ownerAvatar: string;
  likes: number;
  liked: boolean;
  ownerName: string;
  totalStories: number;
  currentIndex: number;
  onNext: () => unknown;
  onPrevious: () => unknown;
  handleLike: () => unknown;
}

let progress = 2;

const default_time: number = 10;
export function StoryViewer({
  id,
  url,
  title,
  isVideo,
  onClose,
  likes,
  liked,
  ownerAvatar,
  ownerName,
  totalStories = 1,
  currentIndex = 0,
  handleLike,
  onNext = () => { },
  onPrevious = () => { },
}: StoryViewerProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [progress, setProgress] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [videoDuration, setVideoDuration] = useState(default_time);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setProgress(2);
  }, [url]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (!isLoading) {
      const duration = isVideo && videoRef.current ? videoRef.current.duration : default_time;
      const calculatedDuration = isNaN(duration) ? default_time : duration;
      setVideoDuration(calculatedDuration);

      intervalId = setInterval(() => {
        if (progress >= calculatedDuration) {
          onNext();
          setProgress(2);
        } else {
          setProgress((prev) => prev + 1);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [progress, onNext, isLoading, isVideo, videoDuration]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const containerWidth = rect.width;

      if (clickX < containerWidth / 2) {
        onPrevious();
        setProgress(2);
      } else {
        onNext();
        setProgress(2);
      }
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (!isNaN(duration)) {
        setVideoDuration(duration);
      }
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-md p-0 overflow-hidden bg-black">
        <div
          className="relative w-full h-[80vh]"
          ref={containerRef}
          onClick={handleClick}
        >
          {/* Loading screen */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <LoadingSpinner />
            </div>
          )}

          {isVideo ? (
            <video
              ref={videoRef}
              src={url}
              className="w-full h-full object-cover"
              loop
              autoPlay
              onLoadedMetadata={handleVideoLoad}
              onLoadedData={handleVideoLoad}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          ) : (
            <Image
              src={url || "/placeholder.svg"}
              alt={title}
              fill={true}
              style={{
                objectFit: "cover",
                display: isLoading ? 'none' : 'block'
              }}
              onLoadingComplete={handleImageLoad}
              priority
            />
          )}

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 flex justify-between gap-[2px] w-full">
            {Array.from(Array(totalStories)).map((_, index) => (
              <div
                key={index}
                className="bg-gray-600 overflow-hidden flex-grow w-full"
              >
                {index === currentIndex && !isLoading && (
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress / videoDuration) * 100}%` }}
                    transition={{
                      duration: 1,
                      ease: "linear",
                    }}
                  />
                )}
              </div>
            ))}
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
              <span className="ml-2 text-white">{likes}</span>
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
