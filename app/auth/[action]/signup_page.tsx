"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import UserDetailsForm from "@/components/signup/UserDetailsForm";
import EmailVerification from "@/components/signup/EmailVerification";
import ProfileImageUpload from "@/components/signup/ProfileImageUpload";
import InterestsServicesForm from "@/components/signup/InterestsServicesForm";
import AgeProofUpload from "@/components/signup/AgeProofUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { InterestSelector } from "@/components/interest-selector";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    userType: "general",
    gender: "",
    interest: "",
    locationId: "",
    age: "",
    profilePicture: null as File | null,
    coverImage: null as File | null,
    interests: [] as string[],
    services: [] as string[],
    ageProof1: null as File | null,
    ageProof2: null as File | null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([] as string[]);
  const [isInterestSelectorOpen, setIsInterestSelectorOpen] = useState(false);

  const totalSteps = formData.userType === "general" ? 4 : 5;
  const progress = (step / totalSteps) * 100;
  const userType = formData.userType;

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Sign up user with Supabase auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
          options: {
            data: { username: formData.username, type: formData.userType },
          },
        },
      );

      if (signUpError) throw signUpError;

      const userId = authData?.user?.id;
      if (!userId) throw new Error("Failed to get auth ID");

      // Create user profile
      const profileData = {
        email: formData.email,
        username: formData.username,
        userType: formData.userType,
        age: formData.age,
        interest: formData.interest,
        gender: formData.gender,
        location: formData.locationId,
        userId: userId,
        services: selectedServices,
      };

      const profileResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.message || "Failed to create user profile");
      }

      // Handle file uploads
      if (formData.profilePicture) {
        await uploadFile(formData.profilePicture, userId, "profile_picture");
      }
      if (formData.coverImage) {
        await uploadFile(formData.coverImage, userId, "cover_image");
      }
      if (
        formData.userType !== "general" && formData.ageProof1 &&
        formData.ageProof2
      ) {
        await uploadFile(formData.ageProof1, userId, "age_proof_1");
        await uploadFile(formData.ageProof2, userId, "age_proof_2");
      }

      // Redirect to login page or dashboard
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File, userId: string, fileType: string) => {
    const { error } = await supabase.storage.from("user_uploads").upload(
      `${userId}/${fileType}`,
      file,
    );

    if (error) throw error;
  };

  const handleSaveInterests = (interests: string[]) => {
    setSelectedServices(interests);
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setSelectedServices((prevServices) =>
      prevServices.filter((service) => service !== serviceToRemove)
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      <div className="bg-white dark:bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Sign Up
        </h2>
        <Progress value={progress} className="mb-4" />
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {step === 1 && (
          <UserDetailsForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <EmailVerification
            email={formData.email}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {step === 3 && (
          <ProfileImageUpload
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {step === 4 && (
          <InterestsServicesForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={formData.userType === "general" ? handleSubmit : handleNext}
            onPrevious={handlePrevious}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
          />
        )}
        {step === 5 && formData.userType !== "general" && (
          <AgeProofUpload
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
          />
        )}
        {userType !== "general" && (
          <div className="space-y-2">
            <Label htmlFor="interested_services">Interested Services</Label>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              onClick={() => setIsInterestSelectorOpen(true)}
            >
              {selectedServices.length > 0
                ? `${selectedServices.length} services selected`
                : "Select services"}
            </Button>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedServices.map((service) => (
                <Badge key={service} variant="secondary" className="px-2 py-1">
                  {service}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveService(service)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <InterestSelector
          isOpen={isInterestSelectorOpen}
          onClose={() => setIsInterestSelectorOpen(false)}
          selectedInterests={selectedServices}
          onSave={handleSaveInterests}
        />
      </div>
    </div>
  );
}

