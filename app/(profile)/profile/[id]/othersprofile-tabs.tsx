"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Clock,
  DollarSign,
  ImageIcon,
  MessageSquare,
  Settings,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import getRandomImage from "../../../../lib/randomImage.ts";

interface ProfileTabsProps {
  pictures: any[];
  rates: any[];
  testimonials: any[];
  ownerId: string;
  user: any;
  currentUser: any;
}

interface Testimonial {
  id: string;
  comment: string;
  created_at: string; //  Use string and parse on display
  owner: {
    id: string;
    profile_picture?: string;
    username?: string;
  };
}

export function ProfileTabs({
  pictures,
  rates,
  testimonials: initialTestimonials, // Renamed for clarity
  currentUser,
  user,
}: ProfileTabsProps) {
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialTestimonials,
  ); // Use a state for testimonials
  const { toast } = useToast();
  const userId = currentUser?.id;
  const ownerId = user?.id;

  const handleSubmitTestimonial = async (to: string) => {
    if (ownerId === "") {
      console.error("You have to login to give testimonies to other");
      toast({
        title: "Error",
        description: "You have to login to give testimonies to other",
        variant: "destructive",
      });
      return;
    }
    if (comment.trim().length === 0) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/profile/addTestimonial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          comment,
        }),
      });

      const { data } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit testimonial");
      }

      //Optimistically update the testimonials state *before* the fetch.
      const newTestimonial: Testimonial = {
        id: data?.id,
        comment: comment,
        created_at: new Date().toISOString(),
        owner: {
          id: userId,
          profile_picture: currentUser?.profile_picture || getRandomImage(), // get profile pic from response data
          username: currentUser?.username || "", //get name from response
        },
      };
      setTestimonials(
        (prevTestimonials) => [newTestimonial, ...prevTestimonials],
      ); // Add to the *beginning*

      toast({
        title: "Success",
        description: "Your testimonial has been submitted successfully",
      });
      setComment("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ||
          "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pictures.map((picture) => (
              <Card key={picture.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={picture.picture || ""}
                    alt={picture.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="font-medium truncate">{picture.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {picture.likes} likes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user?.services?.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-2 text-sm p-2 border rounded-md"
                  >
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="truncate">{service.service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <div className="grid gap-4">
            {rates.map((rate) => (
              <Card key={rate.id}>
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
                      {rate.price}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {rate.outcall
                      ? <Check className="h-4 w-4 text-green-500" />
                      : <X className="h-4 w-4 text-red-500" />}
                    Outcall Available
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="space-y-4">
            {ownerId && ownerId !== userId && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Testimonial</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Comment</Label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your testimonial here..."
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleSubmitTestimonial(ownerId)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 relative rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={testimonial.owner.profile_picture || ""}
                          alt={testimonial.owner.username || "Anonymous"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">
                          {testimonial.owner.username ||
                            "Anonymous"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(testimonial.created_at)
                            .toLocaleDateString()}
                        </p>
                        <p className="mt-2 break-words">
                          {testimonial.comment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </>
  );
}
