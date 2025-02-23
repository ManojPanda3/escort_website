"use client";

import { useEffect, useState } from "react"; // Import useEffect
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Check,
  DollarSign,
  ImageIcon,
  MessageSquare,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { AddServiceModal } from "@/components/modals/add-service-modal";
import { AddPictureModal } from "@/components/modals/add-picture-modal";
import { AddRateModal } from "@/components/modals/add-rate-modal";
import { AddStoryModal } from "@/components/modals/add-story-modal";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading";
import { deleteFromStorage } from "@/lib/storage";
import { Database } from "@/lib/database.types"; // Import Supabase types
import { supabase } from "@/lib/supabase";

type User = Database["public"]["Tables"]["users"]["Row"];
type Picture = Database["public"]["Tables"]["pictures"]["Row"];
type Rate = Database["public"]["Tables"]["rates"]["Row"];
type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"] & {
  owner: Pick<User, "id" | "username" | "profile_picture">;
};
// type Service = Database['public']['Tables']['services']['Row']; // No longer a separate table

interface ProfileTabsProps {
  pictures: Picture[];
  services: string[] | null | undefined; // Services are now strings in an array
  rates: Rate[];
  testimonials: Testimonial[];
  userId: string;
  refetch: () => Promise<void>; // Add refetch prop
}

