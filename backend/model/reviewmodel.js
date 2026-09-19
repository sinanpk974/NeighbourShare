import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "requests",
      required: true,
    },

    
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    
    type: {
      type: String,
      enum: ["item", "owner", "borrower"],
      required: true,
    },

    
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
      default: null,
    },


    reviewFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },


    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    review: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.reviews ||
  mongoose.model("reviews", reviewSchema);