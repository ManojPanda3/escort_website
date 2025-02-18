// components/FilterSelect.tsx
"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSelectProps {
  label: string;
  options: string[];
  value: string;
  setValue: (value: string) => void;
}

const FilterSelect = (
  { label, options, value, setValue }: FilterSelectProps,
) => {
  return (
    <div className="flex-1">
      <Label htmlFor={label} className="block text-sm font-medium mb-1">
        {label}
      </Label>
      <Select onValueChange={setValue} defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelect;

