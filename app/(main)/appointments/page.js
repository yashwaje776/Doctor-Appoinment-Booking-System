"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getUserAppointment } from "@/actions/user";
import { cancelAppointment } from "@/actions/user";
import { retryPayment } from "@/actions/user";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createPayment, verifyPayment } from "@/actions/payment";
import { markPaymentPaid } from "@/actions/appointment";
import ViewDetailsModal from "./_components/ViewDetailsModal";

export default function MyAppointmentsPage() {
  const [filter, setFilter] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    setLoading(true);
    const data = await getUserAppointment();
    setAppointments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id) => {
    const res = await cancelAppointment(id);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Appointment Cancelled!");
    loadAppointments();
  };

  const handleRetry = async (app) => {
    const appointmentId = app._id;

    const order = await createPayment(app.amount, appointmentId);
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

        if (!verify.success) return toast.error("Payment verification failed");

        await markPaymentPaid({
          appointmentId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
        });

        toast.success("Payment Successful!");
      },
      prefill: {},
      theme: { color: "#22c55e" },
    };

    new window.Razorpay(options).open();
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filter === "completed") return app.status === "completed";
    if (filter === "cancelled") return app.status === "cancelled";
    return app.status === "pending" || app.status === "confirmed";
  });

  if (loading)
    return (
      <div className="py-16 text-center text-xl">Loading appointments...</div>
    );

  return (
    <div className="py-16 container mx-auto px-4 space-y-8">
      <h1 className="text-2xl font-bold">My Appointments</h1>

      <div className="flex gap-3">
        {["upcoming", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded font-medium capitalize ${
              filter === tab
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredAppointments.length === 0 && (
          <p className="text-muted-foreground">No appointments found.</p>
        )}

        {filteredAppointments.map((app) => (
          <Card key={app._id} className="shadow-sm border">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">
                    Dr. {app.doctorId?.user?.name}
                  </h2>
                  {app.doctorId?.specialization && (
                    <p className="text-sm text-muted-foreground">
                      {app.doctorId.specialization}
                    </p>
                  )}
                </div>

                <Badge
                  variant={
                    app.status === "completed"
                      ? "success"
                      : app.status === "cancelled"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {app.status}
                </Badge>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <b>Date:</b> {app.date}
                </p>
                <p>
                  <b>Time:</b> {app.time}
                </p>
                <p>
                  <b>Amount:</b> ₹{app.amount}
                </p>
              </div>
               
              <div className="flex gap-3">
               <ViewDetailsModal appointment={app} />
                {(app.status === "pending" || app.status === "confirmed") && (
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                )}

                {app.paymentStatus === "pending" && (
                  <button
                    onClick={() => handleRetry(app)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-black rounded"
                  >
                    Retry Payment
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
