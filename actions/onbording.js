"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import { connectDB } from "@/lib/connectDB";

export async function setUserRole(formData) {
  await connectDB();

  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await User.findOne({ clerkUserId: userId });

  if (!user) throw new Error("User not found in the database");

  const role = formData.get("role");

  if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
    throw new Error("Invalid role selection");
  }

  try {
   
    if (role === "PATIENT") {
      user.role = "PATIENT";
      await user.save();

      revalidatePath("/");
      return { success: true, redirect: "/doctors" };
    }

    if (role === "DOCTOR") {
      const speciality = formData.get("speciality");
      const experience = Number(formData.get("experience"));
      const degree = formData.get("degree");
      const about = formData.get("about");
      const fees = Number(formData.get("fees"));

      if (!speciality || !experience || !degree || !about || !fees) {
        throw new Error("All doctor fields are required");
      }

      user.role = "DOCTOR";
      await user.save();

      const doctor = await Doctor.create({
        user: user._id,
        speciality,
        degree,
        experience,
        about,
        fees,
        address: {
          line1: "",
          line2: "",
        },
        available: true,
        verificationStatus: "PENDING",
      });

      user.doctor = doctor._id;
      await user.save();

      revalidatePath("/");
      return { success: true, redirect: "/doctor/verification" };
    }
  } catch (error) {
    console.error("Failed to set user role:", error);
    throw new Error(error.message || "Failed to update user profile");
  }
}

export async function getCurrentUser() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return null;

  try {
    const user = await User.findOne({ clerkUserId: userId }).populate("doctor");
    return user;
  } catch (error) {
    console.error("Failed to get user information:", error);
    return null;
  }
}
