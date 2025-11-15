"use server";
import { connectDB } from "@/lib/connectDB";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";

export async function checkDoctor() {
  await connectDB();

  const { userId } = await auth();

  if (!userId) return null;

  const user = await User.findOne({ clerkUserId: userId })
    .populate("doctor")
    .lean();

  if (!user || user.role !== "DOCTOR") return null;

  return {
    ...user,
    _id: user._id.toString(),
  };
}

export async function getPendingAppointments() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return [];

  const user = await User.findOne({ clerkUserId: userId }).lean();

  if (!user || user.role !== "DOCTOR") return [];

  return await Appointment.find({
    doctorId: user.doctor,
    status: { $in: ["pending", "confirmed"] },
  })
    .populate("patientId")
    .lean();
}

export async function getCompletedAppointments() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return [];

  const user = await User.findOne({ clerkUserId: userId })
    .populate("doctor")
    .lean();

  if (!user || user.role !== "DOCTOR") return [];

  return await Appointment.find({
    doctorId: user.doctor._id,
    status: "completed",
  })
    .populate("patientId")
    .lean();
}
export async function getDoctorDashboardStats() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return null;

  const user = await User.findOne({ clerkUserId: userId }).lean();
  if (!user || user.role !== "DOCTOR") return null;

  const doctorId = user.doctor;

  const [completedCount, pendingCount, earningsData] = await Promise.all([
    Appointment.countDocuments({
      doctorId,
      status: "completed",
    }),

    Appointment.countDocuments({
      doctorId,
      status: { $in: ["pending", "confirmed"] },
    }),

    Appointment.aggregate([
      {
        $match: {
          doctorId,
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const earnings = earningsData.length > 0 ? earningsData[0].total : 0;

  return {
    completedCount,
    pendingCount,
    totalAppointments: completedCount + pendingCount,
    earnings,
  };
}

export async function getEarnings() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return 0;

  const user = await User.findOne({ clerkUserId: userId }).lean();

  if (!user || user.role !== "DOCTOR") return 0;

  const earnings = await Appointment.aggregate([
    {
      $match: {
        doctorId: user.doctor,
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$amount" },
      },
    },
  ]);

  return earnings.length > 0 ? earnings[0].totalEarnings : 0;
}
export async function setAvailability(availability) {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return null;

  const user = await User.findOne({ clerkUserId: userId }).populate("doctor");

  if (!user || user.role !== "DOCTOR") return null;

  user.doctor.availability = {
    start: availability.start,
    end: availability.end,
  };

  await user.doctor.save();

  return {
    message: "Availability updated successfully",
    availability: user.doctor.availability,
  };
}
