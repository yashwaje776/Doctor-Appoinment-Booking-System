import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      unique: true,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["ADMIN", "DOCTOR", "PATIENT", "UNASSIGNED"],
      default: "UNASSIGNED",
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    gender: {
      type: String,
      default: "Not selected",
    },

    dob: {
      type: String,
      default: "Not selected",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
