"use client";

import { generateVideoToken } from "@/actions/appointment";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function JoinMeetingButton({ appointmentId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("appointmentId", appointmentId);

        const result = await generateVideoToken(formData);
        console.log(result)

        if (result.success) {
          router.push(
            `/video-call?sessionId=${result.videoSessionId}&token=${result.token}&appointmentId=${appointmentId}`
          );
        }
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  };

  return (
    <button
      onClick={handleJoin}
      disabled={isPending}
      className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
    >
      {isPending ? "Joining..." : "Join Meeting"}
    </button>
  );
}
