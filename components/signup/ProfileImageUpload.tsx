import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Plus } from "lucide-react";
import type React from "react"; // Added import for React

interface ProfileImageUploadProps {
  formData: {
    profilePicture: File | null;
    coverImage: File | null;
  };
  updateFormData: (data: Partial<ProfileImageUploadProps["formData"]>) => void;
  onNext: () => void;
  onPrevious: () => void;
  setError: () => void;
}

export default function ProfileImageUpload(
  { formData, updateFormData, onNext, onPrevious, setError }:
    ProfileImageUploadProps,
) {
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profilePicture" | "coverImage",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateFormData({ [field]: file });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4 relative h-24 w-24 bg-gray-200 rounded-full">
          {formData.profilePicture
            ? (
              <Image
                src={URL.createObjectURL(formData.profilePicture) ||
                  "/placeholder.svg"}
                alt="Profile Picture"
                fill
                className="object-cover rounded-full"
              />
            )
            : (
              <div className="w-full h-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
            )}
          <Input
            type="file"
            accept="image/*"
            ref={profilePictureRef}
            onChange={(e) => handleImageUpload(e, "profilePicture")}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => profilePictureRef.current?.click()}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          >
            Upload Profile Picture
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="flex items-center gap-4 relative h-40 bg-gray-200 rounded-md">
          {formData.coverImage
            ? (
              <Image
                src={URL.createObjectURL(formData.coverImage) ||
                  "/placeholder.svg"}
                alt="Cover Image"
                fill
                className="object-cover rounded-md"
              />
            )
            : (
              <div className="w-full h-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
            )}
          <Input
            type="file"
            accept="image/*"
            ref={coverImageRef}
            onChange={(e) => handleImageUpload(e, "coverImage")}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => coverImageRef.current?.click()}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          >
            Upload Cover Image
          </Button>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
