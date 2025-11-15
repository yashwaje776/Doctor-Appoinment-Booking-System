"use server";

import { connectDB } from "@/lib/connectDB";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function vailduser() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return null;

  const user = await User.findOne({ clerkUserId: userId }).lean();

  if (!user || user.role !== "PATIENT") return null;

  return {
    ...user,
    _id: user._id.toString(),
  };
}

export async function getUserAppointment() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return [];

  const user = await User.findOne({ clerkUserId: userId }).lean();
  if (!user) return [];

  const appointments = await Appointment.find({
    patientId: user._id,
  })
    .populate({
      path: "doctorId",
      model: "Doctor",
      populate: { path: "user", model: "User" },
    })
    .sort({ createdAt: -1 })
    .lean();

  return appointments;
}

export async function cancelAppointment(appointmentId) {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };

  const appointment = await Appointment.findById(appointmentId).populate("patientId");
  if (!appointment) return { success: false, message: "Appointment not found" };

  if (appointment.patientId.clerkUserId !== userId)
    return { success: false, message: "Unauthorized" };

  if (appointment.status === "completed")
    return { success: false, message: "Cannot cancel completed appointment" };

  appointment.status = "cancelled";
  await appointment.save();

  return { success: true };
}

export async function retryPayment(appointmentId, amount) {
  try {
    const order = await createPayment(amount, appointmentId);
    if (!order.success) {
      return { success: false, message: "Payment creation failed!" };
    }

    return order;
  } catch (err) {
    return { success: false, message: "Retry failed" };
  }
}

