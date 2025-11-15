"use server";

import { connectDB } from "@/lib/connectDB";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";
import { revalidatePath } from "next/cache";

const credentials = new Auth({
  applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_PRIVATE_KEY,
});
const options = {};
const vonage = new Vonage(credentials, options);

export async function bookAppointment(data) {
  try {
    await connectDB();

    const { doctorId, patientId, date, time, amount } = data;

    if (!doctorId || !patientId || !date || !time || !amount) {
      return { success: false, message: "Missing required fields" };
    }

    const exists = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (exists) {
      return {
        success: false,
        message: "This time slot is already booked. Select another time.",
      };
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return { success: false, message: "Doctor not found" };
    }

    const currentSlots = doctor.slots_booked.get(date) || [];

    if (currentSlots.includes(time)) {
      return {
        success: false,
        message: "This time slot is already booked.",
      };
    }

    doctor.slots_booked.set(date, [...currentSlots, time]);
    await doctor.save();

    let appointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      time,
      amount,
      status: "pending",
      paymentStatus: "pending",
    });
    const id = await createVideoSession();

    appointment.consultationLink = id;
    await appointment.save();

    revalidatePath("/appointments");

    return {
      success: true,
      appointment,
      message: "Appointment created successfully",
    };
  } catch (error) {
    console.error("Book Appointment Error:", error);
    return { success: false, message: "Server error while booking" };
  }
}

async function createVideoSession() {
  try {
    const session = await vonage.video.createSession({ mediaMode: "routed" });
    return session.sessionId;
  } catch (error) {
    throw new Error("Failed to create video session: " + error.message);
  }
}

export async function markPaymentPaid({
  appointmentId,
  razorpay_order_id,
  razorpay_payment_id,
}) {
  try {
    await connectDB();

    if (!appointmentId || !razorpay_order_id || !razorpay_payment_id) {
      return { success: false, message: "Missing payment details" };
    }

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: "paid",
        status: "confirmed",
      },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Appointment not found" };
    }

    revalidatePath("/appointments");

    return {
      success: true,
      message: "Payment status updated to paid",
      appointment: updated,
    };
  } catch (error) {
    console.error("Update Payment Error:", error);
    return { success: false, message: "Server error while updating payment" };
  }
}
export async function generateVideoToken(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await connectDB();

    const user = await User.findOne({ clerkUserId: userId }).populate("doctor");

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");
    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Authorization check
    if (
      appointment.doctorId.toString() !== user.doctor?._id.toString() &&
      appointment.patientId.toString() !== user._id.toString()
    ) {
      throw new Error("You are not authorized to join this call");
    }

    // --------------------------
    // ✔ Corrected Time Validation
    // --------------------------

    const now = new Date();
    const appointmentTime = new Date(`${appointment.date} ${appointment.time}`);

    // Minutes until appointment (negative if passed)
    const timeDifference = (appointmentTime - now) / (1000 * 60);

    // ❌ Appointment already passed
    if (timeDifference < -1) {
      throw new Error("The appointment time has already passed.");
    }

    // ❌ Appointment more than 30 minutes away
    if (timeDifference > 30) {
      throw new Error(
        "You can only join the video consultation 30 minutes before the appointment."
      );
    }

    // --------------------------
    // ✔ Token Expiration
    // --------------------------
    const appointmentEndTime = new Date(appointmentTime);
    appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + 30);

    const expirationTime =
      Math.floor(appointmentEndTime.getTime() / 1000) + 60 * 60;

    // Connection data sent to Vonage
    const connectionData = JSON.stringify({
      name: user.name,
      role: user.role,
      userId: user._id.toString(),
    });

    const token = vonage.video.generateClientToken(
      appointment.consultationLink,
      {
        role: "publisher",
        expireTime: expirationTime,
        data: connectionData,
      }
    );

    appointment.videoSessionToken = token;
    await appointment.save();

    return {
      success: true,
      videoSessionId: appointment.consultationLink,
      token,
    };
  } catch (error) {
    console.error("Failed to generate video token:", error);
    throw new Error("Failed to generate video token: " + error.message);
  }
}

export async function completeAppointment(appointmentId) {
  try {
    await connectDB();

    if (!appointmentId) {
      return { success: false, message: "Appointment ID is required" };
    }

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "completed" },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Appointment not found" };
    }

    revalidatePath("/appointments");

    return {
      success: true,
      message: "Appointment marked as completed",
      appointment: updated,
    };
  } catch (error) {
    console.error("Complete Appointment Error:", error);
    return { success: false, message: "Server error completing appointment" };
  }
}

export async function cancelAppointment(appointmentId) {
  try {
    await connectDB();

    if (!appointmentId) {
      return { success: false, message: "Appointment ID is required" };
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return { success: false, message: "Appointment not found" };
    }

    appointment.status = "cancelled";
    await appointment.save();

    const doctor = await Doctor.findById(appointment.doctorId);

    if (doctor && doctor.slots_booked) {
      const bookedSlots = doctor.slots_booked.get(appointment.date) || [];

      const updatedSlots = bookedSlots.filter(
        (slot) => slot !== appointment.time
      );

      doctor.slots_booked.set(appointment.date, updatedSlots);
      await doctor.save();
    }

    revalidatePath("/appointments");

    return {
      success: true,
      message: "Appointment cancelled successfully",
    };
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return { success: false, message: "Server error canceling appointment" };
  }
}
