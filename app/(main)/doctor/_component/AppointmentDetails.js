"use client";

import { useState } from "react";
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

            {appointment.status === "pending" && (
              <JoinMeetingButton appointmentId={appointment._id} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
