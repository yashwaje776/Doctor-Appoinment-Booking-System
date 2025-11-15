"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import { connectDB } from "@/lib/connectDB";

export async function checkAdmin() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return null;

  const user = await User.findOne({ clerkUserId: userId }).lean();

  if (!user || user.role !== "ADMIN") return null;

  return {
    ...user,
    _id: user._id.toString(),
  };
}

export async function getPendingDoctors() {
  await connectDB();

  const admin = await checkAdmin();
  if (!admin) throw new Error("Unauthorized: Admin access required");

  const pendingDoctors = await Doctor.find({
    verificationStatus: "PENDING",
  })
    .populate("user", "name email imageUrl")
    .lean(); 
  return pendingDoctors.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    user: doc.user
      ? {
          ...doc.user,
          _id: doc.user._id.toString(),
        }
      : null,
  }));
}

export async function updateVerification(formData) {
  await connectDB();

  const admin = await checkAdmin();
  if (!admin) throw new Error("Unauthorized: Admin access required");

  const doctorId = formData.get("doctorId");
  const status = formData.get("status");

  if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
    throw new Error("Invalid verification request");
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  doctor.verificationStatus = status;
  await doctor.save();

  if (status === "VERIFIED") {
    await User.findByIdAndUpdate(doctor.user, { role: "DOCTOR" });
  }

  revalidatePath("/admin");

  return {
    success: true,
    message: `Doctor ${status.toLowerCase()} successfully`,
  };
}

export async function getVerifiedDoctors() {
  await connectDB();

  const admin = await checkAdmin();
  if (!admin) throw new Error("Unauthorized: Admin access required");

  const doctors = await Doctor.find({
    verificationStatus: "VERIFIED",
  })
    .populate("user", "name email imageUrl role")
    .lean();

  return doctors.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    user: doc.user
      ? {
          ...doc.user,
          _id: doc.user._id.toString(),
        }
      : null,
  }));
}

export async function getAllPatients() {
  await connectDB();

  const admin = await checkAdmin();
  if (!admin) throw new Error("Unauthorized: Admin access required");

  const patients = await User.find({ role: "PATIENT" }).lean();

  return patients.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));
}
