"use client";

import React, { useEffect, useRef, useState } from "react";
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
import VideoEditing from "@/components/VideoEditing";
import { uploadToStorage } from "@/lib/storage";

interface Story {
  url: string;
  title: string;
  isVideo?: boolean;
  thumbnail?: string | null;
}

export function StoryUploadButton() {
  const { user, stories, refetch } = useUserData();
  const [isOpen, setIsOpen] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storiesState, setStories] = useState<Story[]>(stories);
  const videoEditorRef = useRef<{ trim: () => Promise<void> } | null>(null);

  useEffect(() => {
    // Update local stories state when stories prop changes
    setStories(stories);
  }, [stories]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFileError(null);
    setFile(selectedFile);

    if (selectedFile.type.startsWith("video/")) {
      setIsVideo(true);
      setThumbnailUrl(null);
      return;
    } else {
      setIsVideo(false);
    }

    try {
      const optimizedImage = await optimizeImage(selectedFile);
      setThumbnailUrl(URL.createObjectURL(optimizedImage));
      setFile(optimizedImage);
    } catch (error) {
      console.error("Error optimizing image:", error);
      setFileError("Failed to process image.");
      setThumbnailUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(titleRef.current && titleRef.current.value.trim() !== "")) {
      setError("Please enter a proper title");
      return;
    }

    // Clear previous errors
    setFileError(null);
    setError(null);
    setIsUploading(true);

    try {
      let fileToUpload: File | null = null;
      if (isVideo && videoEditorRef.current) {
        fileToUpload = await videoEditorRef.current.trim();
        if (!fileToUpload) fileToUpload = file;
      } else {
        fileToUpload = file;
      }

      if (!fileToUpload) {
        setFileError("Please select a file.");
        setIsUploading(false);
        return;
      }

      const newStory = {
        url: "",
        title: titleRef.current.value,
        isvideo: isVideo,
        thumbnail: null,
      };

      // Upload files to storage
      try {
        if (isVideo) {
          if (!thumbnail) {
            setFileError("Thumbnail is required for video uploads");
            setIsUploading(false);
            return;
          }

          const response = await Promise.all([
            uploadToStorage(fileToUpload, user.id),
            uploadToStorage(thumbnail, user.id),
          ]);

          // Check for upload errors
          if (response.some(r => !r.success)) {
            const error = response.find(r => !r.success)?.error || "Upload failed";
            setFileError(`Storage upload error: ${error}`);
            setIsUploading(false);
            return;
          }

          newStory.url = response[0].fileUrl;
          newStory.thumbnail = response[1].fileUrl;
        } else {
          const response = await uploadToStorage(fileToUpload, user.id);

          if (!response.success) {
            setFileError(`Storage upload error: ${response.error}`);
            setIsUploading(false);
            return;
          }

          newStory.url = response.fileUrl;
          newStory.thumbnail = response.fileUrl;
        }
      } catch (uploadError: any) {
        setFileError(`File upload error: ${uploadError.message}`);
        setIsUploading(false);
        return;
      }

      // Save to database
      try {
        const response = await fetch("/api/profile/addStory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newStory)
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle specific error cases
          if (response.status === 402 || data.error?.includes("quota")) {
            setFileError("Upload quota exceeded. Please upgrade your plan to upload more media.");
          } else if (response.status === 401) {
            setFileError("Unauthorized. You may need to upgrade your account to upload stories.");
          } else {
            setFileError(data.error || "Failed to save story to database");
          }
          setIsUploading(false);
          return;
        }

        // Success - update the UI
        await refetch();
        setIsOpen(false);
        resetForm();
      } catch (apiError: any) {
        setFileError(`API error: ${apiError.message}`);
        setIsUploading(false);
      }
    } catch (error: any) {
      console.error("Error uploading:", error);
      setFileError(error.message || "Upload failed. Please try again.");
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setThumbnailUrl(null);
    setFileError(null);
    setIsVideo(false);
    setThumbnail(null);
    setError(null);
  };

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
          0.7
        );
      };

      img.onerror = reject;
    });
  };

  return (
    <div>
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-4">
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="h-16 w-16 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Story</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input id="title" ref={titleRef} required />
              {error && <p className="text-destructive text-sm">{error}</p>}
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
                <p className="text-destructive text-sm mt-1">{fileError}</p>
              )}
            </div>

            {file && isVideo && (
              <VideoEditing
                videoSrc={URL.createObjectURL(file)}
                videoFile={file}
                setFile={setFile}
                setThumbnailURL={setThumbnailUrl}
                setThumbnail={setThumbnail}
                ref={videoEditorRef}
              />
            )}

            {isVideo === false && thumbnailUrl && (
              <div className="space-y-2">
                <Label>Picture</Label>
                <img
                  src={thumbnailUrl}
                  alt="thumbnail"
                  className="max-h-40 w-auto rounded-lg"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isUploading || !file}
              className="w-full"
            >
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
