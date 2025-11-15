"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ViewDetailsModal({ appointment }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleJoin = () => {
    router.push(
      `/video-call?sessionId=${appointment.consultationLink}&token=${appointment.token}&appointmentId=${appointment._id}`
    );
  };

  if (!appointment) return null;

  return (
    <>
      <Button
        variant="outline"
        className="text-sm"
        onClick={() => setOpen(true)}
      >
        View Details
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Doctor:</strong> Dr. {appointment.doctorId?.user?.name}
            </p>
            {appointment.doctorId?.specialization && (
              <p>
                <strong>Specialization:</strong>{" "}
                {appointment.doctorId.specialization}
              </p>
            )}

            <p>
              <strong>Date:</strong> {appointment.date}
            </p>
            <p>
              <strong>Time:</strong> {appointment.time}
            </p>
            <p>
              <strong>Amount:</strong> ₹{appointment.amount}
            </p>
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>
            <p>
              <strong>Payment Status:</strong> {appointment.paymentStatus}
            </p>

            {appointment.status === "pending" && (
              <button
                onClick={handleJoin}
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Join Meeting
              </button>
            )}

            <p>
              <strong>Created At:</strong>{" "}
              {new Date(appointment.createdAt).toLocaleString()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
