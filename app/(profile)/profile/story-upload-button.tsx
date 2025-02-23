"use client";

import React, { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserData } from "@/lib/useUserData";

interface Story {
  url: string;
  title: string;
  isvideo?: boolean;
  thumbnail?: string | null;
}


export function StoryUploadButton() {
  // TODO: make this workable
  // -- adding an way to compress the video 
  // -- get thumbnail from video
  // -- upload the video to the server
  // -- or incase of image upload the image to the server 
  //
  const { user, stories } = useUserData()
  const [isOpen, setIsOpen] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailURL, setThumbnailURL] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [stories_state, setStories] = useState<Story[]>(stories);



  const onUpload = async () => {
    // Your existing upload logic will be integrated within handleSubmit
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFileError(null); // Reset error on new file selection
    setFile(selectedFile);

    if (selectedFile.type.startsWith("video/")) {
      console.log("Video Not Allowed");
      setIsVideo(true);
      setThumbnailURL(null); // Clear thumbnail if video is selected.
      return; // Stop processing if it's a video
    } else {
      console.log("Image are allowed");
    }

    // Image Optimization for non-video files:
    try {
      const optimizedImage = await optimizeImage(selectedFile);
      setThumbnailURL(URL.createObjectURL(optimizedImage));
      setFile(optimizedImage)  // Store for upload.


    } catch (error) {
      console.error("Error optimizing image:", error);
      setFileError("Failed to process image.");
      setThumbnailURL(null);
    }
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError("Please select a file.");
      return;
    }

    setIsUploading(true);

    try {
      // Placeholder for your actual upload logic
      // You'll need to integrate your API calls or cloud storage upload here.

      // Assuming onUpload() now takes the `file` and processes it.
      //  await onUpload(file);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload

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
    setThumbnailURL(null);
    setFileError(null);

  };



  // Image Optimization Function (to WebP, 720p)
  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_HEIGHT = 720;

        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          "image/webp",
          0.7 // Quality, adjust as needed (0.0 - 1.0)
        );
      };

      img.onerror = reject;
    });
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
                disabled={isUploading}
              />
              {fileError && (
                <p className="text-destructive text-sm">{fileError}</p>
              )}
            </div>

            {thumbnailURL && (
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <img
                  src={thumbnailURL}
                  alt="Thumbnail"
                  className="max-h-40 w-auto rounded-lg"
                />
              </div>
            )}

            <Button type="submit" disabled={isUploading || !file || fileError !== null} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Story"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
