import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import type React from "react"; // Added import for React

interface AgeProofUploadProps {
  formData: {
    ageProof1: File | null;
    ageProof2: File | null;
  };
  updateFormData: (data: Partial<AgeProofUploadProps["formData"]>) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  setError: () => void;
}

export default function AgeProofUpload(
  { formData, updateFormData, onSubmit, onPrevious, setError }:
    AgeProofUploadProps,
) {
  const ageProof1Ref = useRef<HTMLInputElement>(null);
  const ageProof2Ref = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "ageProof1" | "ageProof2",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateFormData({ [field]: file });
  };

  const removeFile = (field: "ageProof1" | "ageProof2") => {
    updateFormData({ [field]: null });
  };

  return (
    <div className="space-y-4">
      <p>Please upload two forms of age verification:</p>

      <div className="space-y-2">
        <Label>Age Proof 1</Label>
        <div className="flex items-center gap-4 relative h-40 bg-gray-200 rounded-md">
          {formData.ageProof1
            ? (
              <>
                <Image
                  src={URL.createObjectURL(formData.ageProof1) ||
                    "/placeholder.svg"}
                  alt="Age Proof 1"
                  fill
                  className="object-cover rounded-md"
                />
                <Button
                  type="button"
                  onClick={() => removeFile("ageProof1")}
                  className="absolute top-2 right-2 p-1"
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )
            : (
              <div className="w-full h-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
            )}
          <Input
            type="file"
            accept="image/*"
            ref={ageProof1Ref}
            onChange={(e) => handleFileUpload(e, "ageProof1")}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => ageProof1Ref.current?.click()}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          >
            Upload Age Proof 1
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Age Proof 2</Label>
        <div className="flex items-center gap-4 relative h-40 bg-gray-200 rounded-md">
          {formData.ageProof2
            ? (
              <>
                <Image
                  src={URL.createObjectURL(formData.ageProof2) ||
                    "/placeholder.svg"}
                  alt="Age Proof 2"
                  fill
                  className="object-cover rounded-md"
                />
                <Button
                  type="button"
                  onClick={() => removeFile("ageProof2")}
                  className="absolute top-2 right-2 p-1"
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )
            : (
              <div className="w-full h-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
            )}
          <Input
            type="file"
            accept="image/*"
            ref={ageProof2Ref}
            onChange={(e) => handleFileUpload(e, "ageProof2")}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => ageProof2Ref.current?.click()}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          >
            Upload Age Proof 2
          </Button>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!formData.ageProof1 || !formData.ageProof2}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
