"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Calendar, Clock, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function BookingFormModal({
  open,
  onClose,
  slot,
  onConfirm
}) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await onConfirm(description);

    setLoading(false);
  };

  if (!slot) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Confirm Appointment
          </DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-white font-medium">
                {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
              </span>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-white">
                {format(new Date(slot.startTime), "h:mm a")}
              </span>
            </div>

            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-muted-foreground">
                Cost:{" "}
                <span className="text-white font-medium">₹  {slot.fee}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="Describe your medical concern..."
              className="bg-background border-emerald-900/20 h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-emerald-900/30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Change Slot
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
