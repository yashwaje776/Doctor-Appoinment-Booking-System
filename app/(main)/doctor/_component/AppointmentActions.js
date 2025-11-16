"use client";

import { cancelAppointment, completeAppointment } from "@/actions/appointment";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function AppointmentActions({ appointmentId }) {
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      try {
        const res = await completeAppointment(appointmentId);

        if (res?.success) {
          toast.success(res.message || "Appointment marked complete.");
        } else {
          toast.error(res?.message || "Failed to complete appointment.");
        }
      } catch (error) {
        toast.error(error?.message || "Something went wrong.");
      }
    });
  }

  function handleCancel() {
    startTransition(async () => {
      try {
        const res = await cancelAppointment(appointmentId);

        if (res?.success) {
          toast.success(res.message || "Appointment cancelled.");
        } else {
          toast.error(res?.message || "Failed to cancel appointment.");
        }
      } catch (error) {
        toast.error(error?.message || "Something went wrong.");
      }
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
