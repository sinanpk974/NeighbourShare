import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
{
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
        required: true
    },

    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    message: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Returned"],
        default: "Pending"
    },

    borrowDate: Date,

    expectedReturnDate: Date,

    actualReturnDate: Date
},
{
    timestamps: true
}
);

export default mongoose.models.requests ||
  mongoose.model("requests", requestSchema);