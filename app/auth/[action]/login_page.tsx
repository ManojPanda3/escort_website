// app/auth/login/page.tsx
"use client";

import { useEffect, useState } from "react"; // Import useEffect
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading";
import { Success } from "@/components/ui/success";
import { PasswordInput } from "@/components/password-input.tsx";
import type { Database } from "@/types/supabase"; // Import Database type
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false); // Track reset mode
  const searchParams = useSearchParams(); // Get query parameters

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      // Attempt to get the user session (it should be set by the verify route)
      supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (user) {
          // User is already authenticated, redirect to profile
          router.push("/profile");
        } else if (error) {
          setError("Verification failed. Please try logging in manually.");
        } else {
          setError(
            "Verification failed, No User. Please try logging in manually.",
          );
        }
      });
    }
  }, [searchParams, supabase, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => { // Changed to form event
    e.preventDefault(); // Prevent default form submission
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/update-password`, // IMPORTANT: Redirect URL
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password reset link sent to your email!");
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
        <div className="w-full h-full fixed top-0-left-0 bg-transparent flex justify-center items-center before:w-full before:h-full before:fixed before:bg-black before:opacity-30 z-50">
          <LoadingSpinner />
        </div>
      )}
      <div className="bg-white dark:bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          {isResetMode ? "Reset Password" : "Login"}
        </h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && <Success>{success}</Success>}

        <form
          onSubmit={isResetMode ? handleResetPassword : handleLogin} // Use correct handler
          className="space-y-4 text-foreground"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!isResetMode && (
            <PasswordInput
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          )}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black"
          >
            {isResetMode ? "Reset Password" : "Login"}
          </Button>
        </form>

        {isResetMode
          ? (
            <p className="mt-4 text-center">
              Remember your password?{" "}
              <button
                onClick={() => setIsResetMode(false)}
                className="text-amber-400 hover:text-amber-300"
              >
                Back to Login
              </button>
            </p>
          )
          : (
            <>
              <p className="mt-4 text-center">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-amber-400 hover:text-amber-300"
                >
                  Sign Up
                </Link>
              </p>

              <p className="mt-2 text-center">
                <button
                  onClick={() => setIsResetMode(true)}
                  className="text-amber-400 hover:text-amber-300"
                >
                  Forgot Password?
                </button>
              </p>
            </>
          )}
      </div>
    </div>
  );
}

