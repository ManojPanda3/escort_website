import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ResendVerificationEmailButton from "./ResendVerificationEmail_btn";

interface EmailVerificationProps {
  email: string;
  onNext: () => void;
  onPrevious: () => void;
  setError: () => void;
}

export default function EmailVerification(
  { email, onNext, onPrevious, setError, setIsVerified, isVerified }:
    EmailVerificationProps,
) {
  const [verificationCode, setVerificationCode] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setIsVerified(true);
      }
    };

    checkVerificationStatus();
    const interval = setInterval(checkVerificationStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [supabase.auth]);

  const handleEmailResend = async (email: string) => {
    const emailResend = await supabase.auth.resend({
      type: "signup",
      email: email,
    });
  };

  const handleVerify = async () => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: "signup",
      });

      if (error) throw error;

      setIsVerified(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isVerified) {
    return (
      <div className="text-center">
        <p className="mb-4">Email verified successfully!</p>
        <Button onClick={onNext}>Next</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p>Please check your email for a verification code and enter it below:</p>
      <div>
        <Label htmlFor="verificationCode">Verification Code</Label>
        <Input
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <ResendVerificationEmailButton
          onClick={handleEmailResend}
          email={email}
        />
      </div>
      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button onClick={handleVerify}>Verify</Button>
      </div>
    </div>
  );
}
