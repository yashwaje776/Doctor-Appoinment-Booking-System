"use server";

import Doctor from "@/models/Doctor";
import { connectDB } from "@/lib/connectDB";

export async function getDoctorsBySpeciality(speciality) {
  try {
    if (!speciality) throw new Error("Missing speciality");

    await connectDB();

    const doctors = await Doctor.find({
      speciality,
      verificationStatus: "VERIFIED",
    })
      .populate("user", "name email imageUrl")
      .lean();

    if (!doctors || doctors.length === 0) {
      return []; 
    }

    return doctors.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      user: doc.user
        ? {
            ...doc.user,
            _id: doc.user._id?.toString(),
          }
        : null,
    }));
  } catch (error) {
    console.error("getDoctorsBySpeciality Error:", error.message);
    throw new Error(error.message || "Failed to fetch doctors");
  }
}

export async function getDoctorById(speciality, id) {
  try {
    if (!id) throw new Error("Missing doctor ID");

    await connectDB();

    const doctor = await Doctor.findOne({
      _id: id,
      speciality,
      verificationStatus: "VERIFIED",
    })
      .populate("user", "name email imageUrl")
      .lean();

    if (!doctor) throw new Error("Doctor not found");

    return JSON.parse(JSON.stringify(doctor)); 
  } catch (error) {
    console.error("getDoctorById Error:", error.message);
    throw new Error(error.message || "Failed to fetch doctor");
  }
}


