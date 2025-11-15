"use client";

import { cancelAppointment, completeAppointment } from "@/actions/appointment";
import { useTransition } from "react";
import { toast } from "sonner";

export default function AppointmentActions({ appointmentId }) {
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      const res = await completeAppointment(appointmentId);
      toast(res.message);
    });
  }

  function handleCancel() {
    startTransition(async () => {
      const res = await cancelAppointment(appointmentId);
      toast(res.message);
    });
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleComplete}
        disabled={isPending}
        className="px-3 py-1 rounded bg-green-600 text-white text-sm disabled:opacity-50"
      >
        {isPending ? "..." : "Complete"}
      </button>

      {/* CANCEL */}
      <button
        onClick={handleCancel}
        disabled={isPending}
        className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-50"
      >
        {isPending ? "..." : "Cancel"}
      </button>
    </div>
  );
}
