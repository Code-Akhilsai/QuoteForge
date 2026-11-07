import mongoose from "mongoose";

const rateMasterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["material", "machine"],
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    effectiveDate: {
      type: Date,
      required: [true, "Effective date is required"],
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const RateMaster = mongoose.model("RateMaster", rateMasterSchema);
