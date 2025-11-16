"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import JoinMeetingButton from "./JoinMeetingButton";

export default function AppointmentDetails({ appointment }) {
  const [open, setOpen] = useState(false);

  const canJoinMeeting = useMemo(() => {
    if (appointment.status !== "pending") return false;

    const dateStr = appointment.date; 
    const timeStr = appointment.time; 

    const appointmentDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const now = new Date();

    const diffMs = appointmentDateTime - now;
    const diffMinutes = diffMs / (1000 * 60);

    return diffMinutes <= 30 && diffMinutes > -60; 
  }, [appointment]);

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <p>
              <strong>Patient:</strong> {appointment.patientId?.name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointment.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {appointment.time}
            </p>
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>
            <p>
              <strong>Amount:</strong> Rs {appointment.amount}
            </p>
            <p>
              <strong>Payment:</strong> {appointment.paymentStatus}
            </p>

            {canJoinMeeting && (
              <JoinMeetingButton appointmentId={appointment._id} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
