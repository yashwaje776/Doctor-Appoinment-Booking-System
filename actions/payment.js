"use server";

import crypto from "crypto";
import { razorpay } from "@/lib/razorpay";
import { connectDB } from "@/lib/connectDB";
import Appointment from "@/models/Appointment";

export async function createPayment(amount, appointmentId) {
  console.log("SERVER → createPayment received:", { amount, appointmentId });

  await connectDB();

  try {
    if (!amount || !appointmentId) {
      console.log("❌ Missing amount or appointmentId");
      return { success: false, message: "Invalid payment data" };
    }

    const options = {
      amount: Number(amount) * 100, // Razorpay expects paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    console.log("SERVER → Razorpay Order Created:", order);

    return {
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return { success: false, message: "Server error" };
  }
}

export async function verifyPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  appointmentId,
}) {
  console.log("SERVER → verifyPayment received:", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    appointmentId,
  });

  await connectDB();

  try {
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.log("❌ Signature mismatch");
      return { success: false, message: "Payment verification failed" };
    }

    await Appointment.findByIdAndUpdate(appointmentId, {
      payment: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    console.log("SERVER → Payment Verified & Appointment Updated");

    return { success: true };
  } catch (error) {
    console.error("Verify Error:", error);
    return { success: false, message: "Server error" };
  }
}
