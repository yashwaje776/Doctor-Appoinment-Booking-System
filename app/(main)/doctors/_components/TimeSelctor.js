"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { bookAppointment, markPaymentPaid } from "@/actions/appointment";
import { createPayment, verifyPayment } from "@/actions/payment";

import BookingFormModal from "./BookingFormModal";

export default function TimeSelector({ docInfo, user }) {
  const availability = docInfo.availability;
  const todayStr = new Date().toISOString().split("T")[0];

  // Generate next 7 days
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      arr.push({
        date: d.toISOString().split("T")[0],
        label: format(d, "MMM d"),
        display: format(d, "EEEE, MMM d"),
        weekday: format(d, "EEE"),
      });
    }
    return arr;
  }, []);

  const [activeDate, setActiveDate] = useState(days[0].date);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ⭐ Generate Slots & Remove Booked Slots
  const slots = useMemo(() => {
    let s = [];

    // Get booked slots for selected day
    const bookedForDay = docInfo.slots_booked?.[activeDate] || [];

    let [hour, minute] = availability.start.split(":").map(Number);
    const [endHour, endMinute] = availability.end.split(":").map(Number);

    const now = new Date();

    while (hour < endHour || (hour === endHour && minute <= endMinute)) {
      const t = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;

      const slotDateTime = new Date(`${activeDate}T${t}`);
      const isPast = activeDate === todayStr && slotDateTime < now;
      const isBooked = bookedForDay.includes(t);

      if (!isPast && !isBooked) {
        s.push({
          startTime: `${activeDate}T${t}:00`,
          display: t,
          fee: docInfo.fees,
        });
      }

      minute += 30;
      if (minute >= 60) {
        hour++;
        minute = 0;
      }
    }

    return s;
  }, [activeDate, availability, docInfo.fees, docInfo.slots_booked]);

  // Open modal only if slot selected
  const handleContinue = () => {
    if (!selectedSlot) return toast.error("Please select a time!");
    setModalOpen(true);
  };

  // Confirm booking & handle payment
  const confirmBooking = async (description) => {
    try {
      const booking = await bookAppointment({
        doctorId: docInfo._id,
        patientId: user._id,
        date: activeDate,
        time: selectedSlot.display,
        description,
        amount: docInfo.fees,
      });

      if (!booking.success) return toast.error(booking.message);

      const appointmentId = booking.appointment._id;

      // Create payment order
      const order = await createPayment(docInfo.fees, appointmentId);
      if (!order.success) return toast.error("Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Doctor Appointment",
        order_id: order.id,

        handler: async function (response) {
          const verify = await verifyPayment({
            ...response,
            appointmentId,
          });

          if (!verify.success)
            return toast.error("Payment verification failed");

          await markPaymentPaid({
            appointmentId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          });

          toast.success("Payment Successful!");
        },

        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },

        theme: { color: "#22c55e" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  // UI Rendering
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 mt-6 text-white space-y-6">
      <h2 className="text-xl font-semibold">Book Appointment</h2>

      <Tabs defaultValue={activeDate} onValueChange={setActiveDate}>
        <TabsList className="w-full justify-start overflow-x-auto p-2">
          {days.map((day) => (
            <TabsTrigger
              key={day.date}
              value={day.date}
              className="flex gap-2 p-2"
            >
              <div className="opacity-80">{day.label}</div>
              <div>({day.weekday})</div>
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => (
          <TabsContent key={day.date} value={day.date} className="pt-4">
            <h3 className="text-lg font-medium mb-2">{day.display}</h3>

            {slots.length === 0 ? (
              <p className="text-neutral-500 py-8 text-center">
                No Slots Available
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <Card
                    key={slot.startTime}
                    onClick={() => setSelectedSlot(slot)}
                    className={`cursor-pointer border-neutral-700 transition-all ${
                      selectedSlot?.startTime === slot.startTime
                        ? "bg-emerald-900/30 border-emerald-600"
                        : "hover:border-emerald-700/40"
                    }`}
                  >
                    <CardContent className="p-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{format(new Date(slot.startTime), "h:mm a")}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={!selectedSlot}
          onClick={handleContinue}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <BookingFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slot={selectedSlot}
        onConfirm={confirmBooking}
      />
    </div>
  );
}
