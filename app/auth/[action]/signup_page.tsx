// app/auth/[action]/signup_page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AlertCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading";
import { uploadToStorage } from "@/lib/storage";
import { PasswordInput } from "@/components/password-input";
import { EmailConfirmationDialog } from "@/components/EmailConfirmationDialog";
import type { Database } from "@/types/supabase";

interface FileUploadHandlerProps {
  fileNumber: 1 | 2;
  fileTitle: string;
  preview: string | null;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    fileNumber: 1 | 2,
  ) => void;
  handleDeleteFile: (fileNumber: 1 | 2) => void;
  uploaderRef: React.RefObject<HTMLInputElement | null>;
}

function FileUploadHandler({
  fileNumber,
  fileTitle,
  preview,
  handleFileChange,
  handleDeleteFile,
  uploaderRef,
}: FileUploadHandlerProps) {
  return (
    <div>
      <Label htmlFor={`ageProof${fileNumber}`}>{fileTitle}</Label>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        {preview
          ? (
            <div className="relative">
              <img
                src={preview}
                alt={`Age Proof ${fileNumber}`}
                className="max-h-40 rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteFile(fileNumber)}
                className="absolute top-0 right-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
          : (
            <div
              className="space-y-1 text-center cursor-pointer"
              onClick={() => uploaderRef.current?.click()}
            >
              <Plus className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor={`ageProof${fileNumber}`}
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    ref={uploaderRef}
                    id={`ageProof${fileNumber}`}
                    name={`ageProof${fileNumber}`}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e, fileNumber)}
                  />
                  <p className="pl-1">or drag and drop</p>
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const uploader1 = useRef<HTMLInputElement>(null);
  const uploader2 = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    userType: "general" as
      | "general"
      | "escort"
      | "bdsm"
      | "couple",
    age: "",
    agreeToTerms: false,
    gender: "" as "male" | "female" | "other",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAgeProofDialogOpen, setIsAgeProofDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [ageProofFile1, setAgeProofFile1] = useState<File | null>(null);
  const [ageProofFile2, setAgeProofFile2] = useState<File | null>(null);
  const [ageProofPreview1, setAgeProofPreview1] = useState<string | null>(null);
  const [ageProofPreview2, setAgeProofPreview2] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileNumber: 1 | 2,
  ) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setError(`File ${fileNumber} must be an image`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(`File ${fileNumber} size should be less than 5MB`);
      return;
    }

    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Error processing image, no context");
        return;
      }

      let width = img.width;
      let height = img.height;
      const maxHeight = 480;

      if (height > maxHeight) {
        width = Math.floor(width * (maxHeight / height));
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const webpBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => blob && resolve(blob), "image/webp");
        });

        const optimizedFile = new File(
          [webpBlob],
          file.name.replace(/\.[^/.]+$/, ".webp"),
          { type: "image/webp" },
        );

        const reader = new FileReader();
        reader.onloadend = () => {
          if (fileNumber === 1) {
            setAgeProofFile1(optimizedFile);
            setAgeProofPreview1(reader.result as string);
          } else {
            setAgeProofFile2(optimizedFile);
            setAgeProofPreview2(reader.result as string);
          }
          setError("");
        };
        reader.readAsDataURL(optimizedFile);
      } catch (err) {
        setError("Error processing image");
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDeleteFile = (fileNumber: 1 | 2) => {
    if (fileNumber === 1) {
      setAgeProofFile1(null);
      setAgeProofPreview1(null);
      if (uploader1.current) uploader1.current.value = "";
    } else {
      setAgeProofFile2(null);
      setAgeProofPreview2(null);
      if (uploader2.current) uploader2.current.value = "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };


  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    let userIdForCleanup: string | null = null;

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      setIsLoading(false);
      return;
    }
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .or(`email.eq.${formData.email},username.eq.${formData.username}`);

      if (userData?.length) {
        setError(
          userData[0].email === formData.email
            ? "Email already exists"
            : "Username already exists",
        );
        setIsLoading(false);
        return;
      }

      const { email, password, username, userType, age, gender } = formData;


      const { data: authData, error: signUpError } = await supabase.auth
        .signUp({
          email,
          password,
          options: {
            data: { username, type: userType },
            redirectTo: `${window.location.origin}/api/auth/verify`,
          },
        });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        setError("Failed to get auth ID");
        setIsLoading(false);
        return;
      }

      userIdForCleanup = userId;

      const profileFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          profileFormData.append(key, value.toString());
        }
      });
      profileFormData.append("userId", userId);

      const profileResponse = await fetch("/api/auth/signup", {
        method: "POST",
        body: profileFormData,
      });

      const profileData = await profileResponse.json(); // Get JSON data *before* checking status

      if (profileResponse.status !== 200 || !profileData.success) { // Use status code and .success
        setError(profileData.message || "Failed to create user profile");
        setIsLoading(false);
        return;
      }



      if (userType !== "general" && ageProofFile1 && ageProofFile2) {
        const [upload1, upload2] = await Promise.all([
          uploadToStorage(ageProofFile1, userId),
          uploadToStorage(ageProofFile2, userId),
        ]);

        if (!upload1.success || !upload2.success) {
          throw new Error(upload1.error || upload2.error);
        }

        const ageProofResponse = await fetch("/api/ageProofUpload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age_proofs: [upload1.fileUrl, upload2.fileUrl],
            username,
            email,
            userId,
          }),
        });
         const ageProofData = await ageProofResponse.json();

        if (ageProofResponse.status !== 200 || !ageProofData.success) {
            setError(ageProofData.message || "Failed to upload age proof");
            setIsLoading(false);
            return;
        }
      }

      setIsConfirmationOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (formData.email) {
      const { error } = await supabase.auth.resend({
        email: formData.email,
        type: "signup",
      });
      if (error) {
        setError(error.message || "Failed to resend email");
      }
    } else {
      setError("Email is required to resend confirmation.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <LoadingSpinner />
        </div>
      )}

      <EmailConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          router.push("/auth/login");
        }}
        email={formData.email}
        onResend={handleResendEmail}
      />

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-background/80 backdrop-blur-sm">
        <h2 className="mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-center text-3xl font-bold text-transparent">
          Sign Up
        </h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleAuth} className="space-y-4 text-foreground">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <PasswordInput
            password={formData.password}
            setPassword={(value) =>
              setFormData((prev) => ({ ...prev, password: value }))}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="userType">User Type</Label>
            <Select
              name="userType"
              value={formData.userType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  userType: value as
                    | "general"
                    | "escort"
                    | "bdsm"
                    | "couple"
                    | "content creator",
                }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="escort">Escort</SelectItem>
                <SelectItem value="bdsm">BDSM</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  gender: value as "male" | "female" | "other",
                }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.userType !== "general" && (
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                name="age"
                min="18"
                max="200"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {formData.userType !== "general" && (
            <div>
              <Label htmlFor="ageProof">Age Proof</Label>
              <Dialog
                open={isAgeProofDialogOpen}
                onOpenChange={setIsAgeProofDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Upload Age Proof
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Age Proof</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <FileUploadHandler
                      fileNumber={1}
                      fileTitle="Upload your ID card"
                      preview={ageProofPreview1}
                      handleFileChange={handleFileChange}
                      handleDeleteFile={handleDeleteFile}
                      uploaderRef={uploader1}
                    />
                    <FileUploadHandler
                      fileNumber={2}
                      fileTitle="Upload your photo"
                      preview={ageProofPreview2}
                      handleFileChange={handleFileChange}
                      handleDeleteFile={handleDeleteFile}
                      uploaderRef={uploader2}
                    />
                  </div>
                  <Button
                    onClick={() => setIsAgeProofDialogOpen(false)}
                    className="mt-4"
                  >
                    Done
                  </Button>
                </DialogContent>
              </Dialog>
              {(ageProofPreview1 || ageProofPreview2) && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {ageProofPreview1 && ageProofPreview2
                    ? "Both files uploaded"
                    : "One file uploaded"}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  agreeToTerms: checked as boolean,
                }))}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms_and_conditions" className="text-blue-500">
                Terms & Conditions
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-amber-400 hover:text-amber-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
