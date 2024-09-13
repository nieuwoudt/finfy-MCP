"use client";

import { Button } from "@/components/atoms";
import { resendCodeOTP } from "@/lib/supabase/actions";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect, FC, useTransition } from "react";
import toast from "react-hot-toast";

interface ResendCodeWithTimerProps {
  initialSeconds: number;
  phone: string;
}

const ResendCodeWithTimer: FC<ResendCodeWithTimerProps> = ({
  initialSeconds = 60,
  phone,
}) => {
  const [isPendingResend, startTransitionResend] = useTransition();
  const reset = () => {
    setSeconds(initialSeconds);
  };

  const getSavedTime = () => {
    const savedTime = localStorage.getItem("resendTimer");
    if (savedTime) {
      const remainingTime = Number(savedTime) - Date.now();
      if (remainingTime > 0) {
        return Math.floor(remainingTime / 1000);
      }
    }
    return initialSeconds;
  };
  const savedTime = getSavedTime();
  const [seconds, setSeconds] = useState(savedTime);
  const [isLoading, setIsLoading] = useState(Boolean(savedTime));

  const handleResendCode = async () => {
    startTransitionResend(async () => {
      const { errorMessage } = await resendCodeOTP(phone);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success("The code was sent again!");
      }
      reset();
      setIsLoading(true);
    });
  };

  useEffect(() => {
    if (seconds > 0) {
      localStorage.setItem(
        "resendTimer",
        (Date.now() + seconds * 1000).toString()
      );
    } else {
      localStorage.removeItem("resendTimer");
    }
  }, [seconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (seconds > 0) {
      if (!interval) {
        interval = setInterval(() => {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);
      }
      return () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };
    } else {
      setIsLoading(false);
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }
  }, [seconds, setIsLoading]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const time = formatTime(seconds);

  return (
    <>
      {isLoading ? (
        <div className="flex gap-1 mt-4">
          <span className="text-grey-15 text-sm">
            Resending the code is possible after
          </span>
          <span className="text-grey-15 text-sm">{time}</span>
        </div>
      ) : (
        <>
          {isPendingResend ? (
            <Loader2 className="animate-spin text-grey-15 w-5 h-5 mt-4" />
          ) : (
            <p className="text-sm text-grey-15 mt-4">
              Not seeing the code?{" "}
              <Button
                type="button"
                onClick={handleResendCode}
                className="inline-block p-0 text-sm text-grey-15 font-normal underline"
                variant="link"
              >
                Try again
              </Button>
            </p>
          )}
        </>
      )}
    </>
  );
};

export { ResendCodeWithTimer };
