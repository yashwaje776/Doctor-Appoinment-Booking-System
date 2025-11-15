"use server";

import { connectDB } from "@/lib/connectDB";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import { revalidatePath } from "next/cache";
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

    appointment.consultationLink = appointment._id.toString();
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
