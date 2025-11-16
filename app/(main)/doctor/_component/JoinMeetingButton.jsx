"use client";

import { generateVideoToken } from "@/actions/appointment";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function JoinMeetingButton({ appointmentId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const handleJoin = () => {
    startTransition(async () => {
      setErrorMessage(""); 
      try {
        const formData = new FormData();
        formData.append("appointmentId", appointmentId);

        const result = await generateVideoToken(formData);

        if (result.success) {
          router.push(
            `/video-call?sessionId=${result.videoSessionId}&token=${result.token}&appointmentId=${appointmentId}`
          );
        } else {
          setErrorMessage("Failed to generate video token.");
        }
      } catch (error) {
        setErrorMessage(error?.message || "Something went wrong.");
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleJoin}
        disabled={isPending}
        className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
      >
        {isPending ? "Joining..." : "Join Meeting"}
      </button>

      {errorMessage && (
        <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
