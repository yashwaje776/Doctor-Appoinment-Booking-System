import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    speciality: { type: String, required: true },

    degree: { type: String, required: true },

    experience: { type: Number, required: true },

    about: { type: String, required: true },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    available: { type: Boolean, default: true },

    fees: { type: Number, default: 0 },

    availability: {
      start: {
        type: String,
        default: "09:00",
      },
      end: {
        type: String,
        default: "17:00",
      },
    },
    slots_booked: {
      type: Map,
      of: [String],
      default: {},
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
