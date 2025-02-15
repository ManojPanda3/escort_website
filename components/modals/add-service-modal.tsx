"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { InterestSelector } from "@/components/interest-selector";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: (services?: { id: string; service: string }[]) => void;
}

export function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/services.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const services: string[] = await response.json();
        setAvailableServices(services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) return;

    setLoading(true);

    try {
      const addedServices = await Promise.all(
        selectedServices.map(async (service) => {
          const response = await fetch("/api/profile/addService", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service }),
          });

          if (!response.ok) {
            throw new Error(`Failed to add service: ${service}`);
          }
          const data = await response.json();
          return { id: data.id, service };
        }),
      );

      onClose(addedServices);
    } catch (error) {
      console.error("Error adding services:", error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterests = (interests: string[]) => {
    setSelectedServices(interests);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Services</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InterestSelector
            isOpen={true}
            onClose={onClose}
            selectedInterests={selectedServices}
            onSave={handleSaveInterests}
            availableInterests={availableServices}
            title="Select Services"
          />
          <Button
            type="submit"
            disabled={loading || selectedServices.length === 0}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Selected Services
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

