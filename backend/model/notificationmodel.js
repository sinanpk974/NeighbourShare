import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "NEW_USER_REGISTRATION",
        "REQUEST",
        "REQUEST_ACCEPTED",
        "REQUEST_REJECTED",
        "ITEM_RETURNED",
        "REVIEW",
        "USER_VERIFIED",
        "USER_REJECTED",
        "USER_BLOCKED",
        "USER_UNBLOCKED",
        "ACCOUNT_DELETION_REQUEST",
        "ACCOUNT_DELETION_APPROVED",
        "ACCOUNT_DELETION_REJECTED",
        "ITEM_DELETED_BY_ADMIN",
        "REVIEW_DELETED_BY_ADMIN",
        "GENERAL",
      ],
      default: "GENERAL",
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "requests",
      default: null,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
      default: null,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const notificationSchemaModel = mongoose.model(
  "notifications",
  notificationSchema
);

export default notificationSchemaModel;