export function ProfileTabs({
  pictures: initialPictures,
  services: initialServices,
  rates: initialRates,
  testimonials,
  userId,
  refetch, // Receive refetch function
}: ProfileTabsProps) {
  const [activeModal, setActiveModal] = useState<
    "service" | "picture" | "rate" | "story" | null
  >(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pictures, setPictures] = useState(initialPictures);
  const [services, setServices] = useState(initialServices || []); // Initialize as empty array
  const [rates, setRates] = useState(initialRates);

  // Use useEffect to update local state when props change (e.g., after refetch)
  useEffect(() => {
    setPictures(initialPictures);
    setServices(initialServices || []);
    setRates(initialRates);
  }, [initialPictures, initialServices, initialRates]);

  async function handlePictureDelete(id: string, fileUrl: string) {
    try {
      setIsLoading(true);

      // Delete from S3 first
      const storageResult = await deleteFromStorage(fileUrl, userId);
      if (!storageResult.success) {
        throw new Error("Failed to delete from storage");
      }

      // Then delete from database
      const response = await fetch(`/api/profile/addImage`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error(`Failed to delete picture`);

      setPictures(pictures.filter((picture) => picture.id !== id));
      await refetch(); // Invalidate cache after deletion
      toast({
        title: "Success",
        description: "Picture deleted successfully",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting picture:", error);
      setError(`Failed to delete picture`);
      setIsLoading(false);
    }
  }
  const handleDelete = async (type: "service" | "rate", id: string) => {
    try {
      setIsLoading(true);

      // Special handling for services (since they are now part of the user)
      if (type === "service") {
        const newServices = services.filter((service) => service !== id); // id is the service string itself
        const response = await fetch(`/api/profile/updateUser`, { // API endpoint to update user
          method: "PATCH", // Use PATCH for partial updates
          body: JSON.stringify({ services: newServices }), // Send updated services array
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to update user services");
        setServices(newServices);
      } else if (type === "rate") {
        const response = await fetch(`/api/profile/addRate`, { // Your existing rate API
          method: "DELETE",
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error(`Failed to delete ${type}`);
        setRates(rates.filter((rate) => rate.id !== id));
      }
      await refetch(); // Invalidate cache after change
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)
          } deleted successfully`,
      });
      setIsLoading(false);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      setError(`Failed to delete ${type}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isLoading && (
        <div className="w-full h-full fixed top-0 left-0 bg-transparent flex justify-center items-center before:w-full before:h-full before:fixed before:bg-black before:opacity-30 z-50">
          <LoadingSpinner />
        </div>
      )}
      <Tabs defaultValue="pictures" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pictures" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Pictures
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Rates
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Testimonials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pictures">
          <Button
            variant="outline"
            onClick={() => setActiveModal("picture")}
            className="mb-4 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Picture
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pictures.map((picture) => (
              <Card
                key={picture.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={picture.picture ||
                      "/placeholder.svg?height=400&width=400"}
                    alt={picture.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex iitemscenter justify-between">
                    <p className="font-medium truncate">{picture.title}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handlePictureDelete(picture.id, picture.picture)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Likes: {picture.likes}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Button
            variant="outline"
            onClick={() => setActiveModal("service")}
            className="mb-4 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {services?.map((service, index) => ( // Use index as key since service is a string
                  <div
                    key={index} // Use index as key
                    className="flex items-center justify-between gap-2 text-sm p-3 border rounded-md hover:border-primary transition-colors cursor-pointer"
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="truncate text-ellipsis text-nowrap overflow-hidden">
                        {service}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete("service", service); // Pass the service string itself
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Button
            variant="outline"
            onClick={() => setActiveModal("rate")}
            className="mb-4 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
          <div className="grid gap-4">
            {rates.map((rate) => (
              <Card key={rate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold">{rate.reason}</h3>
                      <p className="text-sm text-muted-foreground">
                        Duration: {rate.duration}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-lg self-start sm:self-center"
                    >
                      $ {rate.price}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {rate.outcall
                        ? <Check className="h-4 w-4 text-green-500" />
                        : <X className="h-4 w-4 text-red-500" />}
                      Outcall Available
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDelete("rate", rate.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="grid gap-4">
            {testimonials.length === 0 ? <p>No testimonials yet.</p> : (
              testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 relative rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={testimonial.owner.profile_picture ||
                            "/placeholder.svg"}
                          alt={testimonial.owner.username || "Anonymous"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">
                          {testimonial.owner.username || "Anonymous"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            testimonial.created_at,
                          ).toLocaleDateString()}
                        </p>
                        <p className="mt-2 break-words">
                          {testimonial.comment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      {selectedService && (
        <div className="fixed bg-black w-1/2 before:bg-black before:opacity-40 before:fixed before:top-0 before:bottom-0 before:left-0 before:right-0">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 bg-black rounded-lg p-6">
            <X
              className="h-6 w-6 text-red-500 absolute right-2 top-2 cursor-pointer"
              onClick={() => setSelectedService(null)}
            />
            <p>{selectedService}</p>
          </div>
        </div>
      )}
      <AddServiceModal
        isOpen={activeModal === "service"}
        onClose={async (newService) => { // Make onClose async
          if (newService) {
            // Add the new service to the user's services array in the database
            const updatedServices = [...services, newService.service]; //newService contains service object {id:string, service:string}.
            const { error } = supabase.from("users").update({
              service: updatedServices
            }).eq("id", userId);

            if (error) {
              setError("Failed to update services.");
              return; // Early return on error
            }
            //If updated on the server update in local storage
            setServices(updatedServices); // Update local state *after* successful server update
            await refetch(); // Invalidate cache after change
          }
          setActiveModal(null);
          toast({
            title: "Success",
            description: "Service added successfully",
          });
        }}
        userId={userId}
      />
      <AddPictureModal
        isOpen={activeModal === "picture"}
        userId={userId}
        setError={setError}
        onClose={async (newPicture) => {
          if (newPicture) {
            // Type check before updating state
            if (
              newPicture && typeof newPicture === "object" && "id" in newPicture
            ) {
              setPictures([...pictures, newPicture as Picture]);
              await refetch();
            }
          }
          setActiveModal(null);
          toast({
            title: "Success",
            description: "Picture uploaded successfully",
          });
        }}
      />
      <AddRateModal
        isOpen={activeModal === "rate"}
        onClose={async (newRate) => {
          if (newRate) {
            // Type check before updating state
            if (newRate && typeof newRate === "object" && "id" in newRate) {
              setRates([...rates, newRate as Rate]);
              await refetch(); // Invalidate cache
            }
          }
          setActiveModal(null);
          toast({
            title: "Success",
            description: "Rate added successfully",
          });
        }}
      />
      <AddStoryModal
        isOpen={activeModal === "story"}
        onClose={async () => { // Add async
          setActiveModal(null);
          await refetch(); // Invalidate cache
          toast({
            title: "Success",
            description: "Story added successfully",
          });
        }}
      />
      <Toaster />
    </>
  );
}

