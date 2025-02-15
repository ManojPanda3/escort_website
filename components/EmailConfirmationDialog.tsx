"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface EmailConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  email: string; // Email is passed as a prop
  onResend?: () => Promise<void>; // Optional resend function
}

export function EmailConfirmationDialog({
  isOpen,
  onClose,
  email,
  onResend,
}: EmailConfirmationProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Use NodeJS.Timeout
  const supabase = createClientComponentClient();

  // Reset state when the dialog is opened or closed.  Crucial!
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setErrorMessage("");
      setCountdown(0); // Reset countdown on open
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Cleanup on close
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isOpen]);

  const handleResend = async () => {
    if (onResend) {
      // Use custom resend if provided
      setStatus("loading");
      setErrorMessage("");

      try {
        await onResend();
        setStatus("success");
      } catch (error: any) {
        setErrorMessage(
          error.message || "An error occurred while resending the email.",
        );
        setStatus("error");
      } finally {
        // Start countdown only after successful or failed resend
        startCountdown(60);
      }
    } else {
      // Fallback to Supabase resend
      setStatus("loading");
      setErrorMessage("");
      const { error } = await supabase.auth.resend({
        email: email,
        type: "signup", // VERY important. Use the correct type.
      });

      if (error) {
        setErrorMessage(
          error.message || "Failed to resend confirmation email.",
        );
        setStatus("error");
      } else {
        setStatus("success");
      }
      // Start countdown only after successful or failed resend
      startCountdown(60);
    }
  };

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear any existing interval
    }
    intervalRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalRef.current!); // Assert non-null
          intervalRef.current = null;
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  // No need for handleClose, use onClose directly

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check Your Email</DialogTitle>
          <DialogDescription>
            We've sent a confirmation email to{" "}
            <span className="font-semibold">{email}</span>. Please check your
            inbox (and spam folder) and click the link to confirm your email
            address.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Status Indicators */}
          {status === "loading" && (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending...</span>
            </div>
          )}
          {status === "success" && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Email resent successfully!</span>
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={countdown > 0 || status === "loading"}
            onClick={handleResend}
          >
            {countdown > 0 ? `Resend Email (${countdown}s)` : "Resend Email"}
          </Button>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
