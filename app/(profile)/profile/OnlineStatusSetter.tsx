// app/profile/OnlineStatusSetter.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ClockIcon } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useUserData } from "@/lib/useUserData";
import isUserOnline from "@/components/isUserOnline";

interface OnlineStatusSetterProps { }

export function OnlineStatusSetter({ }: OnlineStatusSetterProps) {
  const { user, refetch } = useUserData();
  const [onlineDialogOpen, setOnlineDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    hour: "0",
    minute: "0",
  });
  const [isOnline, setIsOnline] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  useEffect(() => {
    setIsOnline(isUserOnline(user?.availability, user?.availability_exp));
  }, [user])

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = parseInt(e.target.value);
    if (isNaN(newHour) || newHour < 0) {
      newHour = 0;
    }
    setSelectedTime((prev) => ({ ...prev, hour: String(newHour) }));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinute = parseInt(e.target.value);
    if (isNaN(newMinute) || newMinute < 0) {
      newMinute = 0;
    } else if (newMinute > 59) {
      newMinute = 59;
    }
    setSelectedTime((prev) => ({ ...prev, minute: String(newMinute) }));
  };

  const handleTimeSubmit = async () => {
    const now = new Date();
    const durationMilliseconds =
      parseInt(selectedTime.hour) * 60 * 60 * 1000 +
      parseInt(selectedTime.minute) * 60 * 1000;

    if (durationMilliseconds <= 0) {
      console.log("Invalid Duration: Must be greater than 0.");
      toast({
        variant: "destructive",
        title: "Invalid Duration",
        description: "Duration must be greater than 0.",
      });
      return;
    }

    const futureAvailability = new Date(now.getTime() + durationMilliseconds);
    const userId = user?.id;

    if (!userId) {
      console.error("User ID not found.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID not found.",
      });
      return;
    }

    console.log(`User will be online for: ${durationMilliseconds} milliseconds`);
    setOnlineDialogOpen(false);
    console.log("Updating availability...");
    console.log(
      new Date().toISOString(),
      futureAvailability.toISOString()
    )

    try {
      const { error } = await supabase
        .from("users")
        .update({
          availability: new Date().toISOString(), // "available" instead of "availability"
          availability_exp: futureAvailability.toISOString(),
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }
      toast({
        title: "Success",
        description: "Online status updated successfully!",
      });

      setIsOnline(true);
      await refetch();
    } catch (error: any) {
      console.error("Error updating availability:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update online status.",
      });
    }
  };

  return (
    <Dialog open={onlineDialogOpen} onOpenChange={setOnlineDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isOnline ? "secondary" : "outline"}
          size="sm"
          disabled={isOnline && onlineDialogOpen}
        >
          {isOnline ? "Online" : "Make Me Online"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Online Duration</DialogTitle>
          <DialogDescription>
            Choose how long you want to appear online.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="row-span-3 flex gap-2 items-center justify-center">
            <ClockIcon />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={selectedTime.hour}
                onChange={handleHourChange}
                className="w-16"
              />
              <Input
                type="number"
                min="0"
                max="59"
                value={selectedTime.minute}
                onChange={handleMinuteChange}
                className="w-16"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={async () => {
              setIsOnline(false);
              setOnlineDialogOpen(false);
              if (user?.id) {
                try {
                  const { error } = await supabase
                    .from("users")
                    .update({ availability: null, availability_exp: null })
                    .eq("id", user.id);

                  if (error) {
                    throw error;
                  }
                  toast({
                    title: "Status",
                    description: "You are now offline!",
                  });
                  await refetch();
                } catch (error: any) {
                  console.error("Error setting user offline:", error);
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update offline status.",
                  });
                }
              }
            }}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleTimeSubmit}>
            Set Online
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
