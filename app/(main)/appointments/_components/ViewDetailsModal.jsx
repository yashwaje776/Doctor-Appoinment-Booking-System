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

  if (!appointment) return null;

  const dateStr = appointment.date;
  const timeStr = appointment.time;

  const appointmentDateTime = new Date(`${dateStr}T${timeStr}:00`);
  const now = new Date();

  const diffMs = appointmentDateTime - now;
  const diffMinutes = diffMs / (1000 * 60);

  const canJoin = diffMinutes <= 30 && diffMinutes > -60;

  const handleJoin = () => {
    router.push(
      `/video-call?sessionId=${appointment.consultationLink}&token=${appointment.videoSessionToken}&appointmentId=${appointment._id}`
    );
  };

  return (
    <>
      <Button
        variant="outline"
        className="text-sm rounded-lg"
        onClick={() => setOpen(true)}
      >
        View Details
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Appointment Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm mt-2">
            <div className="p-3 bg-muted/40 rounded-lg">
              <p className="font-medium">
                👨‍⚕️ Dr. {appointment.doctorId?.user?.name}
              </p>
              {appointment.doctorId?.specialization && (
                <p className="text-muted-foreground">
                  {appointment.doctorId.specialization}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold">
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-semibold">{appointment.time}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Consultation Fee</p>
              <p className="font-semibold">₹{appointment.amount}</p>
            </div>

            <div className="flex gap-2">
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  appointment.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Status: {appointment.status}
              </span>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  appointment.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Payment: {appointment.paymentStatus}
              </span>
            </div>

            {canJoin ? (
              <Button
                onClick={handleJoin}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              >
                Join Meeting
              </Button>
            ) : (
              <p className="text-xs text-center text-muted-foreground">
                🔒 You can join the meeting 30 minutes before the appointment.
              </p>
            )}

            <p className="text-xs text-muted-foreground text-center pt-2">
              Created At:{" "}
              {new Date(appointment.createdAt).toLocaleString()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
