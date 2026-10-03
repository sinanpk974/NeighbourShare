import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
    type: String,
    default: "",
    },

    imagePublicId: {
    type: String,
    default: "",
    },

    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Old"],
      default: "Good",
    },

    availability: {
      type: String,
      enum: ["Available", "Borrowed"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.items ||
  mongoose.model("items", itemSchema);