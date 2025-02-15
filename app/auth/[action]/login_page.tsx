"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Eye, EyeOff, Plus, X } from "lucide-react";
import { useUser } from "../../../components/catch_user.tsx";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else {
      setTimeout(() => setIsLoading(false), 250);
      router.push("/profile");
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset link sent to your email!");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      {isLoading &&
        (
          <div className="w-full h-full fixed top-0-left-0 bg-transparent flex justify-center items-center before:w-full before:h-full before:fixed before:bg-black before:opacity-30 z-50">
            <LoadingSpinner />
          </div>
        )}
      <div className="bg-white dark:bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Login
        </h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && <Success>{success}</Success>}
        <form onSubmit={handleAuth} className="space-y-4 text-foreground">
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
          <PasswordInput
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black"
          >
            Login
          </Button>
        </form>
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
            onClick={handleResetPassword}
            className="text-amber-400 hover:text-amber-300"
          >
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
}
