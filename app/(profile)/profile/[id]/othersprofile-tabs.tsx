"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Clock,
  DollarSign,
  Edit,
  ImageIcon,
  MessageSquare,
  Settings,
  Star,
  Trash,
  X,
  Loader2, // Import Loader2 icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import getRandomImage from "../../../../lib/randomImage.ts";
import { useUserData } from "@/lib/useUserData";

interface ProfileTabsProps {
  pictures: any[];
  rates: any[];
  testimonials: any[];
  ownerId: string;
  user: any;
}

interface Testimonial {
  id: string;
  comment: string;
  rating: number;
  created_at: string;
  owner: {
    id: string;
    profile_picture?: string;
    username?: string;
  };
}

export function ProfileTabs({
  pictures,
  rates,
  testimonials: initialTestimonials,
  user,
}: ProfileTabsProps) {
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Loader for delete
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);

  const { user: currentUser } = useUserData();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialTestimonials,
  );
  const { toast } = useToast();
  const userId = currentUser?.id;
  const ownerId = user?.id;
  const addDialogRef = useRef<HTMLDivElement>(null);
  const editDialogRef = useRef<HTMLDivElement>(null); // Separate ref for edit dialog

  // State for editing
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTestimonialId, setEditingTestimonialId] =
    useState<string | null>(null);
  const [editComment, setEditComment] = useState<string>("");  //Separate states for edit
  const [editRating, setEditRating] = useState<number>(0);


  // --- Helper Functions ---

  const renderStars = (currentRating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-6 w-6 cursor-pointer ${i <= currentRating
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-300"
            }`}
          onClick={() => isEditing ? setEditRating(i) : setRating(i)} // IMPORTANT:  Set the correct rating state!
        />,
      );
    }
    return stars;
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditComment(testimonial.comment);
    setEditRating(testimonial.rating);
    setEditingTestimonialId(testimonial.id);
    setIsEditing(true);  // This is crucial:  it *shows* the edit dialog
  };

  const closeAddDialog = () => {
    if (addDialogRef.current) {
      const closeButton = addDialogRef.current.querySelector('[data-radix-dialog-close]');
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }
    }
    // Reset add form
    setComment("");
    setRating(0);
  };

  const closeEditDialog = () => {
    if (editDialogRef.current) {
      const closeButton = editDialogRef.current.querySelector('[data-radix-dialog-close]');
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }

    }
    setIsEditing(false);
    setEditingTestimonialId(null);
    setEditComment(""); // Reset edit form
    setEditRating(0);
  }


  // --- CRUD Operations ---

  const handleSubmitTestimonial = async (to: string) => {
    if (!userId) {
      toast({ title: "Error", description: "You have to login.", variant: "destructive" }); return;
    }
    if (!comment.trim()) {
      toast({ title: "Error", description: "Please enter a comment.", variant: "destructive" }); return;
    }
    if (rating === 0) {
      toast({ title: "Error", description: "Please select a rating.", variant: "destructive" }); return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/profile/addTestimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, comment, rating }),
      });

      const { data } = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add.");

      const newTestimonial = { id: data.id, comment, rating, created_at: new Date().toISOString(), owner: { id: userId, profile_picture: currentUser?.profile_picture || getRandomImage(), username: currentUser?.username || "" } };
      setTestimonials((prev) => [newTestimonial, ...prev]);
      toast({ title: "Success", description: "Testimonial added." });
      closeAddDialog();

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTestimonial = async () => {
    if (!userId || !editingTestimonialId) return;
    if (!editComment.trim()) { // Use editComment here
      toast({ title: "Error", description: "Please enter a comment.", variant: "destructive" }); return
    }
    if (editRating === 0) { //and editRating here.
      toast({ title: "Error", description: "Please select a rating.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true); // Use the same isSubmitting state, it works fine
    try {
      const response = await fetch("/api/profile/addTestimonial", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingTestimonialId, comment: editComment, rating: editRating, to: ownerId }), // Use editComment and editRating
      });

      const { data } = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update.");

      setTestimonials((prev) => prev.map((t) => t.id === editingTestimonialId ? { ...t, comment: editComment, rating: editRating } : t)); // Use editComment and editRating
      toast({ title: "Success", description: "Testimonial updated." });
      closeEditDialog();

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!userId) return;

    setIsDeleting(true);
    setDeletingTestimonialId(testimonialId); // Set the ID of the testimonial being deleted

    try {
      const response = await fetch("/api/profile/addTestimonial", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testimonialId, to: ownerId }),
      });

      const { data } = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete.");

      setTestimonials((prev) => prev.filter((t) => t.id !== testimonialId));
      toast({ title: "Success", description: "Testimonial deleted." });

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setDeletingTestimonialId(null); // Reset deleting testimonial ID
    }
  };

  return (
    <>
      <Toaster />
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
            {/* Add Testimonial Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent ref={addDialogRef}>
                <DialogHeader>
                  <DialogTitle>Add Testimonial</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-center">
                    {renderStars(rating)}
                  </div>
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
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Testimonial Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogContent ref={editDialogRef}>
                <DialogHeader>
                  <DialogTitle>Edit Testimonial</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-center">
                    {renderStars(editRating)}
                  </div>
                  <div className="space-y-2">
                    <Label>Comment</Label>
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      placeholder="Write your testimonial here..."
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleUpdateTestimonial}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Testimonial"}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={closeEditDialog}>
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>


            {/* Testimonial Cards */}
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 relative rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            testimonial.owner.profile_picture ||
                            "/placeholder.svg?height=100&width=100"
                          }
                          alt={testimonial.owner.username || "Anonymous"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">
                          {testimonial.owner.username || "Anonymous"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(testimonial.created_at)
                            .toLocaleDateString()}
                        </p>
                        <div className="flex items-center mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                        <p className="mt-2 break-words">
                          {testimonial.comment}
                        </p>
                      </div>
                      {/* Edit and Delete Buttons */}
                      {userId === testimonial.owner.id && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group"
                            onClick={() => openEditDialog(testimonial)} // Open edit dialog
                          >
                            <Edit className="h-4 w-4 text-primary group-hover:text-yellow-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group"
                            onClick={() =>
                              handleDeleteTestimonial(testimonial.id)
                            }
                            disabled={isDeleting && deletingTestimonialId === testimonial.id}
                          >
                            {isDeleting && deletingTestimonialId === testimonial.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
