// components/AvailabilityUpdater.tsx
"use client";

import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ClockIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import locations from "@/public/location.json";
import { useUserData } from "@/lib/useUserData";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export function AvailabilityUpdater() {
  const { user, refetch } = useUserData();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedLocation, setSelectedLocation] = useState<string>(
    user?.location_name || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const supabase = createClientComponentClient();
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState({
    hour: "12",
    minute: "00",
    amPm: "AM",
  });

  const handleUpdateAvailability = async () => {
    if (!selectedLocation) {
      setError("Please select a location.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Combine date and time
      const combinedDate = new Date(date);
      const hour =
        selectedTime.amPm === "PM" && selectedTime.hour !== "12"
          ? parseInt(selectedTime.hour) + 12
          : selectedTime.amPm === "AM" && selectedTime.hour === "12"
            ? 0
            : parseInt(selectedTime.hour);

      combinedDate.setHours(hour, parseInt(selectedTime.minute), 0, 0);
      const newDate = new Date(combinedDate);
      newDate.setHours(combinedDate.getHours() + 8);

      const availabilityString = combinedDate.toISOString();
      const { error: updateUserError } = await supabase
        .from("users")
        .update({
          availability: availabilityString,
          availability_exp: newDate.toISOString(),
          location_name: selectedLocation,
        })
        .eq("id", user?.id);

      if (updateUserError) {
        throw new Error(
          updateUserError.message || "Failed to update availability.",
        );
      }

      toast({
        title: "Success",
        description: "Availability updated successfully!",
      });
      setOpen(false);
      await refetch();
    } catch (error: any) {
      setError(error.message);
      console.error("Error updating availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 3));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const formattedDate = date ? format(date, "PPP") : "";
  const formattedTime = `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.amPm}`;

  // Custom styles for DayPicker
  const customStyles = {
    today: ``,
    selected: `text-primary`,
    head_row: "bg-amber-200",
    head_cell: "text-amber-800 font-bold",
    nav_button:
      "text-amber-500 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400",
    nav_button_previous: "left-1",
    nav_button_next: "right-1",
    chevron: `fill-primary`,
    day_selected:
      "rounded-full focus:outline-none focus:ring-2 focus:ring-primary",
    button:
      "hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded",

  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = parseInt(e.target.value);

    if (isNaN(newHour) || newHour < 1) {
      newHour = 1;
    } else if (newHour > 12) {
      newHour = 12;
    }
    // Prevent 12:xx AM/PM other than 12:00 AM/PM
    if (newHour === 12 && parseInt(selectedTime.minute) > 0) {
      setSelectedTime((prev) => ({ ...prev, hour: String(newHour).padStart(2, "0") }));

    } else {
      setSelectedTime((prev) => ({ ...prev, hour: String(newHour).padStart(2, "0") }));
    }

  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinute = parseInt(e.target.value);

    if (isNaN(newMinute) || newMinute < 0) {
      newMinute = 0;
    } else if (newMinute > 59) {
      newMinute = 59;
    }

    // Prevent 12:xx AM/PM other than 12:00 AM/PM
    if (selectedTime.hour === "12" && newMinute > 0) {
      setSelectedTime((prev) => ({ ...prev, minute: "00" }));
    } else {
      setSelectedTime((prev) => ({ ...prev, minute: String(newMinute).padStart(2, "0") }));
    }

  };

  const handleAmPmChange = (value: string) => {
    // Prevent 12:xx AM/PM other than 12:00 AM/PM
    if (selectedTime.hour === "12" && parseInt(selectedTime.minute) > 0) {
      setSelectedTime(prev => ({ ...prev, amPm: value }));
    } else {
      setSelectedTime(prev => ({ ...prev, amPm: value }));
    }
  }


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Update Availability</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Update Availability
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Select a date for your availability."
                : step === 2
                  ? "Select a time for your availability."
                  : "Select a location for your availability."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="py-4">
            {step === 1 && (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="date">Date</Label>
                  {date && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {formattedDate}
                    </p>
                  )}
                </div>
                <div className="relative flex justify-center items-center">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow p-2 px-4"
                    classNames={customStyles}
                  />
                </div>
                <Button onClick={nextStep} variant="outline" className="w-full">
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Time Selection */}
            {step === 2 && (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="time">Time</Label>
                </div>
                <div className="row-span-3 flex gap-2 items-center">
                  <ClockIcon />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={selectedTime.hour}
                      onChange={handleHourChange}
                      className="w-16"
                    />
                    <span>:</span>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={selectedTime.minute}
                      onChange={handleMinuteChange}
                      className="w-16"
                    />
                    <Select
                      value={selectedTime.amPm}
                      onValueChange={handleAmPmChange}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="w-1/2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <Button onClick={nextStep} variant="outline" className="w-1/2">
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Location Selection */}
            {step === 3 && (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location">Location</Label>
                  <p className="text-sm text-muted-foreground">
                    {formattedDate} {formattedTime}
                  </p>
                </div>
                <div className="row-span-3 flex gap-2 items-center">
                  <MapPin className="" />
                  <Select
                    value={selectedLocation}
                    onValueChange={(value) => {
                      setSelectedLocation(value);
                      setError(null);
                    }}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between gap-4">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="w-1/2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <Button
                    onClick={handleUpdateAvailability}
                    disabled={isLoading}
                    className="w-1/2"
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setStep(1);
                setError(null);
                setSelectedTime({ hour: "12", minute: "00", amPm: "AM" }); // Reset time
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
