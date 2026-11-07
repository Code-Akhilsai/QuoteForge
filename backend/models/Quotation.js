import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    rfq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFQ",
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
      trim: true,
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 1,
    },
    unitCost: {
      type: Number,
      required: [true, "Unit cost is required"],
      min: 0,
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "approved", "rejected"],
      default: "draft",
    },
    validTill: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

quotationSchema.index({ status: 1 });
quotationSchema.index({ createdAt: -1 });

export const Quotation = mongoose.model("Quotation", quotationSchema);
