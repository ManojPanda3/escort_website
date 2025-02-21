// app/profile/edit/edit-profile-form.tsx (No changes needed)
// The provided code is already correct and refetches the data after update.
"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, Plus, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Success } from "@/components/ui/success";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { deleteFromStorage, uploadToStorage } from "@/lib/storage";
import { useUserData } from "@/lib/useUserData"; // Import useUserData
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type User = Database["public"]["Tables"]["users"]["Row"];
type Location = Database["public"]["Tables"]["locations"]["Row"]; // Assuming you have a locations table

interface EditProfileFormProps {
  profile: User;
}

type FormState = {
  name: string;
  about: string;
  location_name: string;
  place_of_services: string[];
  phone_number: string;
  height: string | null; // Allow null
  dress_size: string | null; // Allow null
  hair_color: string;
  eye_color: string;
  body_type: string;
  interest: string;
  gender: string;
  profile_picture: string;
  cover_image: string;
};

type Action =
  | {
    type: "SET_FIELD";
    field: keyof FormState;
    value: string | string[] | null;
  }
  | { type: "RESET"; payload: FormState }
  | { type: "ADD_PLACE_OF_SERVICE"; value: string }
  | { type: "REMOVE_PLACE_OF_SERVICE"; value: string };

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return action.payload;
    case "ADD_PLACE_OF_SERVICE":
      return {
        ...state,
        place_of_services: [...state.place_of_services, action.value],
      };
    case "REMOVE_PLACE_OF_SERVICE":
      return {
        ...state,
        place_of_services: state.place_of_services.filter((place) =>
          place !== action.value
        ),
      };
    default:
      return state;
  }
};

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const router = useRouter();
  const coverImageRef = useRef<HTMLInputElement | null>(null);
  const profilePictureRef = useRef<HTMLInputElement | null>(null);
  const { refetch } = useUserData(); // Get refetch from useUserData

  useEffect(() => {
    const fetchLocations = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data: locationsData, error } = await supabase
        .from("locations")
        .select("*");
      if (locationsData) {
        setLocations(locationsData);
      }
      if (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const initialState: FormState = {
    name: profile?.name || "",
    about: profile?.about || "",
    location_name: profile?.location_name || "",
    place_of_services: profile?.place_of_services || [],
    phone_number: profile?.phone_number || "",
    height: profile?.height || null, // Initialize as null
    dress_size: profile?.dress_size || null, // Initialize as null,
    hair_color: profile?.hair_color || "",
    eye_color: profile?.eye_color || "",
    body_type: profile?.body_type || "",
    interest: profile?.interested_services?.[0] || "", // Assuming first element is the primary interest
    gender: profile?.gender || "",
    profile_picture: profile?.profile_picture || "",
    cover_image: profile?.cover_image || "",
  };

  const [state, dispatch] = useReducer(formReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(
    profile?.profile_picture || "",
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    profile?.cover_image || "",
  );

  const handleFieldChange = (
    field: keyof FormState,
    value: string | string[] | null,
  ) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const uploadTasks = [];
    const deleteTasks = [];

    // Profile Picture Handling
    if (
      profilePictureRef.current?.files && profilePictureRef.current.files[0]
    ) {
      const file = profilePictureRef.current.files[0];
      uploadTasks.push(uploadToStorage(file, profile?.id));
      if (state.profile_picture) {
        deleteTasks.push(deleteFromStorage(state.profile_picture, profile?.id));
      }
    } else {
      uploadTasks.push(Promise.resolve({ success: false }));
    }

    // Cover Image Handling
    if (coverImageRef.current?.files && coverImageRef.current.files[0]) {
      const file = coverImageRef.current.files[0];
      uploadTasks.push(uploadToStorage(file, profile?.id));
      if (state.cover_image) {
        deleteTasks.push(deleteFromStorage(state.cover_image, profile?.id));
      }
    } else {
      uploadTasks.push(Promise.resolve({ success: false }));
    }

    try {
      const [profileUploadResult, coverUploadResult] = await Promise.all(
        uploadTasks,
      );
      await Promise.all(deleteTasks); // Wait for deletions

      const body: Partial<User> = {};

      // Only add fields to the body if they have changed
      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          const formStateKey = key as keyof FormState;
          if (state[formStateKey] !== initialState[formStateKey]) {
            body[formStateKey] = state[formStateKey] as any; // Type assertion
          }
        }
      }

      if (profileUploadResult.success) {
        body.profile_picture = profileUploadResult.fileUrl;
      }
      if (coverUploadResult.success) {
        body.cover_image = coverUploadResult.fileUrl;
      }
      if (state.interest != null) {
        body.interested_services = [state.interest];
      }

      if (Object.keys(body).length === 0) {
        setError("No changes to update");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/profile/updateUser", { // Use the correct API endpoint
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to update profile.");
      }

      await refetch(); // Invalidate cache after update
      setSuccess("Profile updated successfully");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageInput = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profile_picture" | "cover_image",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64String = reader.result as string;
        const tempImage = document.createElement("img");
        tempImage.src = base64String;

        tempImage.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            throw new Error("Failed to get canvas context.");
          }

          const maxDimension = 720;
          let { width, height } = tempImage;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = Math.floor(width);
          canvas.height = Math.floor(height);

          ctx.drawImage(tempImage, 0, 0, canvas.width, canvas.height);

          const webpDataUrl = canvas.toDataURL("image/webp", 0.9);
          if (field == "profile_picture") setProfilePictureUrl(webpDataUrl);
          else setCoverImageUrl(webpDataUrl);
        };

        tempImage.onerror = () => {
          throw new Error("Failed to process the image. Please try again.");
        };
      };

      reader.onerror = () => {
        throw new Error("Failed to read the image. Please try again.");
      };
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlaceOfService = (value: string) => {
    if (!state.place_of_services.includes(value)) {
      dispatch({ type: "ADD_PLACE_OF_SERVICE", value });
    }
  };

  const handleRemovePlaceOfService = (value: string) => {
    dispatch({ type: "REMOVE_PLACE_OF_SERVICE", value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && <Success>{success}</Success>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4 relative h-24 bg-gray-400 outline outline-1 outline-white rounded-sm">
              <div className="h-full w-full relative rounded-sm overflow-hidden">
                <Image
                  src={coverImageUrl}
                  alt={state.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute left-0 top-0 flex justify-center items-center w-full h-full"
                onClick={() => coverImageRef.current?.click()}
              >
                <Plus color="#000" />
                <Input
                  type="file"
                  accept="image/*"
                  ref={coverImageRef}
                  onChange={(e) => handleImageInput(e, "cover_image")}
                  disabled={loading}
                  className="hidden absolute top-0 left-0 scale-0"
                />
              </button>
              <div className="space-y-2 w-20 absolute top-2 left-2 h-full">
                <div className="flex items-center relative gap-4">
                  <div className="h-20 w-20 relative rounded-full overflow-hidden border-2 bg-gray-700">
                    <Image
                      src={profilePictureUrl}
                      alt={state.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute left-0 top-0 flex justify-center items-center w-full h-full"
                    onClick={() => profilePictureRef.current?.click()}
                  >
                    <Plus color="#000" />
                    <Input
                      className="hidden absolute top-0 left-0 scale-0"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageInput(e, "profile_picture")}
                      disabled={loading}
                      ref={profilePictureRef}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={state.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_name">Location</Label>
              <Select
                value={state.location_name}
                onValueChange={(value) =>
                  handleFieldChange("location_name", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={state.phone_number}
                onChange={(e) =>
                  handleFieldChange("phone_number", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place_of_services">Place of Services</Label>
              <Select onValueChange={handleAddPlaceOfService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select place of service" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {state.place_of_services.map((place) => (
                  <Badge key={place} variant="secondary" className="px-2 py-1">
                    {place}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemovePlaceOfService(place)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={state.height || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "height",
                    e.target.value === "" ? null : e.target.value,
                  )}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dress_size">Dress Size</Label>
              <Input
                id="dress_size"
                type="number"
                value={state.dress_size || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dress_size",
                    e.target.value === "" ? null : e.target.value,
                  )}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hair_color">Hair Color</Label>
              <Select
                value={state.hair_color}
                onValueChange={(value) =>
                  handleFieldChange("hair_color", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hair color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="blonde">Blonde</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eye_color">Eye Color</Label>
              <Select
                value={state.eye_color}
                onValueChange={(value) => handleFieldChange("eye_color", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select eye color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="hazel">Hazel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_type">Body Type</Label>
              <Select
                value={state.body_type}
                onValueChange={(value) => handleFieldChange("body_type", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Slim</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="curvy">Curvy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest">Interest</Label>
              <Select
                value={state.interest}
                onValueChange={(value) => handleFieldChange("interest", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={state.gender}
                onValueChange={(value) => handleFieldChange("gender", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={state.about}
              onChange={(e) => handleFieldChange("about", e.target.value)}
              disabled={loading}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

