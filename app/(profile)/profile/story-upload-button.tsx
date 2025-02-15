"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Loader2, Pause, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface Story {
  url: string;
  title: string;
  isvideo?: boolean;
  thumbnail?: string | null;
}

interface StoryUploadButtonProps {
  userId: string;
  stories?: Story[];
  onUpload?: (file: File, thumbnail: File) => Promise<void>;
}

export function StoryUploadButton(
  { userId, stories = [], onUpload }: StoryUploadButtonProps,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stories_state, setStories] = useState<Story[]>(stories);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailURL, setThumbnailURL] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [trimRange, setTrimRange] = useState([0, 100]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoTimeUpdate = () => {
    if (
      videoRef.current &&
      videoRef.current.currentTime >= (duration * trimRange[1]) / 100
    ) {
      videoRef.current.currentTime = (duration * trimRange[0]) / 100;
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = (duration * trimRange[0]) / 100;
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setFile(null);
    setThumbnail(null);
    setThumbnailURL(null);
    setVideoURL(null);
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const isVideo = selectedFile.type.startsWith("video/");
    const isImage = selectedFile.type.startsWith("image/");

    if (!isVideo && !isImage) {
      setFileError("Invalid file type. Only videos and images are allowed.");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      if (isVideo) {
        const url = URL.createObjectURL(selectedFile);
        setVideoURL(url);

        // Load video metadata
        const video = document.createElement("video");
        video.src = url;
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            setDuration(video.duration);
            resolve(null);
          };
        });

        const thumbnailFile = await generateVideoThumbnail(selectedFile);
        setThumbnail(thumbnailFile);
        setThumbnailURL(URL.createObjectURL(thumbnailFile));
      } else {
        const thumbnailFile = await optimizeImageForThumbnail(selectedFile);
        setThumbnail(thumbnailFile);
        setThumbnailURL(URL.createObjectURL(thumbnailFile));
      }
    } catch (error: any) {
      console.error("Error processing file:", error);
      setFileError(
        "There was an error processing your file. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVideoThumbnail = async (videoFile: File): Promise<File> => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.crossOrigin = "anonymous";

    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.currentTime = video.duration * 0.1;
        resolve(null);
      };
    });

    await new Promise((resolve) => {
      video.onseeked = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 426;
    canvas.height = 240;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/webp", 0.7);
    });

    video.remove();
    return new File([blob], "thumbnail.webp", { type: "image/webp" });
  };

  const optimizeImageForThumbnail = async (imageFile: File): Promise<File> => {
    const img = new Image();
    const imageUrl = URL.createObjectURL(imageFile);

    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 426;
    canvas.height = 240;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/webp", 0.7);
    });

    URL.revokeObjectURL(imageUrl);
    return new File([blob], "thumbnail.webp", { type: "image/webp" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !thumbnail) return;

    setIsUploading(true);

    try {
      if (onUpload) {
        await onUpload(file, thumbnail);
      }

      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading:", error);
      setFileError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setThumbnail(null);
    setThumbnailURL(null);
    setVideoURL(null);
    setTrimRange([0, 100]);
    setIsPlaying(false);
  };

  return (
    <div>
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-4">
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="h-16 w-16 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="h-6 w-6" />
          </Button>

          {stories_state.map((story) => (
            <div
              key={story.title + story.url}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary"
            >
              <img
                src={story.thumbnail || story.url}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New Story</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload Media</Label>
              <Input
                id="file"
                type="file"
                accept="video/*,image/*"
                onChange={handleFileChange}
                disabled={isProcessing || isUploading}
              />
              {fileError && (
                <p className="text-destructive text-sm">{fileError}</p>
              )}
              {isProcessing && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing file...
                </div>
              )}
            </div>

            {videoURL && (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    src={videoURL}
                    className="w-full"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-4 left-4"
                    onClick={togglePlayPause}
                  >
                    {isPlaying
                      ? <Pause className="h-4 w-4" />
                      : <Play className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Trim Video</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={trimRange}
                    onValueChange={setTrimRange}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{Math.round((duration * trimRange[0]) / 100)}s</span>
                    <span>{Math.round((duration * trimRange[1]) / 100)}s</span>
                  </div>
                </div>
              </div>
            )}

            {thumbnailURL && (
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <img
                  src={thumbnailURL || "/placeholder.svg"}
                  alt="Thumbnail"
                  className="max-h-40 w-auto rounded-lg"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isUploading || isProcessing || !file ||
                fileError !== null}
              className="w-full"
            >
              {isUploading
                ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                )
                : (
                  "Upload Story"
                )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

