"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CardTemplate } from "@/components/molecules";
import { Loader2 } from "lucide-react";

const CardConfirmEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      
      if (!token_hash || !type) {
        setStatus("error");
        setMessage("Invalid confirmation link. Please try signing up again.");
        return;
      }

      try {
        const response = await fetch(`/auth/confirm?token_hash=${token_hash}&type=${type}`);
        
        if (response.ok) {
          setStatus("success");
          setMessage("Email confirmed successfully! Redirecting to onboarding...");
          // The API will handle the redirect
        } else {
          const data = await response.json();
          setStatus("error");
          setMessage(data.error || "Failed to confirm email. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred. Please try again later.");
      }
    };

    confirmEmail();
  }, [searchParams]);

  const getTitle = () => {
    switch (status) {
      case "success":
        return "Email Confirmed";
      case "error":
        return "Confirmation Failed";
      default:
        return "Confirming Email";
    }
  };

  const getDescription = () => {
    if (message) return message;
    return "Please wait while we confirm your email...";
  };

  return (
    <CardTemplate
      title={getTitle()}
      description={getDescription()}
    >
      {status === "loading" && (
        <div className="flex justify-center mt-4">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </CardTemplate>
  );
};

export { CardConfirmEmail };
