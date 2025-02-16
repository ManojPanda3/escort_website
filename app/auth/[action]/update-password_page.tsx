"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading";
import { PasswordInput } from "@/components/password-input";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        router.push("/auth/login");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      {isLoading && (
        <div className="w-full h-full fixed top-0 left-0 bg-transparent flex justify-center items-center before:w-full before:h-full before:fixed before:bg-black before:opacity-30 z-50">
          <LoadingSpinner />
        </div>
      )}
      <div className="bg-white dark:bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Update Password
        </h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Password updated successfully! You can now login.
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleUpdatePassword}
          className="space-y-4 text-foreground"
        >
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <PasswordInput
              password={newPassword}
              setPassword={setNewPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              id="new-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
