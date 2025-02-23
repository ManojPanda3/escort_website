"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string[];
  onSave: (interests: string[]) => void;
  available: string[];
  title: stirng;
}

export function Selector(
  { isOpen, onClose, selected, onSave, available, title }: SelectorProps,
) {
  const [localSelected, setLocalSelected] = useState<string[]>(
    selected,
  );

  const toggleInterest = (interest: string) => {
    setLocalSelected((
      prev,
    ) => (prev.includes(interest)
      ? prev.filter((i) => i !== interest)
      : [...prev, interest])
    );
  };

  const handleSave = () => {
    onSave(localSelected);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-thumb-primary">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 py-4">
            {available.map((interest) => (
              <Badge
                key={interest}
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary/20 transition-colors flex justify-center items-center",
                  "border-gray-700 hover:border-primary",
                  localSelected.includes(interest) &&
                  "bg-primary/30 border-primary text-primary",
                )}
                onClick={() => toggleInterest(interest)}
              >
                <p className="text-center p-2 w-full">
                  {interest}
                </p>
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save ({localSelected.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

