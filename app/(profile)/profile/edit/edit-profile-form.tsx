"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, X, Camera } from "lucide-react"  // Removed Plus
import { useToast } from "@/components/ui/use-toast" // Keep for success messages
import locations from "@/public/location.json"
import Image from "next/image"
import { uploadToStorage } from "@/lib/storage";
import { useUserData } from "@/lib/useUserData"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Selector } from "@/components/selector"
import categories from "@/public/categories.json"
import services from "@/public/services.json"
import { Database } from "@/lib/database.types"

type Category = Database["public"]["Enums"]["escort_category"];
type Service = Database["public"]["Enums"]["service_type"];

const australianPhoneRegex = /^(\+?\(61\)|\(\+?61\)|\+?61|\(0[1-9]\)|0[1-9])?( ?-?[0-9]){7,9}$/


export function EditProfileForm() {
  // TODO:
  // -- make this use cached data from useUserData
  // -- remove unwanted data
  // -- make it send the data to the backend
  //
  // PERF:
  // lets remove all the unwanted stuff from here
  const { toast } = useToast() // Keep for success messages
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { user: profile } = useUserData();
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [error, setError] = useState(""); // State for general errors
  const [phoneError, setPhoneError] = useState(""); // Separate state for phone number errors
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isServicesOpen, setIsServicesOpen] = useState<boolean>(false); //for service selector
  const [place_of_services, setPlaceOfServices] = useState<string[]>(profile?.place_of_services || []);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    about: profile?.about || "",
    age: profile?.age || 18,
    body_type: profile?.body_type || "",
    categories: profile?.categories || [],
    services: profile?.services || [],
    cover_image: profile?.cover_image || "",
    dress_size: profile?.dress_size || 0,
    eye_color: profile?.eye_color || "",
    gender: profile?.gender || "",
    hair_color: profile?.hair_color || "",
    height: profile?.height || 150,
    location_name: profile?.location_name || "",
    phone_number: profile?.phone_number || "",
    profile_picture: profile?.profile_picture || "",
  })

  const profilePictureRef = useRef<HTMLInputElement>(null)
  const coverImageRef = useRef<HTMLInputElement>(null)

  // Refs to store optimized image files
  const optimizedProfilePicture = useRef<File | null>(null);
  const optimizedCoverImage = useRef<File | null>(null);

  // States to store optimized image blobs for preview
  const [profilePictureBlob, setProfilePictureBlob] = useState<string | null>(null);
  const [coverImageBlob, setCoverImageBlob] = useState<string | null>(null);

  // --- Image Optimization and Handling ---
  // LOGIC: Optimizes the image to WebP and 720p resolution
  const optimizeAndSetImage = async (file: File, field: "profile_picture" | "cover_image") => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > 720 || height > 720) {
          if (width > height) {
            height *= 720 / width;
            width = 720;
          } else {
            width *= 720 / height;
            height = 720;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), { type: 'image/webp' });

          if (field === "profile_picture") {
            optimizedProfilePicture.current = optimizedFile;
            setProfilePictureBlob(URL.createObjectURL(blob));
          } else {
            optimizedCoverImage.current = optimizedFile;
            setCoverImageBlob(URL.createObjectURL(blob));
          }
        }, 'image/webp', 0.7);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profile_picture" | "cover_image",
  ) => {
    const file = e.target.files?.[0]
    if (!file) return;
    optimizeAndSetImage(file, field);
  }


  useEffect(() => {
    return () => {
      if (profilePictureBlob) URL.revokeObjectURL(profilePictureBlob);
      if (coverImageBlob) URL.revokeObjectURL(coverImageBlob);
    };
  }, [profilePictureBlob, coverImageBlob]);




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear general error when any input changes
    if (error) setError("");

  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({ ...formData, [name]: value[0] });
    if (error) setError("");
  }

  // No changes on handleArrayChange, handleArrayRemove
  const handleArrayChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: [...formData[name as keyof typeof formData], value] });
    if (error) setError("");
  }

  const handleArrayRemove = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: (formData[name as keyof typeof formData] as string[]).filter((item) => item !== value),
    });
    if (error) setError("");
  }

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value && !australianPhoneRegex.test(value)) {
      setPhoneError("Please enter a valid Australian phone number.");
      setIsDialogOpen(true);
    } else {
      setPhoneError("");
      setIsDialogOpen(false);
    }
  }

  const closeModal = () => {
    setIsDialogOpen(false);
    setPhoneError("");
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors
    setPhoneError(""); // Clear phone error

    //Final Phone number check
    if (formData.phone_number && !australianPhoneRegex.test(formData.phone_number)) {
      setPhoneError("Please enter a valid Australian phone number.");
      setIsDialogOpen(true);
      setLoading(false);
      return; // Prevent submission
    }
    try {
      const submissionData = { ...formData };

      if (optimizedProfilePicture.current) {
        const s3Path = await uploadToS3(optimizedProfilePicture.current, 'profile_picture');
        if (!s3Path) return;
        submissionData.profile_picture = s3Path;
      }
      if (optimizedCoverImage.current) {
        const s3Path = await uploadToS3(optimizedCoverImage.current, 'cover_image');
        if (!s3Path) return;
        submissionData.cover_image = s3Path;
      }



      const { error: updateError } = await supabase.from("users").update(submissionData).eq("id", profile?.id);

      if (updateError) {
        throw new Error(updateError.message);
      }


      const placeOfServiceResponse = await fetch("/api/profile/addPlaceOfService/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ place_of_services }),
      });

      if (!placeOfServiceResponse.ok) {
        const errorData = await placeOfServiceResponse.json();
        // Prioritize the 'message' from the API response, fallback to generic error.
        const errorMessage = errorData.message || `Error updating place of service: ${placeOfServiceResponse.status} ${placeOfServiceResponse.statusText}\n redirecting to the premium page`;
        router.push("/premium")
        throw new Error(errorMessage);
      }

      //if the response ok then its success
      const data = await placeOfServiceResponse.json()
      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Profile updated successfully.", //use message from api if available
        });
      }


      router.refresh();

    } catch (error: any) {
      setError(error.message || "An unknown error occurred.");
      setIsDialogOpen(true); // Open the dialog on general error
    } finally {
      setLoading(false);
    }
  };

  async function uploadToS3(file: File, field: string): Promise<string | null> {
    if (!profile?.id) {
      setError("User profile not found. Cannot upload.");
      setIsDialogOpen(true);
      return null;
    }

    const s3_response = await uploadToStorage(file, profile.id);

    if (!s3_response.success) {
      setError(`Failed to upload ${field}. ${s3_response.error}, redirecting to premium page`);
      setIsDialogOpen(true); //open dialog on error
      router.push("/premium")
      return null;
    }
    return s3_response.fileUrl;
  }
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              {phoneError || error}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative">
          {/* FIX: make the profile picture centerd left */}
          <div className="h-48 w-full relative">
            <Image
              src={coverImageBlob || formData.cover_image || "/placeholder.svg"}
              alt="Cover"
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70"
              onClick={() => coverImageRef.current?.click()}
            >
              <Camera className="h-4 w-4 text-white" />
            </Button>
            <input
              type="file"
              ref={coverImageRef}
              className="hidden"
              onChange={(e) => handleImageUpload(e, "cover_image")}
              accept="image/*"
            />
          </div>
          <div className="absolute bottom-1/2 translate-y-1/2 left-4 z-10">
            <div className="relative">
              <Image
                src={profilePictureBlob || formData.profile_picture || "/placeholder.svg"}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover rounded-full border-4 border-background"
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute  bg-black/50 hover:bg-black/70 bottom-1/2 translate-x-1/2 translate-y-1/2 right-1/2"
                onClick={() => profilePictureRef.current?.click()}
              >
                <Camera className="h-4 w-4 text-white" />
              </Button>
              <input
                type="file"
                ref={profilePictureRef}
                className="hidden"
                onChange={(e) => handleImageUpload(e, "profile_picture")}
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Slider
                        id="age"
                        min={18}
                        max={99}
                        step={1}
                        value={[formData.age]}
                        onValueChange={(value) => handleSliderChange("age", value)}
                      />
                      <div className="text-center">{formData.age} years old</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about">About</Label>
                    <Textarea id="about" name="about" value={formData.about} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="trans">Trans</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      type="tel" // Use type="tel" for phone numbers
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      onBlur={handlePhoneBlur} // Validate on blur
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Slider
                        id="height"
                        min={140}
                        max={220}
                        step={1}
                        value={[formData.height]}
                        onValueChange={(value) => handleSliderChange("height", value)}
                      />
                      <div className="text-center">{formData.height} cm</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dress_size">Dress Size</Label>
                      <Input
                        id="dress_size"
                        name="dress_size"
                        type="number"
                        value={formData.dress_size}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="body_type">Body Type</Label>
                      <Select
                        value={formData.body_type}
                        onValueChange={(value) => handleSelectChange("body_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slim">Slim</SelectItem>
                          <SelectItem value="athletic">Athletic</SelectItem>
                          <SelectItem value="curvy">Curvy</SelectItem>
                          <SelectItem value="bbw">BBW</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hair_color">Hair Color</Label>
                      <Select
                        value={formData.hair_color}
                        onValueChange={(value) => handleSelectChange("hair_color", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select hair color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blonde">Blonde</SelectItem>
                          <SelectItem value="brunette">Brunette</SelectItem>
                          <SelectItem value="redhead">Redhead</SelectItem>
                          <SelectItem value="black">Black</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eye_color">Eye Color</Label>
                    <Select value={formData.eye_color} onValueChange={(value) => handleSelectChange("eye_color", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select eye color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="brown">Brown</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="hazel">Hazel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <Button
                      variant="ghost"
                      type="button"
                      className=""
                      onClick={() => setIsCategoryOpen(true)}
                    >
                      Add Category
                    </Button>
                    <Selector
                      isOpen={isCategoryOpen}
                      onClose={() => { setIsCategoryOpen(false) }}
                      selected={formData.categories}
                      onSave={(values: Category[]) => {
                        setFormData((prev) => {
                          const newCategories = values.filter(category => !prev.categories.includes(category));
                          return { ...prev, categories: [...prev.categories, ...newCategories] };
                        });
                      }}
                      available={categories}
                      title="Select Services"
                    />
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => handleArrayRemove("categories", category)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {/* Services using Selector */}
                    <Label>Services</Label>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setIsServicesOpen(true)}
                    >
                      Add Service
                    </Button>
                    <Selector
                      isOpen={isServicesOpen}
                      onClose={() => setIsServicesOpen(false)}
                      selected={formData.services}
                      onSave={(selectedServices: Service[]) => {
                        setFormData(prev => {
                          const newServices = selectedServices.filter(service => !prev.services.includes(service));
                          return { ...prev, services: [...prev.services, ...newServices] };
                        });
                      }}
                      available={services}
                      title="Select Services"
                    />

                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => handleArrayRemove("services", service)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="location_name">Location</Label>
                    <Select
                      name="location_name"
                      value={formData.location_name}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          location_name: value
                        }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) =>
                        (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="place_of_services">Place of Services</Label>
                    <Select
                      name="place_of_service"
                      placeholder="select place of service"
                      onValueChange={(value) => {
                        if (!place_of_services.includes(value)) {
                          setPlaceOfServices((prev: string[]) => [...prev, value]);
                        }
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location of service" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) =>
                        (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {place_of_services.map((place) => (
                      <Badge key={place} variant="secondary">
                        {place}
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() => {
                            setPlaceOfServices((prev) => prev.filter((item) => item !== place));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </>
  )
}
