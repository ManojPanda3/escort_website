"use client";

import { useEffect, useState } from "react";

const RESEND_INTERVAL: number = 60;

const ResendVerificationEmailButton = ({
  onClick,
  email,
}: {
  onClick: (email: string) => void;
  email: string;
}) => {
  const [resendTimeLeft, setResendTimeLeft] = useState(RESEND_INTERVAL);

  useEffect(() => {
    const interval_id = setInterval(() => {
      if (resendTimeLeft > 0) {
        setResendTimeLeft((n) => n - 1);
      } else {
        clearInterval(interval_id);
      }
    }, 1000);

    return () => clearInterval(interval_id);
  }, [resendTimeLeft]); // Add resendTimeLeft as a dependency

  return (
    <div
      onClick={() => {
        if (resendTimeLeft === 0) {
          onClick(email);
          setResendTimeLeft(RESEND_INTERVAL); // Reset the timer after clicking
        }
      }}
      className="text-primary bg-transparent text-sm px-1 pt-2 hover:opacity-90 cursor-pointer"
    >
      {resendTimeLeft === 0 ? <span>Resend Verification Email</span> : (
        <span>
          Your OTP has been sent, next OTP could be sent after{" "}
          {getTime(resendTimeLeft)}
        </span>
      )}
    </div>
  );
};

function getTime(time: number): string {
  const minute = Math.floor(time / 60);
  const second = time % 60;
  return `${minute.toString().padStart(2, "0")}:${
    second.toString().padStart(2, "0")
  }`;
}

export default ResendVerificationEmailButton;

