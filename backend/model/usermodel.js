import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    village: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
  type: String,
  enum: ["Pending", "Verified", "Rejected"],
  default: "Pending",
 },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    deletionStatus: {
   type: String,
    enum: ["None", "Pending", "Approved", "Rejected"],
    default: "None"
},

    
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.users ||
  mongoose.model("users", userSchema);